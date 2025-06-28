import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { to, subject, message } = await req.json();

  try {
    const data = await resend.emails.send({
      from: "noreply@germantopic.com",   
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response("Error sending email", { status: 500 });
  }
}
