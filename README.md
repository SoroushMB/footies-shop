# Footies-Shop 🏈

A modern, production-ready e-commerce platform for football (soccer) gear built with Next.js, Express.js, Supabase, Clerk, and Cloudinary.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router) with Bun.js runtime
- **Backend**: Express.js 5 with Bun.js runtime
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Images & Assets**: Cloudinary
- **AI**: Google Gemini 2.0 Flash
- **Runtime**: Bun.js

## 📋 Prerequisites

- [Bun.js](https://bun.sh) (>=1.0.0)
- A Supabase account (free tier available)
- A Clerk account (free tier available)
- A Cloudinary account (free tier available)
- A Google AI API key (for AI features)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SoroushMB/footies-shop.git
   cd footies-shop
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   bun install

   # Install backend dependencies
   cd backend
   bun install
   cd ..
   ```

3. **Set up environment variables**

   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:9002
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   ```

   Create `backend/.env`:
   ```env
   PORT=3001
   NODE_ENV=development
   CLERK_SECRET_KEY=sk_test_xxxxx
   CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJxxxxx
   SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=xxxxx
   CLOUDINARY_API_SECRET=xxxxx
   GOOGLE_API_KEY=AIzaxxxxx
   FRONTEND_URL=http://localhost:9002
   ```

4. **Set up Supabase database**
   - Go to your Supabase project SQL Editor
   - Run the contents of `backend/supabase-schema.sql`

## 🏃 Running Locally

### Development Mode

Run both frontend and backend:
```bash
bun run dev:all
```

Or run them separately:

**Frontend** (port 9002):
```bash
bun run dev
```

**Backend** (port 3001):
```bash
bun run dev:backend
```

### Production Build

```bash
# Build frontend
bun run build

# Build backend
cd backend
bun run build
cd ..

# Start frontend
bun run start

# Start backend (in another terminal)
cd backend
bun run start
```

## 🌐 Deployment on Render.com

This project is configured for deployment on Render.com. The `render.yaml` file contains the configuration for both frontend and backend services.

### Steps to Deploy:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and create the services

3. **Configure Environment Variables**
   - Add all required environment variables in Render dashboard
   - See `SETUP.md` for detailed instructions

## 📁 Project Structure

```
footies-shop/
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and API client
│   └── middleware.ts       # Clerk auth middleware
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── app.ts         # Main Express app
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth & rate limiting
│   │   ├── models/        # Zod schemas
│   │   ├── routes/        # Express routes
│   │   └── services/     # Supabase, Cloudinary, AI
│   └── supabase-schema.sql
├── render.yaml            # Render.com deployment config
├── SETUP.md               # Detailed setup guide
└── package.json
```

## 🔑 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/popular` - Get popular products
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category with products
- `POST /api/ai/chat` - AI customer support chat

### Protected Endpoints (Auth Required)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `POST /api/checkout` - Process checkout
- `GET /api/checkout/orders` - Get user's orders
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/ai/suggestions` - Get AI product suggestions

## 🧪 Testing

```bash
# Type checking
bun run typecheck

# Linting
bun run lint
```

## 📝 License

This project is private and proprietary.

## 👤 Author

**SoroushMB**
- GitHub: [@SoroushMB](https://github.com/SoroushMB)
- Email: soroushmasoombabaei@gmail.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Bun.js](https://bun.sh)
- Deployed on [Render.com](https://render.com)
