# Backend Configuration

## Environment Variables

```env
PORT=5000
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

FRONTEND_URL=http://localhost:3000
```

## Database Schema

### users table
- id (UUID, primary key)
- stripe_customer_id (text)
- email (text, unique)
- full_name (text)
- api_key (text, unique)
- subscription_status (text)
- created_at (timestamp)
- updated_at (timestamp)

### subscriptions table
- id (UUID, primary key)
- stripe_subscription_id (text, unique)
- stripe_customer_id (text)
- status (text)
- current_period_start (timestamp)
- current_period_end (timestamp)
- created_at (timestamp)
- updated_at (timestamp)

### api_usage table
- id (UUID, primary key)
- user_id (UUID, foreign key)
- endpoint (text)
- request_count (integer)
- date (date)
- created_at (timestamp)
