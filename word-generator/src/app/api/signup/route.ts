import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // 1️⃣ create user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  const user = data.user;

  // 2️⃣ create profile
  await supabaseAdmin.from('profiles').insert({
    id: user.id,
    available_minutes: 3,
  });

  // 3️⃣ generate token
  const token = nanoid(32);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await supabaseAdmin.from('verification_tokens').insert({
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
  });

  // 4️⃣ send confirmation email
  const confirmLink = `http://germantopic.com/verify?token=${token}`;

  await resend.emails.send({
    from: "noreply@germantopic.com",
    to: email,
    subject: "Confirm your email",
    html: `
      <p>Welcome! Please confirm your email by clicking below:</p>
      <p><a href="${confirmLink}">Confirm your account</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });

  // 5️⃣ return OK
  return Response.json({ success: true });
}
