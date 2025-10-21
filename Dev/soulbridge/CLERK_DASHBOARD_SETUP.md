# Clerk Dashboard Setup - Quick Reference

**Production URL:** https://soulbridge.co.za
**Webhook Secret:** `whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy` ✅

---

## 1. Authorize Production Domains

**Location:** Clerk Dashboard > Settings > Domains

**Action:** Add these domains to the authorized list:

```
soulbridge.co.za
www.soulbridge.co.za
```

**Why:** This allows Clerk to accept authentication requests from your production domain.

---

## 2. Configure Authentication Paths

**Location:** Clerk Dashboard > Configure > Paths

### Sign In
- **Path:** `/sign-in`

### Sign Up
- **Path:** `/sign-up`

### After Sign In
- **Redirect URL:** `/dashboard`

### After Sign Up
- **Redirect URL:** `/dashboard`

### Sign Out
- **Redirect URL:** `/` (homepage)

**Why:** These paths tell Clerk where to send users during the authentication flow.

---

## 3. Set Application URLs

**Location:** Clerk Dashboard > Configure > General

### Production
- **Application URL:** `https://soulbridge.co.za`
- **Homepage URL:** `https://soulbridge.co.za`

**Why:** Clerk needs to know your production URL for CORS and redirects.

---

## 4. Configure Webhook

**Location:** Clerk Dashboard > Webhooks

### Create New Endpoint

Click "Add Endpoint" and configure:

**Endpoint URL:**
```
https://soulbridge.co.za/api/webhooks/clerk
```

**Signing Secret:**
```
whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy
```
✅ Already configured in Vercel environment variables

**Events to Subscribe:**
- ✅ `user.created`
- ✅ `user.updated`
- ✅ `user.deleted`
- ✅ `session.created`

**Why:** These events trigger automatic profile creation and sync in Supabase.

---

## 5. Test the Configuration

### After Configuration, Test:

1. **Sign Up Flow:**
   - Go to https://soulbridge.co.za
   - Click "Get Started"
   - Should go to `/sign-up`
   - Complete sign-up
   - Should redirect to `/dashboard`
   - Check Clerk Dashboard > Users (user should appear)
   - Check Supabase > profiles table (profile should be created)

2. **Sign In Flow:**
   - Go to https://soulbridge.co.za/sign-in
   - Enter credentials
   - Should redirect to `/dashboard`

3. **Webhook Delivery:**
   - Go to Clerk Dashboard > Webhooks
   - Click on your endpoint
   - View "Recent Attempts"
   - Should see successful deliveries (200 status)

4. **Protected Routes:**
   - Sign out
   - Try to access https://soulbridge.co.za/dashboard
   - Should redirect to `/sign-in`

---

## Environment Variables Verification

All Clerk environment variables are already set in Vercel production:

| Variable | Status | Value Preview |
|----------|--------|---------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ Set | `pk_test_ZGl2ZXJz...` |
| `CLERK_SECRET_KEY` | ✅ Set | `sk_test_GDeDbnIS...` |
| `CLERK_WEBHOOK_SECRET` | ✅ Set | `whsec_2U13AwdQy...` |

No changes needed to environment variables.

---

## Protected Routes

These routes require authentication (enforced by middleware):

| Route | Redirect if Not Signed In |
|-------|---------------------------|
| `/dashboard` | → `/sign-in` |
| `/create-memorial` | → `/sign-in` |
| `/my-memorials` | → `/sign-in` |
| `/settings` | → `/sign-in` |
| `/checkout` | → `/sign-in` |
| `/memorials/[id]/edit` | → `/sign-in` |

---

## Troubleshooting

### Issue: Can't sign in on production

**Check:**
1. Is `soulbridge.co.za` in authorized domains?
2. Are paths configured correctly (`/sign-in`, `/sign-up`)?
3. Is Application URL set to `https://soulbridge.co.za`?

**Fix:** Add domain and update paths in Clerk Dashboard.

---

### Issue: Webhook not working (users not syncing to Supabase)

**Check:**
1. Webhook URL: `https://soulbridge.co.za/api/webhooks/clerk`
2. Events selected: `user.created`, `user.updated`, `user.deleted`, `session.created`
3. Signing secret matches: `whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy`

**Verify:**
- Check "Recent Attempts" in Clerk Dashboard
- Check Vercel logs: `vercel logs soulbridge --prod`
- Look for 200 status codes

**Fix:** Update webhook configuration in Clerk Dashboard.

---

### Issue: Users created but no profile in Supabase

**Check:**
1. Webhook is receiving events (check Clerk Dashboard)
2. Webhook returns 200 status
3. Check Vercel logs for errors
4. Verify Supabase service role key is correct

**Verify in Supabase:**
```sql
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;
```

**Fix:** Check webhook logs in Vercel for errors.

---

### Issue: No Lite plan assigned to new users

**Check:**
1. User profile created in `profiles` table
2. Database trigger `create_default_user_plan()` exists
3. Check `user_plans` table for the user

**Verify in Supabase:**
```sql
SELECT
  p.email,
  up.plan_type,
  up.plan_status
FROM profiles p
LEFT JOIN user_plans up ON p.id = up.profile_id
WHERE p.clerk_user_id = '[clerk-user-id]';
```

**Fix:** Manually run the plan creation function or check database migrations.

---

## Summary Checklist

Use this checklist to verify everything is configured:

- [ ] Domains authorized in Clerk: `soulbridge.co.za`, `www.soulbridge.co.za`
- [ ] Paths configured: Sign-in `/sign-in`, Sign-up `/sign-up`
- [ ] Redirects configured: After sign-in/up → `/dashboard`, After sign-out → `/`
- [ ] Application URL set: `https://soulbridge.co.za`
- [ ] Webhook endpoint: `https://soulbridge.co.za/api/webhooks/clerk`
- [ ] Webhook signing secret matches: `whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy`
- [ ] Webhook events selected: user.created, user.updated, user.deleted, session.created
- [ ] Test sign-up creates user in Clerk
- [ ] Test sign-up creates profile in Supabase
- [ ] Test sign-up assigns Lite plan
- [ ] Test sign-in redirects to dashboard
- [ ] Test protected routes redirect to sign-in when not authenticated

---

## Quick Links

- **Clerk Dashboard:** https://dashboard.clerk.com
- **Production Site:** https://soulbridge.co.za
- **Vercel Dashboard:** https://vercel.com/ludidil-5352s-projects/soulbridge
- **Supabase Dashboard:** Your Supabase project dashboard

---

**All application-side configuration is complete.** Just complete the Clerk Dashboard steps above and your authentication will be fully operational!
