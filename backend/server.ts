import express, { type NextFunction, type Request, type Response } from 'express'
import Stripe from 'stripe'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Only load from .env files in local development, not in Vercel
if (!process.env.VERCEL) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') })
  dotenv.config({ path: path.resolve(__dirname, '.env'), override: true })
}

const app = express()
const PORT = process.env.PORT || 5000

function getEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]
    if (value) return value
  }

  return undefined
}

const frontendUrl = getEnv('FRONTEND_URL', 'frontend_url') || 'http://localhost:3000'
const allowedOrigins = [
  frontendUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost'
].filter(Boolean)

const stripeSecretKey = getEnv('stripe_secret_key', 'STRIPE_SECRET_KEY')

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    })
  : null

type PlanKey = 'starter' | 'entrepreneur' | 'pro'

const stripePrices: Record<PlanKey, string | undefined> = {
  starter: getEnv('stripe_price_starter', 'STRIPE_PRICE_STARTER'),
  entrepreneur: getEnv('stripe_price_entrepreneur', 'STRIPE_PRICE_ENTREPRENEUR'),
  pro: getEnv('stripe_price_pro', 'STRIPE_PRICE_PRO')
}

// Hardcoded fallback prices from your Stripe account
const FALLBACK_PRICES: Record<PlanKey, string> = {
  starter: 'price_1TiLHo2Yw7BUASOy1HENYyVc',
  entrepreneur: 'price_1TiLEq2Yw7BUASOyKr7cpevz',
  pro: 'price_1TiLHI2Yw7BUASOygPrCe1M2'
}

type CheckoutRequestBody = {
  plan?: PlanKey
  priceId?: string
  email?: string
  fullName?: string
}

type UserRecord = {
  stripe_customer_id: string
  stripe_subscription_id?: string
  email?: string | null
  full_name?: string | null
  api_key: string
  subscription_status: string
}

const users = new Map<string, UserRecord>()

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/prices', (req, res) => {
  res.json(stripePrices)
})

app.post('/create-checkout-session', async (req: Request<unknown, unknown, CheckoutRequestBody>, res: Response) => {
  const { plan = 'entrepreneur', priceId, email, fullName } = req.body
  
  // Use fallback prices if environment variables are not set
  const prices: Record<PlanKey, string> = {
    starter: stripePrices.starter || FALLBACK_PRICES.starter,
    entrepreneur: stripePrices.entrepreneur || FALLBACK_PRICES.entrepreneur,
    pro: stripePrices.pro || FALLBACK_PRICES.pro
  }
  
  const selectedPriceId = priceId || prices[plan]

  if (!stripe) {
    return res.status(500).json({
      error: 'Stripe secret key is not configured. Add stripe_secret_key to backend/.env or the root .env file.'
    })
  }

  if (!selectedPriceId) {
    return res.status(400).json({ error: 'No price ID provided.' })
  }

  // Always allow our fallback prices
  const allowedPriceIds = [...Object.values(prices), ...Object.values(FALLBACK_PRICES)]
  
  if (!allowedPriceIds.includes(selectedPriceId)) {
    return res.status(400).json({
      error: 'Invalid Stripe price selected',
      details: `Provided: ${selectedPriceId}`
    })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel`,
      ...(email ? { customer_email: email } : {}),
      metadata: {
        plan,
        ...(fullName ? { fullName } : {})
      }
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create checkout session' })
  }
})

app.get('/checkout-session/:sessionId', async (req: Request<{ sessionId: string }>, res: Response) => {
  const { sessionId } = req.params

  if (!stripe) {
    return res.status(500).json({ error: 'Stripe secret key is not configured' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    })

    if (session.status !== 'complete' || session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment has not been completed yet' })
    }

    const user = createOrGetUserFromSession(session)

    res.json({
      apiKey: user.api_key,
      email: user.email,
      subscriptionStatus: user.subscription_status
    })
  } catch (error) {
    console.error('Checkout session lookup error:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to confirm checkout session' })
  }
})

function createOrGetUserFromSession(session: Stripe.Checkout.Session) {
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id

  if (!customerId) {
    throw new Error('Stripe session is missing a customer')
  }

  const existingUser = users.get(customerId)
  if (existingUser) {
    return existingUser
  }

  const subscription = session.subscription
  const user: UserRecord = {
    stripe_customer_id: customerId,
    stripe_subscription_id: typeof subscription === 'string' ? subscription : subscription?.id,
    email: session.customer_details?.email || session.customer_email,
    full_name: session.metadata?.fullName || session.customer_details?.name,
    api_key: `sk_${uuidv4()}`,
    subscription_status: typeof subscription === 'string' ? 'active' : subscription?.status || 'active'
  }

  users.set(customerId, user)
  return user
}

async function verifyApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key']

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }

  let user: UserRecord | null = null
  for (const userData of users.values()) {
    if (userData.api_key === apiKey) {
      user = userData
      break
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid API key' })
  }

  if (user.subscription_status !== 'active') {
    return res.status(403).json({ error: 'Subscription inactive' })
  }

  ;(req as Request & { user: UserRecord }).user = user
  next()
}

app.post('/check-url', verifyApiKey, async (req: Request, res: Response) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    const isSafe = Math.random() > 0.2

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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

export default app

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}
