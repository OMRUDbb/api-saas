<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# URLSafe - API SaaS Application

## Project Overview
URLSafe is a full-stack SaaS application that provides a URL safety checking API. It features a modern landing page with pricing, Stripe payment integration, and Supabase database for user and API key management.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, Stripe SDK
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Styling**: Tailwind CSS

## Project Structure
```
api-saas/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/   # Hero, Features, Pricing, CTA, Navbar, Footer
│   │   ├── pages/        # Home, Checkout
│   │   └── index.css     # Global styles with Tailwind
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/           # Express API server
│   ├── server.js      # Main server with Stripe webhooks & API endpoints
│   └── package.json
└── README.md
```

## Key Features Implemented
- ✅ Landing page with Hero, Features, Pricing sections
- ✅ Responsive mobile-first design
- ✅ Stripe checkout integration
- ✅ Express backend with webhook handling
- ✅ API key verification middleware
- ✅ Supabase integration setup
- ✅ Environment configuration templates

## Getting Started

### Development
1. **Frontend**: `cd frontend && npm install && npm run dev`
2. **Backend**: `cd backend && npm install && npm run dev`
3. Copy `.env.example` to `.env` and fill in credentials

### Configuration
1. Add Stripe keys to both `.env` files
2. Add Supabase credentials to backend `.env`
3. Update `FRONTEND_URL` in backend `.env` for redirects

## Important Notes
- Frontend uses Vite for fast development and builds
- Backend includes Stripe webhook verification for security
- All API endpoints require `X-API-Key` header except webhooks
- Database schema defined in `backend/DATABASE_SCHEMA.md`
- Tailwind CSS configured with custom colors (primary: blue-600, accent: green-500)

## Development Guidelines
- Frontend components are organized by feature (Hero, Features, Pricing, etc.)
- Backend routes are RESTful and RESTful first
- Use environment variables for all sensitive data
- Maintain responsive design across all screen sizes

## Next Steps
1. Set up Stripe and Supabase accounts
2. Configure environment variables
3. Run migrations to set up Supabase database tables
4. Test Stripe webhook integration
5. Customize pricing and features as needed
