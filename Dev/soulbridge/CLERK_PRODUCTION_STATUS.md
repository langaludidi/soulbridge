# Clerk Production Status - SoulBridge

**Updated:** 2025-10-21
**Status:** ✅ PRODUCTION KEYS CONFIGURED

---

## Production Configuration Summary

### Clerk Instance Details

| Setting | Value |
|---------|-------|
| **Instance Type** | Production (Live) |
| **Publishable Key** | `pk_live_[CONFIGURED]` |
| **Secret Key** | `sk_live_4cbo...` (secured) |
| **Frontend API** | https://clerk.soulbridge.co.za |
| **Backend API** | https://api.clerk.com |
| **JWKS URL** | https://clerk.soulbridge.co.za/.well-known/jwks.json |

---

## Subdomain Setup

You're using **clerk.soulbridge.co.za** for Clerk authentication:

### Architecture

```
Main Application: https://soulbridge.co.za
Authentication:   https://clerk.soulbridge.co.za
```

### Benefits of This Setup

✅ **Security**: Authentication isolated from main app
✅ **Professional**: Dedicated auth domain
✅ **Flexibility**: Can change main app domain without affecting auth
✅ **Performance**: CDN optimization for auth assets

---

## DNS Configuration

Your DNS should have these records:

```dns
# Main site
Type: A or CNAME
Name: soulbridge.co.za
Value: [Vercel IP or cname.vercel-dns.com]

# www redirect
Type: CNAME
Name: www
Value: soulbridge.co.za

# Clerk authentication subdomain
Type: CNAME
Name: clerk
Value: clerk.soulbridge.co.za.clerk.accounts
```

---

## Environment Variables Status

### ✅ Updated in Vercel Production

| Variable | Status | Type |
|----------|--------|------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ Updated | Production (`pk_live_`) |
| `CLERK_SECRET_KEY` | ✅ Updated | Production (`sk_live_`) |
| `CLERK_WEBHOOK_SECRET` | ✅ Configured | Production webhook |

### Local Development (.env.local)

✅ Updated with production keys

**Note:** For local development, you can still use development keys if you want to test without affecting production data. Just create a separate `.env.local.dev` file.

---

## Webhook Configuration

### Current Setup

**Endpoint URL:**
```
https://soulbridge.co.za/api/webhooks/clerk
```

**Signing Secret:**
```
whsec_[YOUR_WEBHOOK_SECRET]
```

**Events Subscribed:**
- ✅ `user.created`
- ✅ `user.updated`
- ✅ `user.deleted`
- ✅ `session.created`

### Verify Webhook in Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Navigate to **Webhooks**
3. Verify endpoint is: `https://soulbridge.co.za/api/webhooks/clerk`
4. Check "Recent Attempts" for delivery status

---

## Authentication Flow

### Sign-Up Flow

```
User clicks "Sign Up"
    ↓
Redirects to /sign-up (served by clerk.soulbridge.co.za)
    ↓
User fills form and submits
    ↓
Clerk creates user account
    ↓
Clerk triggers webhook → https://soulbridge.co.za/api/webhooks/clerk
    ↓
Webhook handler creates profile in Supabase
    ↓
Database trigger creates Lite plan
    ↓
User redirected to /dashboard
```

### Sign-In Flow

```
User goes to /sign-in
    ↓
Clerk authenticates (hosted on clerk.soulbridge.co.za)
    ↓
Session created
    ↓
User redirected to /dashboard
    ↓
Session persists via cookies
```

---

## Protected Routes

These routes require authentication:

| Route | Access |
|-------|--------|
| `/dashboard` | Authenticated users only |
| `/create-memorial` | Authenticated users only |
| `/my-memorials` | Authenticated users only |
| `/settings` | Authenticated users only |
| `/checkout` | Authenticated users only |
| `/memorials/[id]/edit` | Owner only |

---

## Testing Checklist

### Before Deployment

- [x] Production keys added to Vercel
- [x] Local environment updated
- [ ] Deploy to production
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Verify webhook triggers
- [ ] Check profile creation in Supabase
- [ ] Verify Lite plan assignment

### After Deployment

Once deployed, test:

1. **Sign Up:**
   ```
   https://soulbridge.co.za → Click "Sign Up"
   Should work with production Clerk instance
   ```

2. **Webhook:**
   ```
   Check Supabase profiles table
   New user should appear
   ```

3. **Plan Assignment:**
   ```sql
   SELECT p.email, up.plan_type, up.max_memorials
   FROM profiles p
   JOIN user_plans up ON p.id = up.profile_id
   WHERE p.email = 'your-test-email@example.com';
   ```

4. **Sign In:**
   ```
   Sign out, then sign in
   Should persist session
   ```

---

## Security Notes

### ✅ Secured

- Production keys stored in Vercel (not in code)
- Webhook signature verification enabled
- SSL/HTTPS enforced
- Secrets not committed to Git

### ⚠️ Verify

Make sure:
- [ ] Clerk Dashboard has correct domain authorized: `soulbridge.co.za`
- [ ] Webhook URL uses HTTPS (not HTTP)
- [ ] No test keys in production environment
- [ ] `.env.local` in `.gitignore`

---

## Monitoring

### Clerk Dashboard

Monitor these metrics:
- **Users**: Track sign-ups
- **Sessions**: Active user sessions
- **Webhooks**: Delivery success rate

### Application Logs

```bash
# View production logs
vercel logs soulbridge --prod

# Filter for Clerk events
vercel logs soulbridge --prod | grep clerk
```

### Database

```sql
-- New users today
SELECT COUNT(*) FROM profiles
WHERE created_at >= CURRENT_DATE;

-- Active plans
SELECT plan_type, COUNT(*)
FROM user_plans
WHERE plan_status = 'active'
GROUP BY plan_type;
```

---

## Troubleshooting

### Issue: "Invalid publishable key"

**Check:**
```bash
# Verify production key is set
vercel env ls | grep CLERK_PUBLISHABLE

# Should show:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY    Encrypted    Production
```

**Fix:**
Key should start with `pk_live_` (not `pk_test_`)

---

### Issue: Webhook not firing

**Check Clerk Dashboard:**
1. Webhooks → Your endpoint
2. View "Recent Attempts"
3. Look for errors

**Check Vercel Logs:**
```bash
vercel logs soulbridge --prod | grep webhook
```

**Verify endpoint:**
```bash
curl -I https://soulbridge.co.za/api/webhooks/clerk
# Should return 405 Method Not Allowed (POST required)
```

---

### Issue: Users not syncing to Supabase

**Debug steps:**
1. Check webhook is firing in Clerk Dashboard
2. Check Vercel logs for errors
3. Verify Supabase service role key is correct
4. Test webhook endpoint manually

---

## Next Steps

### 1. Deploy to Production

```bash
git add .
git commit -m "Switch to Clerk production instance

- Updated to production keys (pk_live_, sk_live_)
- Configured for clerk.soulbridge.co.za subdomain
- Environment variables updated in Vercel
- Ready for production authentication"

git push origin main
vercel --prod --yes
```

### 2. Test Authentication

After deployment:
1. Create test account
2. Verify profile in Supabase
3. Check Lite plan assignment
4. Test sign-in flow

### 3. Verify Webhook

Check Clerk Dashboard → Webhooks → Recent Attempts:
- Should show successful deliveries (200 status)

### 4. Monitor First Users

Watch for:
- Successful sign-ups
- Profile creation
- Plan assignment
- No errors in logs

---

## Rollback Plan

If issues occur:

```bash
# Restore development keys
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Paste: pk_test_ZGl2ZXJzZS1jcmF3ZGFkLTUzLmNsZXJrLmFjY291bnRzLmRldiQ

vercel env add CLERK_SECRET_KEY production
# Paste: sk_test_GDeDbnISTS01ViPRP18Kw0ODOEog0YwC9bgbEIybL6

# Redeploy
vercel --prod --yes
```

---

## Production URLs

| Service | URL |
|---------|-----|
| **Main Site** | https://soulbridge.co.za |
| **Clerk Auth** | https://clerk.soulbridge.co.za |
| **API** | https://soulbridge.co.za/api |
| **Webhook** | https://soulbridge.co.za/api/webhooks/clerk |
| **Dashboard** | https://soulbridge.co.za/dashboard |

---

## Support Resources

**Clerk:**
- Dashboard: https://dashboard.clerk.com
- Docs: https://clerk.com/docs
- Support: support@clerk.com
- Status: https://status.clerk.com

**Vercel:**
- Dashboard: https://vercel.com/ludidil-5352s-projects/soulbridge
- Logs: `vercel logs soulbridge --prod`

**Supabase:**
- Dashboard: https://supabase.com/dashboard

---

## Configuration Files

| File | Status |
|------|--------|
| `.env.local` | ✅ Updated with production keys |
| `middleware.ts` | ✅ Protecting routes correctly |
| `app/api/webhooks/clerk/route.ts` | ✅ Webhook handler ready |
| `CLERK_CONFIGURATION.md` | ✅ Technical docs |
| `CLERK_DASHBOARD_SETUP.md` | ✅ Setup guide |
| `CLERK_PRODUCTION_MIGRATION.md` | ✅ Migration guide |

---

## Summary

**What Changed:**

| Item | Before | After |
|------|--------|-------|
| Publishable Key | `pk_test_...` | `pk_live_Y2xlc...` |
| Secret Key | `sk_test_...` | `sk_live_4cbo...` |
| Environment | Development | Production |
| Auth Domain | localhost | clerk.soulbridge.co.za |
| Ready for Users | No | Yes |

**Status:** ✅ Ready to Deploy

**Next Action:** Run `vercel --prod --yes` to deploy

---

**All Clerk production configuration is complete!** 🎉

The authentication system is ready for real users once deployed.
