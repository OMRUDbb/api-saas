# URLSafe - URL Safety Checking API & Web Application

A modern full-stack SaaS application that checks if URLs are safe or dangerous using advanced threat detection. Built with React, Express, Stripe, and Supabase.

## 🎯 Features

- **Real-time URL Safety Detection**: Instantly check if URLs are malicious, phishing, or safe
- **RESTful API**: Easy-to-integrate API for URL checking
- **Stripe Integration**: Seamless payment processing and subscription management
- **Supabase Database**: Secure user and API key storage with PostgreSQL
- **Responsive Design**: Beautiful, mobile-friendly landing page
- **Multiple Pricing Tiers**: Starter, Professional, and Enterprise plans
- **API Key Management**: Automatic API key generation and management

## 📁 Project Structure

```
api-saas/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
├── backend/               # Node.js Express backend
│   ├── server.js          # Main server file
│   ├── package.json
│   └── DATABASE_SCHEMA.md # Database structure
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Stripe account (for payments)
- Supabase account (for database)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Add your Stripe public key to .env.local
npm run dev
```

The frontend will start on `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Add your Stripe secret key, Supabase credentials to .env
npm run dev
```

The backend will start on `http://localhost:5000`

## 📋 Environment Variables

### Frontend (.env.local)
```
VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLIC_KEY=pk_test_your_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
FRONTEND_URL=http://localhost:3000
```

## 🌐 Pages & Sections

### Landing Page
- **Hero Section**: Main call-to-action with feature highlights
- **Features Section**: 6 key features with icons
- **Pricing Section**: 3 tiered pricing plans
- **CTA Section**: Final call-to-action before footer

### Checkout Page
- Plan selection
- Customer information form
- Price calculation
- Stripe payment integration

## 💳 Stripe Integration

- **Checkout Sessions**: Creates Stripe checkout for subscriptions
- **Webhooks**: Handles payment events and updates database
- **API Key Generation**: Automatically generates API keys on successful checkout

## 🗄️ Database (Supabase)

### Tables
- **users**: Stores customer and API key information
- **subscriptions**: Tracks subscription status and periods
- **api_usage**: Logs API calls for analytics

See `backend/DATABASE_SCHEMA.md` for detailed schema.

## 🔐 API Authentication

All API endpoints require the `X-API-Key` header with a valid API key.

### Example Request
```bash
curl -X POST http://localhost:5000/api/check-url \
  -H "X-API-Key: sk_xxx" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Response
```json
{
  "url": "https://example.com",
  "safe": true,
  "threat_level": "none",
  "trust_score": 95,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Modern Colors**: Blue primary (#3B82F6), Green accent (#10B981)

## 📦 Dependencies

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Stripe React
- Axios

### Backend
- Express
- Stripe SDK
- Supabase Client
- CORS
- UUID
- Dotenv

## 🔄 Next Steps

1. **Set up Stripe Account**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Get API keys (public & secret)
   - Create price objects for each plan

2. **Set up Supabase**
   - Create project at [supabase.com](https://supabase.com)
   - Run database schema from `backend/DATABASE_SCHEMA.md`
   - Get your URL and anon key

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env` in both frontend and backend
   - Fill in your credentials

4. **Start Development**
   - Frontend: `npm run dev` in `/frontend`
   - Backend: `npm run dev` in `/backend`

5. **Deploy** (Coming Soon)
   - Frontend: Deploy to Vercel or Netlify
   - Backend: Deploy to Heroku, Railway, or AWS

## 📚 API Documentation

### Endpoints

- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/check-url` - Check URL safety (requires API key)
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `GET /api/health` - Health check

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and create a new branch for features.

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

For issues and questions, please create an issue in the GitHub repository.

---

**Built with ❤️ for web security**
