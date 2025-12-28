# Deployment Guide for Render.com

This guide will help you deploy the Footies-Shop application to Render.com using Bun.js runtime.

## Prerequisites

- GitHub repository: https://github.com/SoroushMB/footies-shop
- Render.com account (free tier available)
- All API keys configured (Clerk, Supabase, Cloudinary, Google AI)

## Step 1: Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select the repository: `SoroushMB/footies-shop`
5. Render will automatically detect the `render.yaml` file

## Step 2: Configure Environment Variables

### Frontend Service (`footies-shop-frontend`)

Add the following environment variables in Render dashboard:

```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-frontend-url.onrender.com
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Backend Service (`footies-shop-backend`)

Add the following environment variables:

```
NODE_ENV=production
PORT=3001
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
GOOGLE_API_KEY=AIzaxxxxx
FRONTEND_URL=https://your-frontend-url.onrender.com
```

## Step 3: Deploy

1. Render will automatically start building both services
2. The build process will:
   - Install Bun.js runtime
   - Install dependencies using `bun install`
   - Build the frontend with `bun run build`
   - Start the services

## Step 4: Update URLs After Deployment

Once both services are deployed:

1. **Update Frontend Environment Variables:**
   - Update `NEXT_PUBLIC_SITE_URL` with the frontend URL
   - Update `NEXT_PUBLIC_API_URL` with the backend URL

2. **Update Backend Environment Variables:**
   - Update `FRONTEND_URL` with the frontend URL

3. **Update Clerk Settings:**
   - Go to Clerk Dashboard → Settings → Paths
   - Update redirect URLs to use your Render URLs
   - Add your Render frontend URL to allowed origins

4. **Redeploy Services:**
   - Trigger a manual redeploy after updating environment variables

## Step 5: Database Setup

1. Go to your Supabase project
2. Run the SQL schema from `backend/supabase-schema.sql` in the SQL Editor
3. Verify all tables are created

## Troubleshooting

### Build Failures

- **Bun installation fails**: Render should automatically install Bun, but if it fails, check the build logs
- **Dependencies fail**: Ensure all dependencies are compatible with Bun.js

### Runtime Errors

- **Port binding**: Ensure `PORT` environment variable is set (Render provides this automatically)
- **CORS errors**: Verify `FRONTEND_URL` in backend matches the frontend service URL
- **Database connection**: Check Supabase credentials and network access

### Performance

- **Cold starts**: Render free tier has cold starts. Consider upgrading for production
- **Build time**: Bun.js builds are faster than Node.js, but first build may take longer

## Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| Render | 750 hours/month, 512MB RAM |
| Supabase | 500MB database, 1GB bandwidth |
| Clerk | 10,000 MAUs |
| Cloudinary | 25GB storage, 25GB bandwidth |
| Google AI | 60 requests/minute |

## Monitoring

- Check Render dashboard for service health
- Monitor logs in Render dashboard
- Set up alerts for service failures
- Monitor Supabase dashboard for database usage

## Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain and configure DNS records
4. Update environment variables with new domain

## SSL/HTTPS

Render automatically provides SSL certificates for all services. No additional configuration needed.

## Scaling

For production scaling:
1. Upgrade Render plan for more resources
2. Enable auto-scaling in Render settings
3. Consider using Render's PostgreSQL instead of Supabase for better integration
4. Set up CDN for static assets (Cloudinary handles this)

