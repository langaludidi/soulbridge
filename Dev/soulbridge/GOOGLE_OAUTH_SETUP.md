# Google OAuth Configuration - SoulBridge

**Client ID:** `[YOUR_GOOGLE_OAUTH_CLIENT_ID].apps.googleusercontent.com`
**Status:** Configuration Required

---

## Overview

Setting up Google OAuth ("Sign in with Google") allows users to authenticate using their Google accounts instead of creating a password.

**Benefits:**
- ✅ Faster sign-up (1-click)
- ✅ No password to remember
- ✅ Better security (Google handles auth)
- ✅ Improved user experience

---

## Part 1: Configure in Clerk Dashboard

### Step 1: Enable Google OAuth

1. **Go to Clerk Dashboard:** https://dashboard.clerk.com
2. **Navigate to:** User & authentication → **SSO connections**
3. **Find:** Google (should be in the list)
4. **Click:** Toggle to enable Google OAuth

---

### Step 2: Get Clerk's Redirect URI

After enabling Google in Clerk, you'll see:

**Authorized redirect URI:**
```
https://clerk.soulbridge.co.za/v1/oauth_callback
```

**Copy this URI** - you'll need it for Google Cloud Console.

---

### Step 3: Enter Google Credentials in Clerk

In the Google OAuth settings in Clerk, you'll see fields for:

**Client ID:**
```
[YOUR_GOOGLE_OAUTH_CLIENT_ID].apps.googleusercontent.com
```

**Client Secret:**
```
[You need to get this from Google Cloud Console]
```

**Don't save yet** - we need to configure Google Cloud Console first.

---

## Part 2: Configure Google Cloud Console

### Step 1: Access Google Cloud Console

1. **Visit:** https://console.cloud.google.com
2. **Sign in** with the Google account that owns this OAuth client
3. **Select your project** (or create one if needed)

---

### Step 2: Go to OAuth Consent Screen

1. **Navigate to:** APIs & Services → **OAuth consent screen**
2. **Verify these settings:**

#### Application Information
```
App name: SoulBridge Memorials
User support email: [your-email@soulbridge.co.za]
Application homepage: https://soulbridge.co.za
```

#### Application Domain
```
Application home page: https://soulbridge.co.za
Application privacy policy: https://soulbridge.co.za/privacy
Application terms of service: https://soulbridge.co.za/terms
```

#### Authorized Domains
Add these domains:
```
soulbridge.co.za
clerk.soulbridge.co.za
```

#### Developer Contact Information
```
Email addresses: [your-email@soulbridge.co.za]
```

3. **Save and Continue**

---

### Step 3: Configure OAuth Client

1. **Navigate to:** APIs & Services → **Credentials**
2. **Find your OAuth 2.0 Client:**
   - Client ID: `[YOUR_GOOGLE_OAUTH_CLIENT_ID].apps.googleusercontent.com`
3. **Click on it to edit**

---

### Step 4: Add Authorized Redirect URIs

**CRITICAL:** Add these exact URIs to "Authorized redirect URIs":

```
https://clerk.soulbridge.co.za/v1/oauth_callback
https://accounts.soulbridge.co.za/v1/oauth_callback
```

**Also add these for development (optional):**
```
http://localhost:3000/api/auth/callback/google
https://soulbridge.co.za/api/auth/callback/google
```

**Screenshot the Client Secret** or copy it - you'll need it for Clerk.

4. **Click "Save"**

---

### Step 5: Get Client Secret

If you don't have the client secret:

1. In the OAuth client edit screen
2. Look for **"Client secret"** field
3. If you can't see it, click **"Download JSON"**
4. Open the JSON file and find the `client_secret` field
5. **Copy the client secret**

Example format: `GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Part 3: Complete Clerk Configuration

### Step 1: Add Credentials to Clerk

1. **Return to Clerk Dashboard**
2. **Go to:** User & authentication → **SSO connections** → **Google**
3. **Enter:**
   ```
   Client ID: [YOUR_GOOGLE_OAUTH_CLIENT_ID].apps.googleusercontent.com
   Client Secret: [paste your secret here]
   ```
4. **Click "Save"**

---

### Step 2: Configure OAuth Settings

In Clerk's Google OAuth settings:

**Scopes:**
- ✅ email (required)
- ✅ profile (required)
- ✅ openid (required)

**Additional Settings:**
- ✅ Enable account linking (recommended)
- ✅ Allow first-time sign-up via Google
- ✅ Require email verification (optional)

**Save all settings**

---

## Part 4: Test Configuration

### Test 1: Development Environment

1. **Run locally:**
   ```bash
   npm run dev
   ```

2. **Visit:** http://localhost:3000/sign-in
3. **Look for:** "Continue with Google" button
4. **Click it** and test the flow

**Expected:**
- Google OAuth screen opens
- Select account
- Grant permissions
- Redirects back to your app
- User is signed in
- Profile created in Supabase

---

### Test 2: Production Environment

1. **Visit:** https://soulbridge.co.za/sign-in
2. **Click:** "Continue with Google"
3. **Sign in** with test Google account

**Expected:**
- OAuth flow completes
- Redirects to `/dashboard`
- User created in Clerk
- Webhook triggers
- Profile created in Supabase
- Lite plan assigned

---

### Verify in Supabase

```sql
SELECT
  p.email,
  p.clerk_user_id,
  p.first_name,
  p.last_name,
  up.plan_type
FROM profiles p
LEFT JOIN user_plans up ON p.id = up.profile_id
ORDER BY p.created_at DESC
LIMIT 5;
```

---

## Troubleshooting

### Issue: "Redirect URI mismatch"

**Error message:**
```
Error 400: redirect_uri_mismatch
```

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Verify exact URI is added:
   ```
   https://clerk.soulbridge.co.za/v1/oauth_callback
   ```
3. Check for trailing slashes (shouldn't have one)
4. Wait 5 minutes after saving in Google Console
5. Try again

---

### Issue: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not configured properly

**Solution:**
1. Go to OAuth consent screen
2. Fill in ALL required fields:
   - App name
   - Support email
   - Developer contact
   - Authorized domains
3. Save and try again

---

### Issue: "Google" button not showing in Clerk

**Check:**
1. Clerk Dashboard → SSO connections → Google is **enabled**
2. Client ID and Secret are **entered and saved**
3. Clear browser cache
4. Try incognito mode

---

### Issue: User created but no profile in Supabase

**Debug:**
1. Check Clerk Dashboard → Webhooks
2. View recent webhook attempts
3. Should see `user.created` event
4. Check Vercel logs:
   ```bash
   vercel logs soulbridge | grep webhook
   ```
5. Verify webhook secret matches

---

## Security Checklist

- [ ] OAuth consent screen fully configured
- [ ] Authorized domains added (soulbridge.co.za)
- [ ] Authorized redirect URIs added (Clerk URL)
- [ ] Client secret stored securely in Clerk
- [ ] Client secret NOT committed to git
- [ ] Test with real Google account
- [ ] Verify webhook creates profile
- [ ] Verify Lite plan assigned
- [ ] Check user can sign in again

---

## Complete Configuration Summary

### Google Cloud Console

**OAuth Consent Screen:**
- ✅ App name: SoulBridge Memorials
- ✅ Support email: Set
- ✅ Authorized domains: soulbridge.co.za, clerk.soulbridge.co.za
- ✅ Privacy policy: https://soulbridge.co.za/privacy
- ✅ Terms of service: https://soulbridge.co.za/terms

**OAuth Client:**
- ✅ Client ID: `[YOUR_GOOGLE_OAUTH_CLIENT_ID].apps.googleusercontent.com`
- ✅ Client Secret: Configured in Clerk
- ✅ Authorized redirect URI: `https://clerk.soulbridge.co.za/v1/oauth_callback`

### Clerk Dashboard

**SSO Connections:**
- ✅ Google OAuth: Enabled
- ✅ Client ID: Entered
- ✅ Client Secret: Entered
- ✅ Scopes: email, profile, openid
- ✅ Account linking: Enabled

---

## User Experience Flow

### Sign Up with Google

```
User clicks "Continue with Google"
    ↓
Google OAuth screen opens
    ↓
User selects Google account
    ↓
Google asks for permissions (email, profile)
    ↓
User grants permissions
    ↓
Redirects to clerk.soulbridge.co.za/v1/oauth_callback
    ↓
Clerk creates user account
    ↓
Clerk triggers webhook → https://soulbridge.co.za/api/webhooks/clerk
    ↓
Webhook creates profile in Supabase
    ↓
Database trigger assigns Lite plan
    ↓
User redirects to /dashboard
    ↓
User is signed in! ✅
```

---

## Required Information Checklist

Before you start, gather these:

**From Google Cloud Console:**
- [ ] Client ID (you have this)
- [ ] Client Secret (need to get from Google Console)
- [ ] Project name where OAuth client lives

**From Clerk:**
- [ ] Redirect URI (will get after enabling Google)

**For Google Console:**
- [ ] App name: SoulBridge Memorials
- [ ] Support email: [your email]
- [ ] Privacy policy URL (create if needed)
- [ ] Terms of service URL (create if needed)

---

## Next Steps

1. **Get Client Secret:**
   - Go to Google Cloud Console
   - Navigate to Credentials
   - Find your OAuth client
   - Copy the client secret

2. **Configure in Clerk:**
   - Enable Google in SSO connections
   - Enter Client ID and Secret
   - Get redirect URI

3. **Update Google Console:**
   - Add Clerk's redirect URI
   - Verify consent screen
   - Save changes

4. **Test:**
   - Try sign-in with Google
   - Verify profile creation
   - Check plan assignment

---

## Support Resources

**Google Cloud Console:**
- Console: https://console.cloud.google.com
- OAuth Guide: https://developers.google.com/identity/protocols/oauth2

**Clerk:**
- Dashboard: https://dashboard.clerk.com
- Docs: https://clerk.com/docs/authentication/social-connections/google
- Support: support@clerk.com

---

## Quick Reference Commands

```bash
# Check if Google OAuth is working in production
curl -I https://soulbridge.co.za/sign-in
# Should return 200 and load Clerk sign-in

# View webhook logs
vercel logs soulbridge | grep "user.created"

# Check Supabase for new Google sign-ups
# (Run in Supabase SQL editor)
SELECT * FROM profiles WHERE created_at > NOW() - INTERVAL '1 hour';
```

---

**Once configured, users can sign up with just 2 clicks! 🚀**

Let me know your client secret, and I'll help you complete the Clerk configuration!
