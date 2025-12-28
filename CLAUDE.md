# CLAUDE.md - Codebase Documentation

## Project Overview

**Footies-Shop** is a modern e-commerce application built with Next.js 15 for selling football (soccer) gear. The application features AI-powered product suggestions, customer support chat, Firebase authentication, and a complete shopping cart/checkout system.

### Key Features
- E-commerce product catalog with categories (Jerseys, Footballs, Apparel, Footwear, Accessories)
- Firebase Authentication for user management
- Shopping cart with localStorage persistence (client-side) and Firestore (server-side)
- AI-powered product suggestions using Google Genkit and Gemini 2.0 Flash
- AI customer support chat widget
- Protected API routes with Firebase token verification
- Modern UI with glassmorphism effects and dark theme
- Responsive design with mobile menu

---

## Technology Stack

### Core Framework
- **Next.js 15.3.3** (App Router)
- **React 18.3.1**
- **TypeScript 5**

### Styling & UI
- **Tailwind CSS 3.4.1** with custom configuration
- **Radix UI** components (Dialog, Dropdown, Sheet, etc.)
- **Framer Motion** for animations
- **Lucide React** for icons
- **Poppins** font from Google Fonts

### Backend & Database
- **Firebase** (v11.9.1) - Client SDK for authentication
- **Firebase Admin SDK** (v13.4.0) - Server-side operations
- **Firestore** - NoSQL database for products, users, carts, orders

### AI Integration
- **Genkit** (v1.14.1) - AI orchestration framework
- **@genkit-ai/googleai** (v1.14.1) - Google AI integration
- **Google Gemini 2.0 Flash** - AI model for suggestions and chat

### Validation & Forms
- **Zod** (v3.24.2) - Schema validation
- **React Hook Form** (v7.54.2) - Form management
- **@hookform/resolvers** - Zod integration for forms

### Other Dependencies
- **date-fns** - Date utilities
- **embla-carousel-react** - Carousel component
- **recharts** - Charting library
- **class-variance-authority** - Component variants
- **clsx** & **tailwind-merge** - Conditional class utilities

---

## Project Structure

```
studio/
├── src/
│   ├── ai/                          # AI flows and Genkit configuration
│   │   ├── flows/
│   │   │   ├── product-suggestion.ts # AI product suggestion flow
│   │   │   └── support-chat.ts      # AI customer support chat flow
│   │   └── genkit.ts                # Genkit AI configuration
│   │
│   ├── app/                         # Next.js App Router
│   │   ├── actions/                 # Server actions
│   │   │   ├── chat.ts             # Chat action wrapper
│   │   │   └── product.ts           # Product suggestion action wrapper
│   │   │
│   │   ├── api/                    # API routes (protected & public)
│   │   │   ├── ai/
│   │   │   │   └── suggestions/    # POST /api/ai/suggestions
│   │   │   ├── cart/               # GET, POST /api/cart
│   │   │   │   └── [productId]/    # PUT, DELETE /api/cart/:productId
│   │   │   ├── categories/         # GET /api/categories
│   │   │   │   └── [slug]/         # GET /api/categories/:slug
│   │   │   ├── checkout/           # POST /api/checkout
│   │   │   ├── products/           # GET /api/products
│   │   │   │   ├── [id]/           # GET /api/products/:id
│   │   │   │   ├── featured/       # GET /api/products/featured
│   │   │   │   └── popular/        # GET /api/products/popular
│   │   │   └── users/
│   │   │       └── me/             # GET, PUT /api/users/me
│   │   │
│   │   ├── category/[slug]/        # Category product listing page
│   │   ├── product/[slug]/         # Product detail page
│   │   ├── checkout/               # Checkout page
│   │   ├── account/                # User account page
│   │   ├── layout.tsx              # Root layout with providers
│   │   └── page.tsx                # Homepage
│   │
│   ├── components/                 # React components
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── add-to-cart-button.tsx
│   │   ├── cart-sheet.tsx
│   │   ├── chat-widget.tsx         # AI support chat widget
│   │   ├── product-card.tsx
│   │   ├── product-suggestions.tsx  # AI product suggestions component
│   │   ├── site-footer.tsx
│   │   ├── site-header.tsx
│   │   └── welcome-dialog.tsx
│   │
│   ├── contexts/                   # React contexts
│   │   ├── auth-provider.tsx       # Firebase auth state management
│   │   └── cart-provider.tsx       # Shopping cart state (localStorage)
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── data.ts                 # Static product/category data
│   │   ├── firebase.ts             # Firebase client SDK config
│   │   ├── firebase-admin.ts       # Firebase Admin SDK config
│   │   └── utils.ts                # Utility functions (cn, etc.)
│   │
│   ├── models/                     # TypeScript interfaces
│   │   ├── Cart.ts
│   │   ├── Category.ts
│   │   ├── Order.ts
│   │   ├── Product.ts
│   │   └── User.ts
│   │
│   └── middleware.ts               # Next.js middleware for auth
│
├── apphosting.yaml                 # Firebase App Hosting config
├── components.json                 # shadcn/ui configuration
├── firebase-instructions.md        # Firebase setup guide
├── next.config.ts                  # Next.js configuration
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
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
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
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
}

interface Cart {
  userId: string;  // Firebase UID
  items: CartItem[];
}
```

### User
```typescript
interface User {
  uid: string;
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
type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  orderId: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  orderDate: Date;
  status: OrderStatus;
}
```

---

## API Routes

### Public Routes

#### Products
- `GET /api/products` - Get all products
  - Query params: `category`, `brand`, `sortBy` (price_asc, price_desc)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/popular` - Get popular products

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

### Protected Routes (Require Firebase Auth Token)

All protected routes require:
- `Authorization: Bearer <firebase-id-token>` header
- Middleware verifies token and adds `X-User-ID` header

#### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add product to cart
  - Body: `{ productId: string, quantity: number }`
- `PUT /api/cart/:productId` - Update cart item quantity
  - Body: `{ quantity: number }`
- `DELETE /api/cart/:productId` - Remove item from cart

#### Checkout
- `POST /api/checkout` - Process checkout
  - Body: `{ shippingAddress: { street, city, state, zip, country } }`
  - Creates order, clears cart, simulates payment

#### User Profile
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
  - Body: `{ name?: string, shippingAddress?: {...} }`

#### AI Suggestions
- `POST /api/ai/suggestions` - Get AI product suggestions
  - Body: `{ currentProductId: string }`
  - Returns: `{ suggestions: string[], reasoning: string }`

---

## Authentication & Authorization

### Client-Side Auth
- Uses Firebase Auth client SDK (`src/lib/firebase.ts`)
- `AuthProvider` context manages auth state
- `useAuth()` hook provides: `{ user, loading, signOut }`

### Server-Side Auth
- Middleware (`src/middleware.ts`) protects API routes
- Verifies Firebase ID tokens from `Authorization` header
- Adds `X-User-ID` header to requests for API routes
- Protected routes: `/api/users/me`, `/api/cart/*`, `/api/checkout/*`, `/api/ai/suggestions/*`

### Firebase Configuration
- Client config in `src/lib/firebase.ts` (needs to be configured)
- Admin config in `src/lib/firebase-admin.ts` (uses env vars):
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

---

## AI Integration

### Genkit Setup
- Configured in `src/ai/genkit.ts`
- Uses Google AI plugin with Gemini 2.0 Flash model

### AI Flows

#### Product Suggestion Flow
- **File**: `src/ai/flows/product-suggestion.ts`
- **Function**: `productSuggestion(input: ProductSuggestionInput)`
- **Input**: `{ currentSelection: string, userProfile?: string }`
- **Output**: `{ suggestions: string[], reasoning: string }`
- **Usage**: Called from `/api/ai/suggestions` endpoint

#### Support Chat Flow
- **File**: `src/ai/flows/support-chat.ts`
- **Function**: `supportChat(input: ChatInput)`
- **Input**: `{ message: string }`
- **Output**: `{ response: string }`
- **Usage**: Called from `ChatWidget` component via server action

### Server Actions
- `src/app/actions/chat.ts` - Wraps `supportChat` flow
- `src/app/actions/product.ts` - Wraps `productSuggestion` flow

---

## State Management

### Client-Side State

#### Cart State (`CartProvider`)
- Stored in React state + localStorage (`footies_shop_cart`)
- Functions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- Access via `useCart()` hook

#### Auth State (`AuthProvider`)
- Managed by Firebase `onAuthStateChanged`
- Provides user object and loading state
- Access via `useAuth()` hook

### Server-Side State

#### Firestore Collections
- `products` - Product catalog
- `categories` - Product categories
- `users` - User profiles (keyed by UID)
- `carts` - Shopping carts (keyed by UID)
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

### Custom Components
- `ChatWidget` - Floating AI support chat
- `ProductSuggestions` - AI-powered product recommendations
- `CartSheet` - Slide-out shopping cart
- `WelcomeDialog` - First-visit welcome popup
- `ProductCard` - Product display card
- `SiteHeader` - Main navigation with search
- `SiteFooter` - Footer component

---

## Data Flow

### Product Data
- **Static Data**: `src/lib/data.ts` contains hardcoded products/categories
- **Firestore**: API routes fetch from Firestore collections
- **Note**: Currently using static data for display, Firestore for API operations

### Cart Data
- **Client**: Stored in localStorage + React state
- **Server**: Stored in Firestore `carts` collection (keyed by UID)
- **Sync**: Client cart is independent; server cart used for checkout

### Order Flow
1. User adds items to cart (client-side localStorage)
2. User proceeds to checkout
3. Checkout API fetches server cart from Firestore
4. Order created in Firestore `orders` collection
5. Server cart cleared after successful order

---

## Environment Variables

### Required for Firebase Admin
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Firebase Client Config
- Must be configured in `src/lib/firebase.ts`
- See `firebase-instructions.md` for setup guide

### Genkit/Google AI
- API keys likely configured via environment or Genkit config
- Check Genkit documentation for setup

---

## Development Scripts

```bash
npm run dev          # Start dev server on port 9002 with Turbopack
npm run genkit:dev   # Start Genkit dev server
npm run genkit:watch # Start Genkit with watch mode
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

---

## Configuration Files

### `next.config.ts`
- TypeScript and ESLint errors ignored during builds
- Image domains configured for remote images (placehold.co, unsplash.com, etc.)

### `tailwind.config.ts`
- Custom color system with CSS variables
- Poppins font configuration
- Animation keyframes for accordion
- Container settings

### `tsconfig.json`
- Path alias: `@/*` → `./src/*`
- Strict mode enabled
- ES2017 target

### `middleware.ts`
- Protects API routes with Firebase token verification
- Matches: `/api/users/me`, `/api/cart/*`, `/api/checkout/*`, `/api/ai/suggestions/*`

---

## Key Patterns & Conventions

### File Naming
- Components: kebab-case (e.g., `product-card.tsx`)
- API routes: `route.ts` in route folders
- Models: PascalCase (e.g., `Product.ts`)

### Code Organization
- Server actions in `app/actions/`
- API routes in `app/api/`
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

---

## Known Issues & TODOs

### Current Limitations
1. **Dual Cart System**: Client uses localStorage, server uses Firestore - not fully synchronized
2. **Static Product Data**: Products are hardcoded in `data.ts` but API expects Firestore
3. **Payment Simulation**: Checkout simulates payment (no real payment gateway)
4. **Firebase Config**: Client Firebase config needs to be set up
5. **Firebase Admin**: Requires environment variables for service account

### Potential Improvements
- Sync client and server cart systems
- Migrate static product data to Firestore
- Add real payment gateway integration
- Implement product search functionality
- Add order history page
- Add product reviews/ratings
- Implement wishlist functionality
- Add email notifications for orders

---

## Testing & Deployment

### Development
- Dev server runs on port 9002
- Hot reload with Turbopack
- Genkit dev server for AI flows

### Production
- Build with `npm run build`
- Deploy to Firebase App Hosting (see `apphosting.yaml`)
- Environment variables must be configured

### Firebase App Hosting
- Configuration in `apphosting.yaml`
- See Firebase documentation for deployment

---

## Important Notes

1. **Firebase Setup Required**: Both client and admin SDKs need configuration
2. **Data Migration**: Consider migrating static product data to Firestore
3. **Cart Sync**: Client and server carts operate independently - may need synchronization strategy
4. **AI API Keys**: Ensure Google AI/Genkit API keys are configured
5. **Image Hosting**: Product images use external URLs - consider Firebase Storage
6. **Authentication**: User registration/login handled by Firebase Auth UI (not visible in codebase)

---

## Related Documentation

- `README.md` - Project overview and backend generation prompt
- `firebase-instructions.md` - Firebase configuration guide
- `docs/blueprint.md` - Project blueprint (if exists)

---

## Contact & Support

For questions about this codebase, refer to:
- Next.js documentation: https://nextjs.org/docs
- Firebase documentation: https://firebase.google.com/docs
- Genkit documentation: https://genkit.dev
- shadcn/ui documentation: https://ui.shadcn.com

---

*Last Updated: Generated from codebase scan*
*Project: Footies-Shop E-commerce Platform*

