export type CheckoutPlan = 'starter' | 'entrepreneur' | 'pro'

type CreateCheckoutSessionInput = {
  plan?: CheckoutPlan
  priceId?: string
  email?: string
  fullName?: string
}

type CreateCheckoutSessionResponse = {
  url?: string
  error?: string
}

export const stripePublishableKey =
  import.meta.env.VITE_STIPE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
  ''

const API_URL = (import.meta.env.VITE_API_URL || '/_/backend').replace(/\/$/, '')

export async function createCheckoutSession(input: CreateCheckoutSessionInput = {}) {
  const response = await fetch(`${API_URL}/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  })

  const data = (await response.json()) as CreateCheckoutSessionResponse

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create checkout session')
  }

  if (!data.url) {
    throw new Error('No checkout URL returned from server')
  }

  return data.url
}

export async function redirectToCheckout(input: CreateCheckoutSessionInput = {}) {
  const checkoutUrl = await createCheckoutSession(input)
  window.location.assign(checkoutUrl)
}
