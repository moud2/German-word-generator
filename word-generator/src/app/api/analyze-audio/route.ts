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

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: whisperForm,
    });

    const whisperData = await whisperRes.json();
    const transcript = whisperData.text;

    // Send transcript to GPT for feedback (plain English teacher mode)
    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o' ,

        messages: [
{
  role: 'system',
  content: `
You are a helpful German teacher AI.

When the user gives you spoken German (already transcribed), analyze the grammar and return feedback in this JSON format:

type FeedbackItem = {
  original: string;
  corrected: string;
  highlights: { wrong: string; correct: string }[];
  explanation?: string;
};

type SmartFeedback = {
  items: FeedbackItem[];
  grammarTopics?: string[];
  overallScore?: number;
};

Rules:
- Only include sentences with mistakes.
- Focus on grammar and vocabulary errors.
- Each highlight pair must be minimal (word-level if possible).
- Make the JSON clean, parsable, and valid.
-dont correct names 
`
}


,
          {
            role: 'user',
            content: transcript,
          },
        ],
      }),
    });

    const chatData = await chatRes.json();
    const feedback = chatData.choices?.[0]?.message?.content || 'No feedback.';

    return new Response(JSON.stringify({ transcript, feedback }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(' API error:', err);
    return new Response(JSON.stringify({ error: 'AI processing failed' }), {
      status: 500,
    });
  }
}
