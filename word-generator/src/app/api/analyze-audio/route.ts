import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as Blob;
  
  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), {
      status: 400,
    });
  }

  try {
    // Convert the Blob to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = new Blob([buffer], { type: 'audio/webm' });

    // Prepare Whisper request to transcribe audio
    const whisperForm = new FormData();
    whisperForm.append('file', upload, 'audio.webm');
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('temperature', '0');


   // Step 1: Upload the file to AssemblyAI
const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
  method: 'POST',
  headers: {
    authorization: process.env.ASSEMBLYAI_API_KEY!,
  },
  body: buffer, // Direct buffer upload
});

const uploadData = await uploadRes.json();
const audio_url = uploadData.upload_url;

// Step 2: Start transcription job
const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
  method: 'POST',
  headers: {
    'authorization': process.env.ASSEMBLYAI_API_KEY!,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    audio_url,
    language_code: 'de', // Set explicitly to 'de' for German
    format_text: false,
  }),
});

const transcriptData = await transcriptRes.json();
const transcriptId = transcriptData.id;

// Step 3: Poll until transcription is complete
let status = transcriptData.status;
let transcriptText = '';

while (status !== 'completed' && status !== 'error') {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3s
  const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
    headers: { authorization: process.env.ASSEMBLYAI_API_KEY! },
  });
  const pollingData = await pollingRes.json();
  status = pollingData.status;
  if (status === 'completed') transcriptText = pollingData.text;
}

// If it failed
if (status !== 'completed') {
  throw new Error('AssemblyAI transcription failed');
}

const transcript = transcriptText;

    // Send transcript to GPT for language detection and feedback
    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
You are a German teacher reviewing SPOKEN language.

FIRST: Check if the speech is in German. If it's clearly NOT German (English, Spanish, French, etc.), return:
{
  "isGerman": false,
  "detectedLanguage": "detected language name",
  "corrections": []
}

If it IS German, analyze it with these rules:
- This is SPOKEN language - ignore missing punctuation, capitalization, or minor formatting
- Only correct actual grammar/vocabulary MISTAKES that would sound wrong when spoken
- Don't correct natural speech patterns, filler words, or casual pronunciation
- Don't correct proper names or places
- Don't suggest adding commas, periods, or capitalization
- Focus only on: wrong verb forms, wrong articles, wrong word order, wrong vocabulary
- Be thorough but focus on real grammatical errors that German speakers would notice

Return ONLY this JSON format (no markdown, no extra text):
{
  "isGerman": true,
  "corrections": [
    {
      "wrong": "exact wrong phrase from transcript",
      "correct": "the corrected version"
    }
  ]
}

If there are no real mistakes, return: {"isGerman": true, "corrections": []}
            `
          },
          {
            role: 'user',
            content: `Transcribed speech: "${transcript}"`
          },
        ],
      }),
    });

    const chatData = await chatRes.json();
    const feedback = chatData.choices?.[0]?.message?.content || '{"corrections": []}';

    return new Response(JSON.stringify({ transcript, feedback }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'AI processing failed' }), {
      status: 500,
    });
  }
}