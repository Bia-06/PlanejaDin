import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})
const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req: any) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret!, undefined, cryptoProvider)
  } catch (err: any) { 
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  if (event.type.startsWith('customer.subscription.')) {
    const subscription = event.data.object
    
    const isPro = subscription.status === 'active' || subscription.status === 'trialing'
    
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()
    const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null

    await supabase
      .from('profiles')
      .update({ 
        is_pro: isPro,
        subscription_status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        subscription_ends_at: currentPeriodEnd,
        trial_ends_at: trialEnd,
        subscription_plan: isPro ? 'pro' : 'free'
      })
      .eq('stripe_customer_id', subscription.customer)
  }

  return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } })
})