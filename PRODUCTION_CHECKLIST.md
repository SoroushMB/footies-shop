# 🎯 Production Deployment Checklist

Use this checklist to ensure your Footies-Shop deployment is production-ready.

## Pre-Deployment

### Code Quality
- [ ] All tests passing
- [ ] No TypeScript errors (`bun run typecheck`)
- [ ] No linting errors (`bun run lint`)
- [ ] Code reviewed and approved
- [ ] All dependencies updated and secure
- [ ] No console.log statements in production code
- [ ] Error handling implemented for all API calls

### Security
- [ ] All secrets moved to environment variables
- [ ] No API keys committed to Git
- [ ] `.env` files in `.gitignore`
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] HTTPS enforced

### Configuration
- [ ] Production environment variables documented
- [ ] All API keys obtained (Supabase, Clerk, Cloudinary, Stripe, Google AI, OpenRouter)
- [ ] Database schema ready to execute
- [ ] Stripe webhook endpoint configured
- [ ] Clerk redirect URLs configured
- [ ] Cloudinary upload presets configured (if needed)

## Service Setup

### Supabase
- [ ] Project created
- [ ] Database password saved securely
- [ ] API keys copied
- [ ] Database schema executed
- [ ] Sample data inserted
- [ ] RLS policies verified
- [ ] Backups enabled

### Clerk
- [ ] Application created
- [ ] Authentication methods configured
- [ ] API keys copied
- [ ] Redirect URLs configured
- [ ] Allowed origins set
- [ ] Email templates customized (optional)

### Cloudinary
- [ ] Account created
- [ ] Cloud name, API key, and secret copied
- [ ] Upload presets configured (optional)
- [ ] Transformations tested

### Stripe
- [ ] Account created and verified
- [ ] API keys copied (live keys for production)
- [ ] Webhook endpoint configured
- [ ] Webhook events selected
- [ ] Test payments verified
- [ ] Payment methods configured

### Google AI
- [ ] API key created
- [ ] Billing enabled (if exceeding free tier)
- [ ] Quota limits understood
- [ ] API tested

### OpenRouter
- [ ] Account created
- [ ] API key created
- [ ] Free model selected
- [ ] Fallback tested

## Deployment

### Render.com Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Blueprint detected (`render.yaml`)
- [ ] Frontend service created
- [ ] Backend service created

### Environment Variables - Frontend
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_SITE_URL` set
- [ ] `NEXT_PUBLIC_API_URL` set
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set (live key)
- [ ] `CLERK_SECRET_KEY` set (live key)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` set
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set (live key)

### Environment Variables - Backend
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000` (Render default)
- [ ] `CLERK_SECRET_KEY` set (live key)
- [ ] `CLERK_PUBLISHABLE_KEY` set (live key)
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] `CLOUDINARY_CLOUD_NAME` set
- [ ] `CLOUDINARY_API_KEY` set
- [ ] `CLOUDINARY_API_SECRET` set
- [ ] `GOOGLE_API_KEY` set
- [ ] `OPENROUTER_API_KEY` set (optional)
- [ ] `OPENROUTER_DEFAULT_MODEL` set (optional)
- [ ] `STRIPE_SECRET_KEY` set (live key)
- [ ] `STRIPE_PUBLISHABLE_KEY` set (live key)
- [ ] `STRIPE_WEBHOOK_SECRET` set
- [ ] `FRONTEND_URL` set

### Build & Deploy
- [ ] Frontend build successful
- [ ] Backend build successful
- [ ] Both services showing "Live" status
- [ ] No build errors in logs
- [ ] No runtime errors in logs

## Post-Deployment

### URL Configuration
- [ ] Frontend URL obtained from Render
- [ ] Backend URL obtained from Render
- [ ] Frontend `NEXT_PUBLIC_SITE_URL` updated
- [ ] Frontend `NEXT_PUBLIC_API_URL` updated
- [ ] Backend `FRONTEND_URL` updated
- [ ] Clerk redirect URLs updated
- [ ] Stripe webhook URL updated
- [ ] Services redeployed after URL updates

### Verification Tests

#### Health Checks
- [ ] Frontend loads successfully
- [ ] Backend health endpoint responds (`/health`)
- [ ] No console errors in browser

#### Authentication
- [ ] Sign-up flow works
- [ ] Sign-in flow works
- [ ] Sign-out works
- [ ] User profile page loads
- [ ] Protected routes require authentication

#### API Endpoints
- [ ] Public endpoints accessible (`/api/products`, `/api/categories`)
- [ ] Protected endpoints require auth (`/api/cart`, `/api/checkout`)
- [ ] CORS configured correctly
- [ ] Rate limiting working

#### Database
- [ ] Products load correctly
- [ ] Categories load correctly
- [ ] User creation works
- [ ] Cart operations work
- [ ] Orders can be created

#### Payment Flow
- [ ] Cart functionality works
- [ ] Checkout page loads
- [ ] Payment intent creation works
- [ ] Stripe Elements loads
- [ ] Test payment succeeds
- [ ] Order created in database
- [ ] Webhook receives events

#### AI Features
- [ ] Chat widget loads
- [ ] AI chat responds (Gemini or OpenRouter)
- [ ] Product suggestions work
- [ ] Fallback to OpenRouter works (if Gemini quota exhausted)

### Performance
- [ ] Page load times acceptable (<3s)
- [ ] API response times acceptable (<500ms)
- [ ] Images load from CDN
- [ ] No memory leaks detected
- [ ] Database queries optimized

### Security
- [ ] HTTPS enforced
- [ ] No sensitive data in client-side code
- [ ] API keys not exposed
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation working

### Monitoring
- [ ] Uptime monitoring configured
- [ ] Error tracking configured (Sentry or similar)
- [ ] Logs accessible
- [ ] Alerts configured
- [ ] Analytics set up (optional)

## Documentation
- [ ] README.md updated
- [ ] SETUP.md updated
- [ ] DEPLOYMENT.md updated
- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Troubleshooting guide available

## Final Steps
- [ ] All team members notified
- [ ] Monitoring dashboards set up
- [ ] Backup procedures tested
- [ ] Rollback plan documented
- [ ] Support channels established
- [ ] Post-deployment review scheduled

---

## Quick Reference

### Service URLs
- **Frontend**: `https://footies-shop-frontend.onrender.com`
- **Backend**: `https://footies-shop-backend.onrender.com`
- **Health Check**: `https://footies-shop-backend.onrender.com/health`

### Test Cards (Stripe)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Support Contacts
- **Render Support**: support@render.com
- **Supabase Support**: support@supabase.com
- **Clerk Support**: support@clerk.com
- **Stripe Support**: support@stripe.com

---

**Last Updated**: December 2024

