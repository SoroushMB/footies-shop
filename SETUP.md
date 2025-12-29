# Footies-Shop Setup Guide

This guide will help you set up the complete e-commerce platform with the new tech stack.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) with Bun.js runtime
- **Backend**: Express.js 5 with Bun.js runtime
- **Database**: Supabase (PostgreSQL)
- **Images**: Cloudinary
- **Authentication**: Clerk
- **AI**: Google Gemini 3 Flash (primary) + OpenRouter (automatic fallback)
- **Payments**: Stripe
- **Runtime**: Bun.js

## Prerequisites

- Bun.js 1.0.0+ ([Install Bun](https://bun.sh))
- A Supabase account (free tier available)
- A Clerk account (free tier available)
- A Cloudinary account (free tier available)
- A Google AI API key (for AI features)

---

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Once created, go to **Project Settings** > **API**
4. Copy the following values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

5. Go to **SQL Editor** and run the contents of `backend/supabase-schema.sql`:
   - This creates all required tables (products, categories, carts, orders, users)
   - It also inserts sample data

---

## Step 2: Set Up Clerk

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Select the authentication methods you want (Email, Google, etc.)
4. Go to **API Keys** in the dashboard
5. Copy the following values:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`

6. Configure redirect URLs (Settings > Paths):
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

---

## Step 3: Set Up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. Go to **Dashboard**
3. Copy the following values:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

---

## Step 4: Get Google AI API Key (Optional, for AI features)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Copy the key → `GOOGLE_API_KEY`

---

## Step 4b: Get OpenRouter API Key (Optional, for AI fallback)

1. Go to [OpenRouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Go to **Keys** section
4. Create a new API key
5. Copy the key → `OPENROUTER_API_KEY`
6. (Optional) Set `OPENROUTER_DEFAULT_MODEL` to a specific model (defaults to `meta-llama/llama-3.2-3b-instruct:free` which is the fastest free model)

**Note**: OpenRouter will automatically be used as a fallback when Google Gemini quota is exhausted. The backend handles this automatically without any customer-facing changes.

---

## Step 4c: Set Up Stripe (Required for Payments)

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete account verification
3. Go to **Developers** → **API Keys**
4. Copy these values:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`
5. For webhooks (production):
   - Go to **Developers** → **Webhooks**
   - Click **"Add endpoint"**
   - URL: `https://your-backend-url.onrender.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## Step 5: Configure Environment Variables

### Frontend (.env.local)

Create a `.env.local` file in the root directory:

```env
# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:9002

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase (optional for frontend real-time features)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Backend (backend/.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Supabase Database
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Google AI (Gemini) - Primary AI provider
GOOGLE_API_KEY=AIzaxxxxx

# OpenRouter - Fallback AI provider (automatically used when Gemini quota is exhausted)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENROUTER_DEFAULT_MODEL=meta-llama/llama-3.2-3b-instruct:free  # Optional: defaults to fastest free model

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Required for production webhooks

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:9002
```

---

## Step 6: Install Dependencies

```bash
# Install frontend dependencies
bun install

# Install backend dependencies
cd backend
bun install
cd ..
```

---

## Step 7: Run the Application

### Development Mode

Run both frontend and backend simultaneously:

```bash
bun run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Frontend (port 9002)
bun run dev

# Terminal 2 - Backend (port 3001)
bun run dev:backend
```

### Production Build

```bash
# Build frontend
npm run build

# Build backend
cd backend
npm run build
```

---

## API Endpoints

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products with filtering |
| GET | /api/products/:id | Get product by ID or slug |
| GET | /api/products/featured | Get featured products |
| GET | /api/products/popular | Get popular products |
| GET | /api/categories | Get all categories |
| GET | /api/categories/:slug | Get category with products |
| POST | /api/ai/chat | AI customer support chat |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get user's cart |
| POST | /api/cart | Add item to cart |
| PUT | /api/cart/:itemId | Update cart item |
| DELETE | /api/cart/:itemId | Remove from cart |
| POST | /api/checkout | Process checkout |
| GET | /api/checkout/orders | Get user's orders |
| GET | /api/checkout/orders/:id | Get order by ID |
| GET | /api/users/me | Get user profile |
| PUT | /api/users/me | Update user profile |
| POST | /api/ai/suggestions | Get AI product suggestions |

---

## Project Structure

```
studio/
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and API client
│   └── middleware.ts      # Clerk auth middleware
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── app.ts        # Main Express app
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth & rate limiting
│   │   ├── models/       # Zod schemas
│   │   ├── routes/       # Express routes
│   │   └── services/     # Supabase, Cloudinary, AI
│   └── supabase-schema.sql
├── public/                # Static assets
└── package.json
```

---

## Troubleshooting

### "Clerk: Missing publishable key"
Make sure you've set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in your `.env.local` file.

### "Failed to connect to Supabase"
1. Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
2. Make sure the database tables exist (run the SQL schema)

### "CORS errors"
Make sure `FRONTEND_URL` in the backend `.env` matches your frontend URL.

### "AI features not working"
The AI features require either a Google API key or OpenRouter API key (or both).
- **Google Gemini** is used as the primary AI provider
- **OpenRouter** automatically falls back when Gemini quota is exhausted
- If both are configured, the system will automatically switch between them
- Without any API keys, chat and suggestions will return placeholder responses

---

## Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| Supabase | 500MB database, 1GB bandwidth |
| Clerk | 10,000 MAUs |
| Cloudinary | 25GB storage, 25GB bandwidth |
| Google AI | 60 requests/minute |
| OpenRouter | Free models available, pay-per-use for premium models |

---

## Next Steps

1. Customize the product data in Supabase
2. Upload product images to Cloudinary
3. Configure additional Clerk settings (branding, social logins)
4. Set up production deployment (Vercel + Render recommended)

