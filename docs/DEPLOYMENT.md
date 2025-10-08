# SoulBridge Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Database Migration
- [ ] Run the database migration `/supabase/migrations/02_add_funeral_and_events.sql` in your Supabase project
- [ ] Verify all tables exist: `memorials`, `profiles`, `gallery_items`, `timeline_events`, `relationships`, `memorial_events`, `tributes`, `virtual_candles`
- [ ] Verify RLS (Row Level Security) policies are enabled
- [ ] Test database connections

### 2. Environment Variables
Set up the following environment variables in your hosting platform:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Netcash Payment Gateway
NEXT_PUBLIC_NETCASH_SERVICE_KEY=your-service-key
NETCASH_SECRET_KEY=your-secret-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=SoulBridge

# Email Configuration (optional)
RESEND_API_KEY=your-resend-api-key
```

### 3. Supabase Configuration

#### Storage Buckets
Create the following storage bucket in Supabase:
- **Bucket Name**: `memorial-photos`
- **Public**: Yes
- **File size limit**: 10MB
- **Allowed MIME types**: image/*, video/*, audio/*

#### Auth Settings
- Enable Email/Password authentication
- Configure email templates (optional)
- Set up password requirements
- Configure redirect URLs:
  - Site URL: `https://yourdomain.com`
  - Redirect URLs:
    - `https://yourdomain.com/auth/callback`
    - `https://yourdomain.com/dashboard`

### 4. Payment Gateway Setup (Netcash)
- [ ] Register for Netcash account
- [ ] Get Service Key and Secret Key
- [ ] Configure webhook URL: `https://yourdomain.com/api/payments/webhook`
- [ ] Test payment flow in sandbox mode
- [ ] Switch to production mode when ready

### 5. Build Verification
Run a production build locally:
```bash
npm run build
npm start
```

Test critical paths:
- [ ] Home page loads
- [ ] Sign up/Sign in works
- [ ] Create memorial works
- [ ] Memorial page displays correctly
- [ ] Payment flow works

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Repository
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Step 3: Add Environment Variables
Add all environment variables from above in the Vercel dashboard under:
**Settings → Environment Variables**

#### Step 4: Deploy
- Click "Deploy"
- Wait for build to complete
- Visit your deployed site

#### Step 5: Custom Domain (Optional)
1. Go to **Settings → Domains**
2. Add your custom domain
3. Configure DNS records as instructed

---

### Option 2: Netlify

#### Step 1: Build Settings
```
Build command: npm run build
Publish directory: .next
```

#### Step 2: Environment Variables
Add all environment variables in **Site Settings → Environment Variables**

#### Step 3: Deploy
```bash
netlify deploy --prod
```

---

### Option 3: Self-Hosted (VPS/Cloud)

#### Requirements
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)

#### Steps
1. Clone repository on server
2. Install dependencies: `npm install`
3. Create `.env.local` with all environment variables
4. Build: `npm run build`
5. Start with PM2: `pm2 start npm --name "soulbridge" -- start`
6. Configure Nginx reverse proxy
7. Set up SSL with Certbot

---

## 🔧 Post-Deployment

### 1. Verify Deployment
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Memorial creation works
- [ ] File uploads work (Supabase storage)
- [ ] Payment flow works
- [ ] Email notifications work (if configured)

### 2. DNS Configuration
If using custom domain:
- [ ] A record pointing to deployment IP
- [ ] AAAA record for IPv6 (optional)
- [ ] CNAME for www subdomain
- [ ] Wait for DNS propagation (up to 48 hours)

### 3. SSL Certificate
- [ ] Verify HTTPS is working
- [ ] Check certificate validity
- [ ] Force HTTPS redirect

### 4. Performance Optimization
- [ ] Enable caching headers
- [ ] Configure CDN (if using)
- [ ] Optimize images
- [ ] Monitor Core Web Vitals

### 5. Monitoring Setup
Consider setting up:
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Performance monitoring (Vercel Analytics)

---

## 🐛 Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify Node.js version (18+)
- Run `npm install` and try again
- Check build logs for specific errors

### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure IP is whitelisted (if applicable)
- Test connection from deployment environment

### Storage Upload Fails
- Verify storage bucket exists and is public
- Check file size limits
- Verify CORS settings in Supabase
- Ensure anon key has proper permissions

### Payment Issues
- Verify Netcash credentials
- Check webhook URL is correct
- Test in sandbox mode first
- Check payment gateway logs

### 404 Errors
- Verify all required pages exist
- Check routing configuration
- Clear build cache and rebuild
- Check deployment logs

---

## 📊 Recommended Monitoring

### Key Metrics to Track
- Page load times
- Error rates
- User signups
- Memorial creations
- Payment success rate
- Storage usage
- Database queries performance

### Tools
- **Vercel Analytics** - Built-in performance monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Supabase Dashboard** - Database monitoring

---

## 🔄 Update Process

### Rolling Updates
1. Test changes locally
2. Commit to Git
3. Push to repository
4. Automatic deployment (if configured)
5. Verify deployment
6. Rollback if issues occur

### Database Migrations
1. Test migrations in development
2. Backup production database
3. Run migration in production
4. Verify data integrity
5. Deploy application updates

---

## 📞 Support

If you encounter issues during deployment:
- Check the documentation at `/docs`
- Review error logs
- Contact support at support@soulbridge.co.za

---

## ✨ Launch Checklist

Before announcing to users:
- [ ] All features tested
- [ ] SSL configured
- [ ] Custom domain configured
- [ ] Analytics setup
- [ ] Error tracking configured
- [ ] Backup strategy in place
- [ ] Legal pages complete (Terms, Privacy)
- [ ] Contact information correct
- [ ] Payment gateway in production mode
- [ ] Email notifications working
- [ ] Performance optimized

**🎉 Ready to launch!**
