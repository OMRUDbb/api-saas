# Vercel Deployment Configuration

## Environment Variables Setup

To fix the "Invalid Stripe price selected" error, you need to configure the following environment variables in your Vercel project settings.

### Backend Environment Variables

Go to your Vercel project → Settings → Environment Variables, and add these variables for the **backend** service:

1. **stripe_secret_key** (Backend only)
   - Get from: https://dashboard.stripe.com/apikeys
   - Format: `sk_test_...` or `sk_live_...`
   - This is your Stripe secret key

2. **stripe_price_starter** (Backend only)
   - Get from: Stripe Dashboard → Products → Pricing
   - Format: `price_...`
   - Example: `price_1ABC123XYZ456`

3. **stripe_price_entrepreneur** (Backend only)
   - Get from: Stripe Dashboard → Products → Pricing
   - Format: `price_...`
   - Example: `price_1DEF789UVW012`

4. **stripe_price_pro** (Backend only)
   - Get from: Stripe Dashboard → Products → Pricing
   - Format: `price_...`
   - Example: `price_1GHI345RST345`

5. **FRONTEND_URL** (Backend only)
   - Your production URL
   - Example: `https://your-app.vercel.app`
   - This is used for Stripe redirect URLs

### Frontend Environment Variables

Add these variables for the **frontend** service:

1. **VITE_STRIPE_PUBLIC_KEY** (Frontend only)
   - Get from: https://dashboard.stripe.com/apikeys
   - Format: `pk_test_...` or `pk_live_...`
   - This is your Stripe publishable key

2. **VITE_API_URL** (Frontend only)
   - For Vercel: `/_/backend`
   - For local development: `http://localhost:5000`

3. **VITE_STRIPE_PRICE_STARTER** (Frontend only)
   - Must match backend: `stripe_price_starter`
   - Example: `price_1ABC123XYZ456`

4. **VITE_STRIPE_PRICE_ENTREPRENEUR** (Frontend only)
   - Must match backend: `stripe_price_entrepreneur`
   - Example: `price_1DEF789UVW012`

5. **VITE_STRIPE_PRICE_PRO** (Frontend only)
   - Must match backend: `stripe_price_pro`
   - Example: `price_1GHI345RST345`

## How to Get Stripe Price IDs

1. Go to https://dashboard.stripe.com/test/products
2. Create products for each plan (Starter, Entrepreneur, Pro)
3. For each product, create a pricing plan
4. Copy the Price ID (starts with `price_`)
5. Add them to your Vercel environment variables

## Important Notes

- Variable names are **case-sensitive**
- Backend uses lowercase: `stripe_secret_key`, `stripe_price_starter`
- Frontend uses uppercase with VITE_ prefix: `VITE_STRIPE_PUBLIC_KEY`, `VITE_STRIPE_PRICE_STARTER`
- After adding variables, **redeploy** your application from Vercel dashboard
- The variables will not apply to existing deployments until you redeploy

## Testing

After configuration:
1. Redeploy your Vercel project
2. Navigate to your checkout page
3. Fill in the form and click "Proceed to Payment"
4. You should be redirected to Stripe checkout
5. Complete or cancel the payment to test the flow

## Troubleshooting

If you still get "Invalid Stripe price selected":
1. Check that price IDs in frontend and backend match exactly
2. Verify the variables are added to the correct service (frontend vs backend)
3. Make sure you redeployed after adding the variables
4. Check Vercel deployment logs for errors
