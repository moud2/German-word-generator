// /app/api/analyse-audio/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const userId = formData.get('userId') as string | null;       // optional
    const recordingId = formData.get('recordingId') as string | null; // optional

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1) Upload raw audio to AssemblyAI
    const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { authorization: process.env.ASSEMBLYAI_API_KEY! },
      body: buffer,
    });
    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return NextResponse.json({ error: 'Upload failed', detail: err }, { status: 502 });
    }
    const { upload_url: audio_url } = await uploadRes.json();

    // 2) Create transcript job with webhook + metadata
    const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        audio_url,
        language_code: 'de',
        format_text: false,
        // IMPORTANT: your webhook receiver
        webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/assembly-webhook`,
        // tip: put any context you need back later
        metadata: { userId, recordingId },
      }),
    });

    if (!transcriptRes.ok) {
      const err = await transcriptRes.text();
      return NextResponse.json({ error: 'Create transcript failed', detail: err }, { status: 502 });
    }

    const { id, status } = await transcriptRes.json();

    // 3) Return job id; UI can poll *your* DB or hit a “/status” route
    return NextResponse.json({ transcriptId: id, status: status ?? 'queued' }, { status: 202 });
  } catch (e: any) {
    console.error('analyse-audio error:', e);
    return NextResponse.json({ error: 'analyse-audio failed' }, { status: 500 });
  }
}
