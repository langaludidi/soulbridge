# Clerk Production Migration Guide - SoulBridge

**Current Status:** Using Clerk Development Keys (Test Mode)
**Target:** Switch to Clerk Production Instance
**Production URL:** https://soulbridge.co.za

---

## Current Development Setup ⚠️

You're currently using:
- `pk_test_...` (Development publishable key)
- `sk_test_...` (Development secret key)
- `whsec_...` (Development webhook secret)

**These work for testing but are NOT for production use!**

---

## Why Switch to Production?

| Development | Production |
|-------------|------------|
| Limited to test data | Real user data |
| May have restrictions | Full features enabled |
| Test-only webhooks | Production webhooks |
| Not for live users | Ready for live users |
| Free tier limits | Production tier |

---

## Migration Steps

### Step 1: Create Clerk Production Instance

**Go to:** https://dashboard.clerk.com

#### Option A: Upgrade Existing Instance
1. In Clerk Dashboard, go to your current project
2. Click **Settings**
3. Look for **"Go to Production"** or **"Production Mode"** option
4. Follow prompts to upgrade

#### Option B: Create New Production Instance
1. Click **"Create Application"** in Clerk Dashboard
2. Name it: **SoulBridge Memorial Platform**
3. Select **Production** (not Development)
4. Choose authentication methods:
   - ✅ Email + Password
   - ✅ Email verification
   - ✅ Google OAuth (optional)
   - ✅ Phone (optional)

---

### Step 2: Get Production Keys

Once in production instance:

1. **Go to:** Dashboard → API Keys

2. **Copy these keys:**
   ```
   Publishable Key: pk_live_...
   Secret Key: sk_live_...
   ```

**⚠️ IMPORTANT:** These start with `pk_live_` and `sk_live_` (not `pk_test_`)

---

### Step 3: Configure Production Domain

In Clerk Dashboard:

#### A. Add Authorized Domains
**Location:** Settings → Domains

Add:
```
soulbridge.co.za
www.soulbridge.co.za
```

#### B. Set Application URLs
**Location:** Configure → General

```
Application URL: https://soulbridge.co.za
Homepage URL: https://soulbridge.co.za
```

#### C. Configure Authentication Paths
**Location:** Configure → Paths

```
Sign-in path: /sign-in
Sign-up path: /sign-up

After sign-in redirect: /dashboard
After sign-up redirect: /dashboard
Sign-out redirect: /
```

---

### Step 4: Set Up Production Webhook

**Location:** Webhooks → Add Endpoint

#### Create Endpoint:

**URL:**
```
https://soulbridge.co.za/api/webhooks/clerk
```

**Events to Subscribe:**
- ✅ `user.created`
- ✅ `user.updated`
- ✅ `user.deleted`
- ✅ `session.created`

**After creating, copy the Signing Secret:**
```
whsec_... (production webhook secret)
```

**⚠️ This is DIFFERENT from your development webhook secret!**

---

### Step 5: Update Environment Variables

#### A. Update Local Environment

Edit `.env.local`:

```bash
# CLERK AUTHENTICATION - PRODUCTION
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY_HERE
CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_SECRET_HERE
CLERK_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET_HERE

# Optional URL overrides (can be removed - Clerk will use defaults)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### B. Update Vercel Production Environment

```bash
# Remove old development keys
vercel env rm NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production --yes
vercel env rm CLERK_SECRET_KEY production --yes
vercel env rm CLERK_WEBHOOK_SECRET production --yes

# Add new production keys
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Paste: pk_live_YOUR_PRODUCTION_KEY

vercel env add CLERK_SECRET_KEY production
# Paste: sk_live_YOUR_PRODUCTION_SECRET

vercel env add CLERK_WEBHOOK_SECRET production
# Paste: whsec_YOUR_PRODUCTION_WEBHOOK_SECRET
```

---

### Step 6: Deploy to Production

```bash
# Commit any pending changes
git add .
git commit -m "Switch to Clerk production instance"
git push origin main

# Deploy to Vercel with new environment variables
vercel --prod --yes
```

Wait for deployment to complete (~1-2 minutes).

---

### Step 7: Test Production Authentication

#### A. Test Sign Up
1. Go to https://soulbridge.co.za
2. Click "Get Started" or "Sign Up"
3. Create a new account with real email
4. Verify email (check inbox)
5. Should redirect to `/dashboard`

#### B. Verify User in Clerk Dashboard
1. Go to Clerk Dashboard → Users
2. You should see your newly created user
3. Check user details

#### C. Verify Profile in Supabase
1. Go to Supabase Dashboard
2. Open **profiles** table
3. You should see new profile row
4. Check `clerk_user_id` matches Clerk user ID

#### D. Verify Lite Plan Assignment
```sql
SELECT
  p.email,
  up.plan_type,
  up.plan_status,
  up.max_memorials
FROM profiles p
JOIN user_plans up ON p.id = up.profile_id
WHERE p.email = 'your-test-email@example.com';
```

Should show:
- `plan_type`: 'lite'
- `plan_status`: 'active'
- `max_memorials`: 1

#### E. Test Sign In
1. Sign out
2. Go to https://soulbridge.co.za/sign-in
3. Sign in with credentials
4. Should redirect to `/dashboard`

#### F. Test Protected Routes
1. Sign out
2. Try to access https://soulbridge.co.za/dashboard
3. Should redirect to `/sign-in`
4. Sign in
5. Should be able to access `/dashboard`

---

### Step 8: Verify Webhook

**In Clerk Dashboard:**

1. Go to **Webhooks**
2. Click on your production webhook
3. Check **"Recent Attempts"**
4. Should see successful deliveries (200 status) for:
   - `user.created` (when you signed up)
   - `session.created` (when you signed in)

**If webhook failing:**

Check Vercel logs:
```bash
vercel logs soulbridge --prod
```

Look for:
- Webhook requests from Clerk
- Any errors in webhook handler
- Response status codes

---

## Environment Variable Summary

### Production Keys You Need:

| Variable | Format | Where to Get |
|----------|--------|--------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | `sk_live_...` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | `whsec_...` | Clerk Dashboard → Webhooks → Endpoint |

### Optional URL Variables:

These can be removed - Clerk uses sensible defaults based on your configured paths:

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

---

## Troubleshooting

### Issue: "Invalid publishable key"

**Cause:** Using development key in production or vice versa

**Fix:**
1. Verify key starts with `pk_live_` (not `pk_test_`)
2. Check you copied entire key
3. No extra spaces or quotes
4. Redeploy after updating

---

### Issue: Webhook not working

**Check:**
1. Webhook URL is correct: `https://soulbridge.co.za/api/webhooks/clerk`
2. Events are selected in Clerk Dashboard
3. Signing secret matches in Vercel
4. Check "Recent Attempts" in Clerk Dashboard
5. View Vercel logs for errors

**Test webhook manually:**
```bash
# View recent logs
vercel logs soulbridge --prod | grep webhook
```

---

### Issue: Users not syncing to Supabase

**Verify:**
1. Webhook is firing (check Clerk Dashboard)
2. Webhook returns 200 status
3. Supabase service role key is correct
4. Check database trigger exists

**Check in Supabase:**
```sql
-- Check if profiles table exists
SELECT * FROM profiles LIMIT 1;

-- Check if trigger exists
SELECT trigger_name
FROM information_schema.triggers
WHERE event_object_table = 'profiles';
```

---

### Issue: Redirect loops on sign-in

**Fix:**
1. Verify redirects in Clerk Dashboard
2. Clear browser cookies
3. Check middleware is working
4. Verify production URL is correct

---

## Security Checklist

Before going live:

- [ ] Using production keys (`pk_live_`, `sk_live_`)
- [ ] Webhook signing secret is production version
- [ ] Domain authorized in Clerk
- [ ] SSL/HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured in Vercel
- [ ] No keys committed to git
- [ ] Webhook signature verification enabled
- [ ] Test users removed from production
- [ ] Error monitoring configured

---

## Post-Migration Checklist

After switching to production:

- [ ] Delete test users from Clerk Dashboard
- [ ] Remove development instance (if not needed)
- [ ] Update team on new Clerk instance
- [ ] Share production webhook secret securely
- [ ] Set up monitoring alerts
- [ ] Document any custom configuration
- [ ] Test all authentication flows
- [ ] Monitor logs for 24 hours
- [ ] Backup environment variables

---

## Rollback Plan

If something goes wrong:

1. **Quick rollback:**
   ```bash
   # Restore development keys in Vercel
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
   # Paste: pk_test_YOUR_DEV_KEY

   vercel env add CLERK_SECRET_KEY production
   # Paste: sk_test_YOUR_DEV_SECRET

   # Redeploy
   vercel --prod --yes
   ```

2. **Verify rollback:**
   - Test sign-in works
   - Check logs for errors
   - Verify webhooks working

3. **Investigate issue:**
   - Check what went wrong
   - Review configuration
   - Contact Clerk support if needed

---

## Next Steps After Migration

Once production Clerk is working:

1. ✅ **Authentication is production-ready**
2. ✅ **Users can sign up with real emails**
3. ✅ **Webhooks sync to production database**
4. ✅ **Ready for real users**

Then you can:
- Start marketing
- Invite beta users
- Launch publicly
- Build additional features

---

## Quick Reference Commands

```bash
# View current environment variables
vercel env ls

# View production logs
vercel logs soulbridge --prod

# Pull production environment to local
vercel env pull .env.production

# Redeploy production
vercel --prod --yes

# Check Clerk API status
curl https://api.clerk.com/v1/health
```

---

## Support Resources

- **Clerk Dashboard:** https://dashboard.clerk.com
- **Clerk Docs:** https://clerk.com/docs
- **Clerk Support:** support@clerk.com
- **Clerk Discord:** https://discord.gg/clerk
- **Status Page:** https://status.clerk.com

---

## Summary

**What You're Changing:**

| Item | From (Development) | To (Production) |
|------|-------------------|-----------------|
| Publishable Key | `pk_test_...` | `pk_live_...` |
| Secret Key | `sk_test_...` | `sk_live_...` |
| Webhook Secret | Dev `whsec_...` | Prod `whsec_...` |
| Domain | localhost:3000 | soulbridge.co.za |
| Users | Test data | Real users |

**Time Required:** ~30 minutes
**Difficulty:** Low (mostly copy-paste)
**Risk:** Low (can rollback easily)

---

## Ready to Migrate?

Follow these steps in order:

1. ✅ Read this guide thoroughly
2. ✅ Create production Clerk instance
3. ✅ Copy production keys
4. ✅ Configure domain and webhook
5. ✅ Update environment variables
6. ✅ Deploy to production
7. ✅ Test thoroughly
8. ✅ Monitor for issues

**You've got this! Let's make SoulBridge production-ready! 🚀**
