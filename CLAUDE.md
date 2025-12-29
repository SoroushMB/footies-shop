# CLAUDE.md - Codebase Documentation

## Project Overview

**Footies-Shop** is a modern, production-ready e-commerce application built with Next.js 16 for selling football (soccer) gear. The application features AI-powered product suggestions, customer support chat, Stripe payment processing, and a complete shopping cart/checkout system.

### Key Features
- E-commerce product catalog with categories (Jerseys, Footballs, Apparel, Footwear, Accessories)
- Clerk Authentication for user management
- Shopping cart with localStorage persistence (client-side) and Supabase (server-side)
- AI-powered product suggestions using Google Gemini 3 Flash with OpenRouter fallback
- AI customer support chat widget with automatic fallback
- Stripe payment processing with payment intents
- Protected API routes with Clerk token verification
- Modern UI with glassmorphism effects and dark theme
- Responsive design with mobile menu
- Production-ready deployment configuration for Render.com

---

## Technology Stack

### Core Framework
- **Next.js 16.1.1** (App Router) with Bun.js runtime
- **React 19.0.0**
- **TypeScript 5.8.3**

### Backend Framework
- **Express.js 5.1.0** with Bun.js runtime
- **Bun.js** (>=1.0.0) as runtime and package manager

### Styling & UI
- **Tailwind CSS 3.4.1** with custom configuration
- **Radix UI** components (Dialog, Dropdown, Sheet, etc.)
- **Framer Motion 12.23.26** for animations
- **Lucide React** for icons
- **Poppins** font from Google Fonts

### Backend & Database
- **Supabase** (PostgreSQL) - Database and backend services
- **@supabase/supabase-js** (v2.49.8) - Client SDK
- **Row Level Security (RLS)** enabled for data protection

### Authentication
- **Clerk** - Complete authentication solution
- **@clerk/nextjs** (v6.12.0) - Next.js integration
- **@clerk/backend** (v1.21.2) - Backend integration

### Images & Assets
- **Cloudinary** - Image storage and CDN
- **next-cloudinary** (v6.17.5) - Next.js integration
- **cloudinary** (v2.5.1) - Backend SDK

### AI Integration
- **Google Gemini 3 Flash Preview** - Primary AI provider
- **@google/generative-ai** (v0.24.1) - Google AI SDK
- **OpenRouter** - Automatic fallback AI provider
- **@openrouter/sdk** (v0.3.10) - OpenRouter SDK
- **Automatic fallback** when Gemini quota is exhausted
- **RAG (Retrieval-Augmented Generation)** - Context-aware AI responses
  - Retrieves product information from database
  - Includes store policies, FAQs, and shipping information
  - Enhances AI accuracy with real-time knowledge base

### Payment Processing
- **Stripe** - Payment processing
- **stripe** (v17.3.1) - Backend SDK
- **@stripe/stripe-js** (v4.8.0) - Frontend SDK
- **@stripe/react-stripe-js** (v3.7.0) - React components

### Validation & Forms
- **Zod** (v3.25.76) - Schema validation
- **React Hook Form** (v7.54.2) - Form management
- **@hookform/resolvers** (v5.2.2) - Zod integration for forms

### Other Dependencies
- **date-fns** (v4.1.0) - Date utilities
- **embla-carousel-react** - Carousel component
- **recharts** - Charting library
- **class-variance-authority** - Component variants
- **clsx** & **tailwind-merge** - Conditional class utilities

---

## Project Structure

```
studio/
├── src/                          # Next.js frontend
│   ├── app/                     # App Router pages
│   │   ├── actions/             # Server actions
│   │   │   ├── chat.ts         # Chat action wrapper
│   │   │   └── product.ts       # Product suggestion action wrapper
│   │   ├── account/             # User account page
│   │   ├── category/[slug]/     # Category product listing page
│   │   ├── checkout/            # Checkout page
│   │   ├── product/[slug]/      # Product detail page
│   │   ├── sign-in/            # Clerk sign-in page
│   │   ├── sign-up/            # Clerk sign-up page
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx             # Homepage
│   │
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── add-to-cart-button.tsx
│   │   ├── cart-sheet.tsx
│   │   ├── chat-widget.tsx     # AI support chat widget
│   │   ├── product-card.tsx
│   │   ├── product-suggestions.tsx  # AI product suggestions component
│   │   ├── site-footer.tsx
│   │   ├── site-header.tsx
│   │   ├── stripe-provider.tsx  # Stripe Elements provider
│   │   └── welcome-dialog.tsx
│   │
│   ├── contexts/                # React contexts
│   │   └── cart-provider.tsx   # Shopping cart state (localStorage + server sync)
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── api.ts              # API client for backend
│   │   ├── data.ts             # Static product/category data
│   │   ├── supabase.ts         # Supabase client config
│   │   └── utils.ts            # Utility functions (cn, etc.)
│   │
│   ├── models/                  # TypeScript interfaces
│   │   ├── Cart.ts
│   │   ├── Category.ts
│   │   ├── Order.ts
│   │   ├── Product.ts
│   │   └── User.ts
│   │
│   └── middleware.ts            # Next.js middleware for Clerk auth
│
├── backend/                      # Express.js backend
│   ├── src/
│   │   ├── app.ts              # Main Express app
│   │   ├── config/             # Configuration
│   │   │   └── index.ts       # Environment variable loading
│   │   ├── controllers/        # Route handlers
│   │   │   ├── ai.ts          # AI endpoints
│   │   │   ├── cart.ts        # Cart endpoints
│   │   │   ├── categories.ts  # Category endpoints
│   │   │   ├── checkout.ts    # Checkout endpoints
│   │   │   ├── payments.ts    # Stripe payment endpoints
│   │   │   ├── products.ts    # Product endpoints
│   │   │   └── users.ts       # User endpoints
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.ts        # Clerk authentication middleware
│   │   │   └── rateLimit.ts   # Rate limiting middleware
│   │   ├── models/             # Zod schemas
│   │   │   └── schemas.ts     # Request/response validation
│   │   ├── routes/             # Express routes
│   │   │   ├── ai.ts
│   │   │   ├── cart.ts
│   │   │   ├── categories.ts
│   │   │   ├── checkout.ts
│   │   │   ├── payments.ts    # Stripe payment routes
│   │   │   ├── products.ts
│   │   │   └── users.ts
│   │   └── services/           # External service integrations
│   │       ├── ai.ts           # Google Gemini + OpenRouter
│   │       ├── rag.ts          # RAG (Retrieval-Augmented Generation) service
│   │       ├── cloudinary.ts   # Cloudinary integration
│   │       ├── stripe.ts       # Stripe integration
│   │       └── supabase.ts     # Supabase integration
│   └── supabase-schema.sql      # Database schema
│
├── render.yaml                   # Render.com deployment config
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Frontend dependencies
├── backend/package.json          # Backend dependencies
├── postcss.config.mjs
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── DEPLOYMENT.md                 # Comprehensive deployment guide
├── SETUP.md                      # Setup instructions
├── PRODUCTION_CHECKLIST.md       # Production deployment checklist
└── README.md                     # Project overview
```

---

## Data Models

### Product
```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;           // Display name (e.g., "Jerseys")
  categorySlug: string;       // URL slug (e.g., "jerseys")
  price: number;
  images: string[];
  brand: string;
  sizes: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  stock: number;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  filters?: {
    brands?: string[];
    teams?: string[];
    nationalTeams?: string[];
  };
}
```

### Cart
```typescript
interface CartItem {
  productId: string;
  quantity: number;
  price: number;  // Price at time of adding to cart
  size?: string;
}

interface Cart {
  userId: string;  // Clerk user ID
  items: CartItem[];
}
```

### User
```typescript
interface User {
  uid: string;  // Clerk user ID
  email: string;
  name: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}
```

### Order
```typescript
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  orderId: string;
  userId: string;  // Clerk user ID
  items: CartItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentIntentId?: string;  // Stripe payment intent ID
  orderDate: Date;
  status: OrderStatus;
}
```

---

## API Routes

### Backend API (Express.js)

#### Public Routes

**Products**
- `GET /api/products` - Get all products
  - Query params: `category`, `brand`, `search`, `minPrice`, `maxPrice`, `sortBy`, `page`, `limit`
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/popular` - Get popular products

**Categories**
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

**AI**
- `POST /api/ai/chat` - AI customer support chat (public)

**Health**
- `GET /health` - Health check endpoint

#### Protected Routes (Require Clerk Auth Token)

All protected routes require:
- `Authorization: Bearer <clerk-session-token>` header
- Middleware verifies token and adds `userId` to request

**Cart**
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add product to cart
  - Body: `{ productId: string, quantity: number, size?: string }`
- `PUT /api/cart/:itemId` - Update cart item quantity
  - Body: `{ quantity: number }`
- `DELETE /api/cart/:itemId` - Remove item from cart

**Checkout**
- `POST /api/checkout` - Process checkout
  - Body: `{ shippingAddress: {...}, paymentIntentId?: string }`
  - Returns: `{ orderId, totalAmount, status, paymentIntentId, clientSecret }`
- `GET /api/checkout/orders` - Get user's orders
- `GET /api/checkout/orders/:id` - Get order by ID

**Payments (Stripe)**
- `POST /api/payments/create-intent` - Create Stripe payment intent
  - Body: `{ amount: number, currency?: string }`
  - Returns: `{ clientSecret, paymentIntentId }`
- `GET /api/payments/intent/:id` - Get payment intent status

**User Profile**
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
  - Body: `{ name?: string, shippingAddress?: {...} }`

**AI Suggestions**
- `POST /api/ai/suggestions` - Get AI product suggestions
  - Body: `{ currentProductId: string }`
  - Returns: `{ suggestions: string[], reasoning: string }`

---

## Authentication & Authorization

### Client-Side Auth
- Uses Clerk Next.js SDK (`@clerk/nextjs`)
- `ClerkProvider` wraps the application in root layout
- `useAuth()` hook provides: `{ isSignedIn, userId, getToken }`
- Protected routes handled by middleware

### Server-Side Auth
- Express middleware (`backend/src/middleware/auth.ts`) protects API routes
- Verifies Clerk session tokens from `Authorization` header
- Adds `userId` to request object for API routes
- Protected routes: `/api/cart/*`, `/api/checkout/*`, `/api/users/*`, `/api/payments/*`, `/api/ai/suggestions`

### Clerk Configuration
- Publishable key: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Secret key: `CLERK_SECRET_KEY` (backend only)
- Redirect URLs configured in Clerk dashboard

---

## AI Integration

### Architecture
- **Primary Provider**: Google Gemini 3 Flash Preview
- **Fallback Provider**: OpenRouter (automatic)
- **Fallback Model**: `meta-llama/llama-3.2-3b-instruct:free` (fastest free model)
- **RAG System**: Retrieval-Augmented Generation for context-aware responses

### AI Service (`backend/src/services/ai.ts`)

#### Product Suggestion Flow
- **Function**: `getProductSuggestions(currentProduct, userProfile?)`
- **Input**: Product details (including ID) and optional user profile
- **Output**: `{ suggestions: string[], reasoning: string }`
- **Usage**: Called from `/api/ai/suggestions` endpoint
- **RAG Integration**: Retrieves product context and similar products from database
- **Fallback**: Automatically switches to OpenRouter on quota errors

#### Support Chat Flow
- **Function**: `supportChat(message, conversationHistory?)`
- **Input**: User message and optional conversation history
- **Output**: `{ response: string }`
- **Usage**: Called from `/api/ai/chat` endpoint
- **RAG Integration**: Retrieves relevant policies, FAQs, and product information
- **Fallback**: Automatically switches to OpenRouter on quota errors

### RAG Service (`backend/src/services/rag.ts`)

#### Knowledge Base
- **Static Knowledge**: Store policies, shipping info, returns, FAQs, sizing guides
- **Dynamic Knowledge**: Product information retrieved from Supabase database
- **Retrieval**: Keyword-based search with relevance scoring

#### Key Functions
- `retrieveContext(query, options)` - Retrieves relevant knowledge base entries
- `formatContextForPrompt(entries)` - Formats retrieved context for AI prompts
- `getProductContext(productId)` - Gets product-specific context with similar products
- `searchProducts(query, limit)` - Searches products in database by keywords

#### Knowledge Base Contents
- Shipping policies (free shipping thresholds, delivery times)
- Returns and exchanges (30-day policy, size exchanges)
- Sizing guides (jerseys, footwear, apparel)
- Payment methods
- Order tracking information
- Product care instructions
- Product categories and brands

### Automatic Fallback Mechanism

1. **Error Detection**: Detects quota errors (429, RESOURCE_EXHAUSTED, etc.)
2. **Automatic Switching**: Seamlessly switches to OpenRouter
3. **Transparent to Users**: No customer-facing errors
4. **Logging**: Errors logged for monitoring

### Configuration
- `GOOGLE_API_KEY` - Required for Gemini
- `OPENROUTER_API_KEY` - Required for fallback
- `OPENROUTER_DEFAULT_MODEL` - Optional (defaults to fastest free model)

---

## Payment Processing

### Stripe Integration

#### Payment Flow
1. User proceeds to checkout
2. Frontend creates payment intent via `/api/payments/create-intent`
3. Stripe Elements handles card input
4. Payment confirmed via Stripe SDK
5. Checkout completed via `/api/checkout` with `paymentIntentId`
6. Order created with payment intent ID

#### Stripe Service (`backend/src/services/stripe.ts`)
- `createPaymentIntent()` - Create payment intent
- `getPaymentIntent()` - Retrieve payment intent
- `confirmPaymentIntent()` - Confirm payment
- `verifyWebhookSignature()` - Verify webhook signatures

#### Webhooks
- Endpoint: `/api/webhooks/stripe` (to be implemented)
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Used for order status updates

---

## State Management

### Client-Side State

#### Cart State (`CartProvider`)
- Stored in React state + localStorage (`footies_shop_cart`)
- Syncs with server cart when user signs in
- Functions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `syncCart`
- Access via `useCart()` hook

#### Auth State (Clerk)
- Managed by Clerk SDK
- Provides `isSignedIn`, `userId`, `getToken`
- Access via `useAuth()` hook from `@clerk/nextjs`

### Server-Side State

#### Supabase Database
- `products` - Product catalog
- `categories` - Product categories
- `users` - User profiles (keyed by Clerk ID)
- `carts` - Shopping carts (keyed by Clerk ID)
- `cart_items` - Cart items
- `orders` - Order history

---

## UI Components & Styling

### Design System
- **Theme**: Dark mode with glassmorphism effects
- **Colors**: HSL-based color system with CSS variables
- **Typography**: Poppins font (weights: 400, 600, 700)
- **Components**: shadcn/ui component library

### Key UI Features
- Glassmorphism effects (backdrop blur, transparency)
- Stadium background image with overlay
- Responsive navigation with mobile menu
- Animated carousels for hero images and product listings
- Toast notifications for user feedback
- Loading skeletons for async content
- Stripe Elements for secure payment input

### Custom Components
- `ChatWidget` - Floating AI support chat
- `ProductSuggestions` - AI-powered product recommendations
- `CartSheet` - Slide-out shopping cart
- `StripeProvider` - Stripe Elements provider wrapper
- `ProductCard` - Product display card
- `SiteHeader` - Main navigation with search
- `SiteFooter` - Footer component

---

## Data Flow

### Product Data
- **Database**: Products stored in Supabase `products` table
- **API**: Backend fetches from Supabase
- **Frontend**: Fetches via `/api/products` endpoint

### Cart Data
- **Client**: Stored in localStorage + React state
- **Server**: Stored in Supabase `carts` and `cart_items` tables
- **Sync**: Client cart syncs with server when user signs in

### Order Flow
1. User adds items to cart (client-side localStorage)
2. User signs in (Clerk)
3. Cart syncs with server
4. User proceeds to checkout
5. Payment intent created (Stripe)
6. Payment confirmed (Stripe Elements)
7. Order created in Supabase with payment intent ID
8. Cart cleared
9. Stock updated

---

## Environment Variables

### Frontend (.env.local)

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:9002
NEXT_PUBLIC_API_URL=http://localhost:3001

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx

# Cloudinary Image Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Backend (backend/.env)

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

# Cloudinary Image Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Google AI (Gemini 3 Flash) - Primary AI Provider
GOOGLE_API_KEY=AIzaxxxxx

# OpenRouter - Fallback AI Provider
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENROUTER_DEFAULT_MODEL=meta-llama/llama-3.2-3b-instruct:free

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:9002
```

---

## Development Scripts

### Frontend
```bash
bun run dev          # Start dev server on port 9002 with Turbopack
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run typecheck    # Run TypeScript type checking
```

### Backend
```bash
cd backend
bun run dev          # Start dev server with watch mode
bun run build        # Build for production (Bun runs TS directly)
bun run start        # Start production server
bun run lint         # Run ESLint
bun run typecheck    # Run TypeScript type checking
```

### Both
```bash
bun run dev:all      # Run both frontend and backend simultaneously
```

---

## Configuration Files

### `next.config.ts`
- TypeScript and ESLint errors ignored during builds
- Image domains configured for remote images (Cloudinary, Unsplash, etc.)
- Optimized for production builds

### `tailwind.config.ts`
- Custom color system with CSS variables
- Poppins font configuration
- Animation keyframes for accordion
- Container settings

### `tsconfig.json`
- Path alias: `@/*` → `./src/*`
- Strict mode enabled
- ES2022 target

### `middleware.ts`
- Protects routes with Clerk authentication
- Public routes: `/`, `/sign-in`, `/sign-up`, `/product/*`, `/category/*`
- Protected routes: `/account/*`, `/checkout/*`

### `render.yaml`
- Render.com deployment configuration
- Frontend and backend service definitions
- Environment variable templates
- Build and start commands

---

## Key Patterns & Conventions

### File Naming
- Components: kebab-case (e.g., `product-card.tsx`)
- API routes: `route.ts` in route folders
- Models: PascalCase (e.g., `Product.ts`)

### Code Organization
- Server actions in `app/actions/`
- API routes handled by Express backend
- Shared types in `models/`
- Utilities in `lib/`
- UI components in `components/`

### Type Safety
- Zod schemas for API validation
- TypeScript interfaces for models
- Strict TypeScript enabled

### Error Handling
- API routes return JSON with `success` and `message` fields
- Try-catch blocks with console.error logging
- User-friendly error messages
- Automatic AI fallback on errors

---

## Production Considerations

### Performance Optimizations
- Next.js automatic static optimization
- Image optimization via Cloudinary CDN
- API response caching
- Database query optimization
- Connection pooling (Supabase)

### Security Best Practices
- Environment variables for all secrets
- Row Level Security (RLS) on Supabase tables
- Rate limiting on API endpoints
- CORS configuration
- Input validation with Zod
- Stripe handles PCI compliance

### Monitoring
- Render dashboard for service health
- Supabase dashboard for database metrics
- Clerk dashboard for authentication metrics
- Stripe dashboard for payment metrics
- Error logging to console (consider Sentry for production)

---

## Known Issues & TODOs

### Current Limitations
1. **Cart Sync**: Client and server carts sync on sign-in, but not real-time
2. **Webhook Handler**: Stripe webhook endpoint needs implementation
3. **Error Tracking**: Consider integrating Sentry for production error tracking
4. **Analytics**: No analytics integration (consider adding)

### Potential Improvements
- Real-time cart synchronization
- Email notifications for orders
- Order tracking page
- Product reviews/ratings
- Wishlist functionality
- Advanced search functionality
- Admin dashboard
- Inventory management

---

## Testing & Deployment

### Development
- Dev server runs on port 9002 (frontend) and 3001 (backend)
- Hot reload with Turbopack (frontend) and Bun watch (backend)
- Type checking with TypeScript

### Production
- Build with `bun run build` (frontend)
- Deploy to Render.com using `render.yaml`
- Environment variables configured in Render dashboard
- Database schema executed in Supabase

### Deployment
- **Platform**: Render.com
- **Runtime**: Bun.js
- **Configuration**: `render.yaml` blueprint
- **Documentation**: See `DEPLOYMENT.md` for comprehensive guide

---

## Important Notes

1. **Clerk Setup Required**: Both frontend and backend need Clerk keys
2. **Supabase Setup**: Database schema must be executed before use
3. **Stripe Setup**: Payment processing requires Stripe account and keys
4. **AI Keys**: Google AI key required, OpenRouter key recommended for fallback
5. **Environment Variables**: All secrets must be configured before deployment
6. **Database**: RLS policies are enabled - service role key required for admin operations

---

## Related Documentation

- `README.md` - Project overview and quick start
- `SETUP.md` - Detailed setup instructions
- `DEPLOYMENT.md` - Comprehensive deployment guide
- `PRODUCTION_CHECKLIST.md` - Production deployment checklist
- `render.yaml` - Render.com deployment configuration

---

## Contact & Support

For questions about this codebase, refer to:
- Next.js documentation: https://nextjs.org/docs
- Clerk documentation: https://clerk.com/docs
- Supabase documentation: https://supabase.com/docs
- Stripe documentation: https://stripe.com/docs
- Bun.js documentation: https://bun.sh/docs
- Render documentation: https://render.com/docs

---

*Last Updated: December 2024*
*Project: Footies-Shop E-commerce Platform*
*Version: 2.0.0*
