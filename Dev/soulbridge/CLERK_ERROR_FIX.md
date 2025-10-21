# Clerk Configuration Error Fix

**Error:** `MIDDLEWARE_INVOCATION_FAILED`
**Status:** ⚠️ Clerk domain not authorized
**Fix Time:** ~5 minutes

---

## What Happened

The deployment was successful, but the site is showing a 500 error with:
```
A server error has occurred
MIDDLEWARE_INVOCATION_FAILED
```

This happens because **Clerk** doesn't recognize `soulbridge.co.za` as an authorized domain yet.

---

## Quick Fix (5 minutes)

### Step 1: Go to Clerk Dashboard

Visit: https://dashboard.clerk.com

### Step 2: Add Authorized Domain

1. Click on your **SoulBridge** application
2. Go to **Configure** → **Domains** (or **Settings** → **Domains**)
3. Click **"Add domain"** or **"Authorize domain"**
4. Add these domains:

```
soulbridge.co.za
www.soulbridge.co.za
```

5. **Save** the changes

### Step 3: Verify Paths

While in the Clerk Dashboard:

1. Go to **Configure** → **Paths**
2. Verify these settings:

```
Sign-in URL: /sign-in
Sign-up URL: /sign-up
After sign-in redirect: /dashboard
After sign-up redirect: /dashboard
Sign-out redirect: /
```

### Step 4: Wait & Test (2-3 minutes)

1. **Wait 2-3 minutes** for Clerk to propagate the changes
2. Visit https://soulbridge.co.za
3. Site should now load correctly!

---

## How to Know It's Fixed

### Before Fix:
```
curl -I https://soulbridge.co.za
HTTP/2 500
```

### After Fix:
```
curl -I https://soulbridge.co.za
HTTP/2 200
x-clerk-auth-status: signed-out
```

---

## Detailed Steps with Screenshots

### 1. Clerk Dashboard - Domains

**Location:** Dashboard → Configure → Domains

**What to do:**
- Add `soulbridge.co.za`
- Add `www.soulbridge.co.za`

**Why:** Clerk needs to know which domains are allowed to use your authentication instance.

---

### 2. Clerk Dashboard - Paths

**Location:** Dashboard → Configure → Paths

**Verify these paths:**

| Setting | Value |
|---------|-------|
| Sign-in path | `/sign-in` |
| Sign-up path | `/sign-up` |
| After sign-in | `/dashboard` |
| After sign-up | `/dashboard` |
| After sign-out | `/` |

---

### 3. Clerk Dashboard - Application URLs

**Location:** Dashboard → Configure → General

**Set:**
```
Application URL: https://soulbridge.co.za
Homepage URL: https://soulbridge.co.za
```

---

## Alternative: Temporary Fix for Testing

If you want to test immediately while waiting for domain authorization:

### Option 1: Use Vercel Preview URL

The Vercel preview URL should work:
```
https://soulbridge-q5n3q3825-ludidil-5352s-projects.vercel.app
```

Add this to Clerk authorized domains temporarily.

### Option 2: Test Locally

```bash
npm run dev
# Visit http://localhost:3000
```

Local development should work fine.

---

## Why This Happened

1. **We updated to production Clerk keys** ✅
2. **We deployed the changes** ✅
3. **But**: Production domain not yet authorized in Clerk Dashboard ⚠️

This is a normal part of the setup process!

---

## After You Fix This

Once the domain is authorized:

### Test Checklist:

- [ ] Visit https://soulbridge.co.za (should load)
- [ ] Click "Sign Up" (should show Clerk signup form)
- [ ] Create test account
- [ ] Verify redirects to /dashboard
- [ ] Check Supabase profiles table (user should appear)
- [ ] Check user_plans table (Lite plan should be assigned)
- [ ] Sign out
- [ ] Sign in again (should work)
- [ ] Try to access /dashboard without being signed in (should redirect to /sign-in)

---

## Still Having Issues?

### Check these:

**1. Environment Variables in Vercel:**
```bash
vercel env ls
```
Should show:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Production)
- `CLERK_SECRET_KEY` (Production)
- `CLERK_WEBHOOK_SECRET` (Production)

**2. Clerk Instance Type:**
Go to Clerk Dashboard → Check you're in **Production** instance (not Development)

**3. API Keys:**
Verify keys start with:
- `pk_live_...` (not `pk_test_...`)
- `sk_live_...` (not `sk_test_...`)

---

## Need More Help?

### Clerk Support:
- Dashboard → Help button (chat support)
- Email: support@clerk.com
- Discord: https://discord.gg/clerk

### Share This Info:
```
Error: MIDDLEWARE_INVOCATION_FAILED
Domain: soulbridge.co.za
Clerk Instance: Production
Issue: Domain not authorized
```

---

## Summary

**Problem:** Clerk doesn't recognize soulbridge.co.za yet
**Solution:** Add domain to Clerk Dashboard → Domains
**Time:** 5 minutes
**Then:** Site will work perfectly!

---

**This is the final step before your authentication works perfectly! 🎉**

Once the domain is authorized, everything will work as expected.
