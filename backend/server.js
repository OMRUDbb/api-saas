import express from 'express'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost'],
  credentials: true
}))
app.use(express.json())

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Create checkout session
app.post('/checkout', async (req, res) => {
  const { priceId, email, fullName } = req.body

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
      customer_email: email,
      metadata: {
        fullName,
      },
    })

    res.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Webhook for Stripe events
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
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
})

// Webhook handlers
async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id)
  // Store customer info and create API key
  const apiKey = `sk_${uuidv4()}`
  
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        stripe_customer_id: session.customer,
        email: session.customer_email,
        full_name: session.metadata.fullName,
        api_key: apiKey,
        subscription_status: 'active',
      }
    ])

  if (error) {
    console.error('Error creating user:', error)
  } else {
    console.log('User created successfully:', data)
  }
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

  if (error) {
    console.error('Error creating subscription:', error)
  }
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

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id)
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

// API Key verification middleware
export async function verifyApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key']

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('api_key', apiKey)
    .single()

  if (error || !data) {
    return res.status(401).json({ error: 'Invalid API key' })
  }

  if (data.subscription_status !== 'active') {
    return res.status(403).json({ error: 'Subscription inactive' })
  }

  req.user = data
  next()
}

// URL check endpoint (protected)
app.post('/check-url', verifyApiKey, async (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    // Placeholder for actual URL checking logic
    // In a real implementation, you would call your threat detection service
    const isSafe = Math.random() > 0.2 // 80% safe for demo
    
    res.json({
      url,
      safe: isSafe,
      threat_level: isSafe ? 'none' : 'high',
      trust_score: isSafe ? 95 : 15,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('URL check error:', error)
    res.status(500).json({ error: 'Failed to check URL' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Export app for Vercel
export default app

// For local development
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}
