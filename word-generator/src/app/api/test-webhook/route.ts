
export const runtime = 'nodejs';

export async  function Post(request: Request){

    const body = await request.json();
    console.log('Webhook received:', body);
    return new Response(
        JSON.stringify({ ok: true, received: body }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
}