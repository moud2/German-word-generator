// /app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    

  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
   
   const session = event.data.object as Stripe.Checkout.Session;



const userId = session.metadata?.user_id;



    if (userId) {
      try {
        // Get line items to determine what was purchased
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;
        
        // Determine minutes based on price_id
        const minutesToAdd = getMinutesFromPriceId(priceId);

        
        if (minutesToAdd > 0) {
          // Get current minutes
          const { data: currentData, error: fetchError } = await supabase
            .from('profiles')
            .select('available_minutes')
            .eq('id', userId)
            .single();

          if (fetchError) {
            console.error('Failed to fetch current minutes:', fetchError);
          } else {
            const currentMinutes = currentData?.available_minutes ?? 0;
            const newMinutes = currentMinutes + minutesToAdd;

            // Update with new total
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ available_minutes: newMinutes })
              .eq('id', userId);

            if (updateError) {
              console.error('Failed to add minutes:', updateError);
            } else {
              console.log(`Successfully added ${minutesToAdd} minutes to user ${userId}. Total: ${newMinutes}`);
            }
          }
        } else {
          console.log(`No minutes to add for price_id: ${priceId}`);
        }
      } catch (error) {
        console.error('Error processing checkout session:', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}

function getMinutesFromPriceId(priceId: string | undefined): number {
  // Map your price IDs to minutes
  const priceToMinutes: Record<string, number> = {
    // 'price_1Rb54bCX5IVNSF5NOnnvp0JI': 10, // Your current price ID gives 10 minutes
    'price_1RcXI9CX5IVNSF5NEdxdcAzl': 10,// Add more price IDs here as you create more products price_1RcVowCX5IVNSF5N31jmNqwA
    // 'price_XXXXXXXXX': 25,  // Example: 25 minutes package
    // 'price_YYYYYYYYY': 50,  // Example: 50 minutes package
  };
  
  return priceToMinutes[priceId || ''] || 0;
}