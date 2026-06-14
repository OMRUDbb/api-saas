import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id)
  const apiKey = `sk_${session.id.substring(0, 8)}`
  
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        stripe_customer_id: session.customer,
        email: session.customer_email,
        full_name: session.metadata?.fullName || 'Unknown',
        api_key: apiKey,
        subscription_status: 'active',
      }
    ])

  if (error) console.error('Error creating user:', error)
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id)
  const { error } = await supabase
    .from('subscriptions')
    .insert([
      {
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
      }
    ])

  if (error) console.error('Error creating subscription:', error)
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id)
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) console.error('Error updating subscription:', error)
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id)
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id)

  if (error) console.error('Error updating subscription:', error)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook error:', err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
    }
    res.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: error.message })
  }
}
