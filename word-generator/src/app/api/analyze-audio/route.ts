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
        model: 'gpt-3.5-turbo',

        messages: [
{
 role: 'system',
content: `
You are a helpful German teacher AI. When the user gives you spoken input (already transcribed), analyze it and return feedback in the following clean format:

 Feedback

1. ❌ You said:
   "<wrong sentence>"

   ✅ AI Suggests:
   "<corrected version>"

---

2. ❌ You said:
   "<next wrong sentence>"

   ✅ AI Suggests:
   "<next corrected version>"

---

Rules:
- Only return grammar mistakes, skip any sentence that’s already correct.
- Do not include accuracy, confidence, or grammar topics.
- Format the entire output as plain text (no code or JSON).
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
