# 🚀 Comprehensive Deployment Guide for Footies-Shop

This guide provides complete, step-by-step instructions for deploying the Footies-Shop e-commerce platform to production on Render.com.

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Prerequisites](#prerequisites)
3. [Service Setup](#service-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Deployment Process](#deployment-process)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Production Optimization](#production-optimization)
9. [Security Best Practices](#security-best-practices)
10. [Monitoring & Logging](#monitoring--logging)
11. [Troubleshooting](#troubleshooting)
12. [Rollback Procedures](#rollback-procedures)
13. [Scaling Guide](#scaling-guide)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub repository set up and code pushed
- [ ] Render.com account created
- [ ] Supabase project created and configured
- [ ] Clerk application created and configured
- [ ] Cloudinary account created and configured
- [ ] Google AI API key obtained
- [ ] OpenRouter API key obtained (optional but recommended)
- [ ] Stripe account created and configured
- [ ] All environment variables documented
- [ ] Database schema ready to execute
- [ ] Domain name ready (optional)

---

## 🔧 Prerequisites

### Required Accounts & Services

| Service | Free Tier Available | Required For |
|---------|-------------------|--------------|
| **Render.com** | ✅ Yes | Hosting frontend & backend |
| **Supabase** | ✅ Yes | PostgreSQL database |
| **Clerk** | ✅ Yes | Authentication |
| **Cloudinary** | ✅ Yes | Image storage & CDN |
| **Google AI** | ✅ Yes | AI features (Gemini 3 Flash) |
| **OpenRouter** | ✅ Yes | AI fallback (free models) |
| **Stripe** | ✅ Yes | Payment processing |

### Required Tools

- Git installed and configured
- GitHub account
- Bun.js runtime (handled by Render)

---

## 🏗️ Service Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `footies-shop`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier
4. Wait for project to be created (2-3 minutes)
5. Go to **Project Settings** → **API**
6. Copy these values (you'll need them later):
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!

### Step 2: Create Clerk Application

1. Go to [clerk.com](https://clerk.com) and sign up/login
2. Click **"Create Application"**
3. Choose authentication methods:
   - ✅ Email
   - ✅ Google (optional)
   - ✅ GitHub (optional)
4. Go to **API Keys** in the dashboard
5. Copy these values:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`
6. Go to **Settings** → **Paths** and configure:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

### Step 3: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. Go to **Dashboard**
3. Copy these values:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

### Step 4: Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the API key → `GOOGLE_API_KEY`
6. ⚠️ **Important**: Enable billing if you plan to exceed free tier limits

### Step 5: Get OpenRouter API Key (Optional but Recommended)

1. Go to [OpenRouter.ai](https://openrouter.ai) and sign up
2. Go to **Keys** section
3. Click **"Create Key"**
4. Copy the key → `OPENROUTER_API_KEY`
5. This provides automatic fallback when Gemini quota is exhausted

### Step 6: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
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

## ⚙️ Environment Configuration

### Frontend Environment Variables

Create these in Render dashboard for `footies-shop-frontend`:

```env
# Site Configuration
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-frontend-url.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### Backend Environment Variables

Create these in Render dashboard for `footies-shop-backend`:

```env
# Server Configuration
NODE_ENV=production
PORT=10000

# Clerk Authentication
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx

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
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-url.onrender.com
```

⚠️ **Important Notes:**
- Use **live** keys (`pk_live_`, `sk_live_`) for production, not test keys
- Never commit `.env` files to Git
- Use Render's environment variable encryption
- Rotate keys regularly

---

## 🗄️ Database Setup

### Step 1: Execute Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy the entire contents of `backend/supabase-schema.sql`
5. Paste into the SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`
7. Verify all tables are created:
   - `categories`
   - `products`
   - `users`
   - `carts`
   - `cart_items`
   - `orders`

### Step 2: Verify Sample Data

1. Go to **Table Editor** in Supabase
2. Check that sample categories and products are inserted
3. Verify Row Level Security (RLS) policies are enabled

### Step 3: Set Up Database Backups

1. Go to **Settings** → **Database**
2. Enable **Point-in-time Recovery** (if available on your plan)
3. Set up automated backups schedule

---

## 🚀 Deployment Process

### Step 1: Push Code to GitHub

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for production deployment"
git push origin master
```

### Step 2: Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select the repository: `SoroushMB/footies-shop`
5. Render will automatically detect `render.yaml`
6. Review the services that will be created:
   - `footies-shop-frontend`
   - `footies-shop-backend`

### Step 3: Configure Frontend Service

1. Render will create the frontend service automatically
2. Go to the service settings
3. Configure environment variables (see [Environment Configuration](#environment-configuration))
4. Set build settings:
   - **Build Command**: `curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && bun install && bun run build`
   - **Start Command**: `export PATH="$HOME/.bun/bin:$PATH" && bun run start`
   - **Root Directory**: `/` (root)

### Step 4: Configure Backend Service

1. Render will create the backend service automatically
2. Go to the service settings
3. Configure environment variables (see [Environment Configuration](#environment-configuration))
4. Set build settings:
   - **Build Command**: `curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && bun install`
   - **Start Command**: `export PATH="$HOME/.bun/bin:$PATH" && bun run start`
   - **Root Directory**: `/backend`

### Step 5: Deploy Services

1. Click **"Apply"** or **"Save Changes"** for each service
2. Render will automatically start building
3. Monitor build logs:
   - Frontend build should complete in ~5-10 minutes
   - Backend build should complete in ~2-5 minutes
4. Wait for services to become **"Live"**

### Step 6: Update URLs After First Deployment

After both services are deployed, you'll get URLs like:
- Frontend: `https://footies-shop-frontend.onrender.com`
- Backend: `https://footies-shop-backend.onrender.com`

**Update Environment Variables:**

1. **Frontend Service:**
   - Update `NEXT_PUBLIC_SITE_URL` with frontend URL
   - Update `NEXT_PUBLIC_API_URL` with backend URL

2. **Backend Service:**
   - Update `FRONTEND_URL` with frontend URL

3. **Clerk Settings:**
   - Go to Clerk Dashboard → **Settings** → **Paths**
   - Update redirect URLs to use Render URLs
   - Add frontend URL to **Allowed Origins**

4. **Stripe Webhooks:**
   - Go to Stripe Dashboard → **Developers** → **Webhooks**
   - Update webhook endpoint URL: `https://your-backend-url.onrender.com/api/webhooks/stripe`
   - Copy the new signing secret and update `STRIPE_WEBHOOK_SECRET`

5. **Redeploy Services:**
   - Trigger manual redeploy after updating environment variables

---

## ✅ Post-Deployment Verification

### 1. Health Checks

**Frontend:**
```bash
curl https://your-frontend-url.onrender.com
# Should return HTML
```

**Backend:**
```bash
curl https://your-backend-url.onrender.com/health
# Should return: {"status":"healthy","timestamp":"...","version":"1.0.0"}
```

### 2. Test Authentication Flow

1. Visit frontend URL
2. Click **"Sign In"**
3. Complete authentication
4. Verify redirect works correctly
5. Check user profile page loads

### 3. Test API Endpoints

**Public Endpoints:**
```bash
# Products
curl https://your-backend-url.onrender.com/api/products

# Categories
curl https://your-backend-url.onrender.com/api/categories
```

**Protected Endpoints** (requires auth token):
```bash
# Get cart (requires Bearer token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-backend-url.onrender.com/api/cart
```

### 4. Test Database Connection

1. Go to Supabase Dashboard → **Table Editor**
2. Verify you can see products and categories
3. Test creating a test user in Clerk
4. Verify user appears in Supabase `users` table

### 5. Test Payment Flow

1. Add items to cart
2. Proceed to checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify order is created in database

### 6. Test AI Features

1. Open chat widget
2. Send a test message
3. Verify AI response (Gemini or OpenRouter fallback)
4. Test product suggestions on product page

---

## 🎯 Production Optimization

### Performance Optimizations

1. **Enable Caching:**
   - Next.js automatically caches static pages
   - Configure ISR (Incremental Static Regeneration) for product pages
   - Use Cloudinary CDN for images

2. **Database Optimization:**
   - Add indexes for frequently queried fields
   - Enable connection pooling in Supabase
   - Monitor slow queries

3. **API Optimization:**
   - Implement response caching
   - Use pagination for large datasets
   - Enable compression (gzip)

4. **Image Optimization:**
   - Use Cloudinary transformations
   - Implement lazy loading
   - Use Next.js Image component

### Security Hardening

1. **Environment Variables:**
   - Never expose secrets in client-side code
   - Use `NEXT_PUBLIC_` prefix only for public variables
   - Rotate keys regularly

2. **API Security:**
   - Rate limiting is already implemented
   - CORS is configured
   - Authentication required for protected routes

3. **Database Security:**
   - RLS policies are enabled
   - Service role key only used server-side
   - Regular security audits

4. **HTTPS:**
   - Render automatically provides SSL certificates
   - Ensure all API calls use HTTPS

---

## 🔒 Security Best Practices

### 1. Environment Variables

- ✅ Use Render's encrypted environment variables
- ✅ Never commit `.env` files
- ✅ Use different keys for development and production
- ✅ Rotate keys every 90 days
- ✅ Use least privilege principle

### 2. API Security

- ✅ Rate limiting enabled (see `backend/src/middleware/rateLimit.ts`)
- ✅ CORS configured properly
- ✅ Authentication required for sensitive endpoints
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention (using Supabase client)

### 3. Database Security

- ✅ Row Level Security (RLS) enabled
- ✅ Service role key never exposed to client
- ✅ Regular backups enabled
- ✅ Monitor for suspicious activity

### 4. Payment Security

- ✅ Stripe handles PCI compliance
- ✅ Never store card details
- ✅ Use Stripe webhooks for payment verification
- ✅ Implement idempotency keys for payments

### 5. Authentication Security

- ✅ Clerk handles authentication security
- ✅ Session tokens expire automatically
- ✅ MFA available through Clerk
- ✅ Monitor for suspicious login attempts

---

## 📊 Monitoring & Logging

### Render Dashboard

1. **Service Health:**
   - Monitor service status
   - Check CPU and memory usage
   - View request logs

2. **Build Logs:**
   - Review build logs for errors
   - Monitor build times
   - Check for dependency issues

3. **Metrics:**
   - Response times
   - Error rates
   - Request counts

### Supabase Dashboard

1. **Database Metrics:**
   - Connection count
   - Query performance
   - Storage usage

2. **API Metrics:**
   - Request count
   - Response times
   - Error rates

### External Monitoring (Recommended)

1. **Uptime Monitoring:**
   - Set up [UptimeRobot](https://uptimerobot.com) or similar
   - Monitor health endpoints
   - Get alerts for downtime

2. **Error Tracking:**
   - Integrate [Sentry](https://sentry.io) for error tracking
   - Monitor client-side and server-side errors
   - Set up alerts for critical errors

3. **Analytics:**
   - Add Google Analytics or similar
   - Track user behavior
   - Monitor conversion rates

---

## 🐛 Troubleshooting

### Build Failures

**Issue**: Build fails with Bun installation error
- **Solution**: Check build logs, ensure Bun installation command is correct
- **Alternative**: Use Node.js runtime if Bun issues persist

**Issue**: Dependency installation fails
- **Solution**: Check `package.json` for incompatible versions
- **Solution**: Clear npm cache and retry

**Issue**: TypeScript errors during build
- **Solution**: Run `bun run typecheck` locally first
- **Solution**: Fix type errors before deploying

### Runtime Errors

**Issue**: "Clerk: Missing publishable key"
- **Solution**: Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- **Solution**: Ensure key starts with `pk_live_` or `pk_test_`

**Issue**: "Failed to connect to Supabase"
- **Solution**: Verify `SUPABASE_URL` and keys are correct
- **Solution**: Check Supabase project is active
- **Solution**: Verify network access from Render

**Issue**: CORS errors
- **Solution**: Verify `FRONTEND_URL` in backend matches frontend URL
- **Solution**: Check CORS configuration in `backend/src/app.ts`

**Issue**: "Stripe is not configured"
- **Solution**: Verify Stripe keys are set
- **Solution**: Check keys are live keys, not test keys (for production)

**Issue**: AI features not working
- **Solution**: Verify `GOOGLE_API_KEY` is set
- **Solution**: Check API quota limits
- **Solution**: Verify OpenRouter fallback is configured

### Database Issues

**Issue**: Tables not found
- **Solution**: Run `backend/supabase-schema.sql` in Supabase SQL Editor
- **Solution**: Verify RLS policies are enabled

**Issue**: Connection pool exhausted
- **Solution**: Enable connection pooling in Supabase
- **Solution**: Reduce connection timeout
- **Solution**: Upgrade Supabase plan if needed

### Performance Issues

**Issue**: Slow page loads
- **Solution**: Enable caching
- **Solution**: Optimize images with Cloudinary
- **Solution**: Use CDN for static assets

**Issue**: High database usage
- **Solution**: Add database indexes
- **Solution**: Optimize queries
- **Solution**: Enable query caching

---

## 🔄 Rollback Procedures

### Quick Rollback via Render

1. Go to Render Dashboard
2. Select the service
3. Go to **"Events"** tab
4. Find the previous successful deployment
5. Click **"Redeploy"** on that deployment

### Manual Rollback via Git

1. Identify the last working commit:
   ```bash
   git log --oneline
   ```

2. Revert to that commit:
   ```bash
   git revert HEAD
   git push origin master
   ```

3. Render will automatically redeploy

### Database Rollback

1. Go to Supabase Dashboard
2. Navigate to **Database** → **Backups**
3. Select a backup point
4. Restore database to that point

⚠️ **Warning**: Database rollback will lose all data created after the backup point.

---

## 📈 Scaling Guide

### When to Scale

- **CPU Usage**: Consistently above 70%
- **Memory Usage**: Consistently above 80%
- **Response Times**: Increasing significantly
- **Error Rates**: Above 1%

### Scaling Options

1. **Upgrade Render Plan:**
   - Move from Free to Starter ($7/month)
   - More RAM and CPU
   - Better performance

2. **Enable Auto-Scaling:**
   - Configure in Render settings
   - Automatically scale based on traffic

3. **Database Scaling:**
   - Upgrade Supabase plan
   - Enable read replicas
   - Optimize queries

4. **CDN Configuration:**
   - Cloudinary already provides CDN
   - Consider additional CDN for static assets

### Cost Estimates

| Plan | Cost/Month | Features |
|------|------------|----------|
| **Free** | $0 | 750 hours, 512MB RAM, cold starts |
| **Starter** | $7 | Always on, 512MB RAM, no cold starts |
| **Standard** | $25 | 1GB RAM, better performance |
| **Pro** | $85+ | 2GB+ RAM, auto-scaling |

---

## 📞 Support & Resources

### Documentation Links

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Bun.js Documentation](https://bun.sh/docs)

### Community Support

- [Render Community](https://community.render.com)
- [Next.js Discord](https://nextjs.org/discord)
- [Supabase Discord](https://discord.supabase.com)

---

## ✅ Deployment Checklist Summary

- [ ] All services configured (Supabase, Clerk, Cloudinary, Stripe)
- [ ] API keys obtained and documented
- [ ] Database schema executed
- [ ] Environment variables configured in Render
- [ ] GitHub repository connected
- [ ] Services deployed successfully
- [ ] URLs updated after first deployment
- [ ] Health checks passing
- [ ] Authentication flow tested
- [ ] API endpoints tested
- [ ] Payment flow tested
- [ ] AI features tested
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation updated

---

**Last Updated**: December 2024
**Version**: 1.0.0
