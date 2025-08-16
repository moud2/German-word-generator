// /app/api/assembly-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// optional: set Node runtime to ensure crypto availability
export const dynamic = 'force-dynamic';

// Replace with your DB of choice; here’s a simple stub API
async function upsertTranscript(row: any) { /* write to DB */ }
async function alreadyProcessed(id: string) { return false; }

function verifySignature(rawBody: string, req: NextRequest) {
  // If you configured AssemblyAI to send a signature/HMAC header,
  // replace 'x-assemblyai-signature' with the actual header name.
  const header = req.headers.get('x-assemblyai-signature');
  const secret = process.env.ASSEMBLYAI_WEBHOOK_SECRET;

  if (!secret || !header) return false;

  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(header));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // 1) Read RAW body first
  const raw = await req.text();

  // 2) Verify (if you have webhook signing enabled)
  const verified = verifySignature(raw, req);
  if (!verified) {
    // Optional fallback: parse, then confirm by refetching transcript by id using API key.
    // For strict mode, just reject:
    // return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
  }

  // 3) Parse payload
  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    id,                 // transcript id
    status,             // "queued" | "processing" | "completed" | "error"
    text,
    audio_url,
    confidence,
    utterances,
    words,
    language_code,
    error,
    metadata,           // { userId, recordingId } from creation
  } = payload;

  // 4) Idempotency: skip if we saw this before
  if (await alreadyProcessed(id)) {
    return NextResponse.json({ ok: true, dedup: true });
  }

  // 5) Store/update transcript row
  await upsertTranscript({
    id,
    status,
    text,
    audio_url,
    confidence,
    language_code,
    error,
    utterances,
    words,
    metadata,
    updated_at: new Date().toISOString(),
  });

  // 6) If completed, optionally run GPT feedback and store it
  if (status === 'completed' && text) {
    try {
      const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // (or your choice)
          messages: [
            {
              role: 'system',
              content: `
You are a German teacher reviewing SPOKEN language from learners.

FIRST: Check if the speech is in German. If it's clearly NOT German, return:
{"isGerman": false, "detectedLanguage": "name", "corrections": []}

If it IS German, analyze it carefully. Ignore punctuation/casing/fillers.
Focus on verb forms, article/case errors, word order, and unnatural phrasing.
Return ONLY JSON:
{"isGerman": true, "corrections":[{"wrong":"...","correct":"..."}]}
              `.trim(),
            },
            { role: 'user', content: `Transcribed speech: "${text}"` },
          ],
          temperature: 0,
          response_format: { type: 'json_object' },
        }),
      });

      const data = await chatRes.json();
      const feedback = data?.choices?.[0]?.message?.content ?? '{"corrections": []}';

      // Save feedback to DB with the transcript row
      await upsertTranscript({
        id,
        status: 'completed',
        text,
        feedback_json: feedback,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('feedback generation failed:', e);
      // keep webhook 200; you can retry feedback later via a job/cron
    }
  }

  // 7) ACK fast
  return NextResponse.json({ ok: true });
}
