import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  // check if token is valid
  const { data, error } = await supabaseAdmin
    .from("verification_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: "Invalid or expired token." }), {
      status: 400,
    });
  }

  const { user_id, expires_at } = data;

  if (new Date() > new Date(expires_at)) {
    return new Response(JSON.stringify({ error: "Token expired." }), { status: 400 });
  }

  // mark user confirmed
  const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
    email_confirm: true,
  });

  if (confirmError) {
    return new Response(JSON.stringify({ error: confirmError.message }), { status: 500 });
  }

  // delete token
  await supabaseAdmin
    .from("verification_tokens")
    .delete()
    .eq("token", token);

  return Response.json({ success: true });
}
