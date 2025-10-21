# Google OAuth Setup Instructions - SoulBridge

**Status:** Ready to Configure in Clerk Dashboard
**Time Required:** 5 minutes

---

## ✅ What's Already Done

I've configured the Google OAuth credentials in your environment:

**Vercel Production:**
- ✅ `GOOGLE_OAUTH_CLIENT_ID` added
- ✅ `GOOGLE_OAUTH_CLIENT_SECRET` added

**Local Environment:**
- ✅ Credentials added to `.env.local`

---

## 🎯 Your Next Steps

### Step 1: Enable Google OAuth in Clerk (2 minutes)

1. **Go to:** https://dashboard.clerk.com
2. **Navigate to:** User & authentication → **SSO connections**
3. **Find:** Google in the list
4. **Click:** The toggle to **enable** Google OAuth

---

### Step 2: Enter Google Credentials in Clerk (1 minute)

After enabling, you'll see a configuration screen:

**Enter these values:**

**Client ID:**
```
[Your Google OAuth Client ID - configured in Vercel]
```

**Client Secret:**
```
[Your Google OAuth Client Secret - configured in Vercel]
```

**Click "Save"** at the bottom

---

### Step 3: Copy the Redirect URI from Clerk (30 seconds)

After saving, Clerk will show you:

**Authorized redirect URI:**
```
(It will look like this)
https://clerk.soulbridge.co.za/v1/oauth_callback
```

**Copy this exact URI** - you'll need it for Google Console

---

### Step 4: Add Redirect URI in Google Cloud Console (2 minutes)

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Find your OAuth client:**
   - Client ID: `[YOUR_GOOGLE_OAUTH_CLIENT_ID]`
3. **Click on it** to edit
4. **Scroll to:** "Authorized redirect URIs"
5. **Click:** "Add URI"
6. **Paste the URI** from Clerk (Step 3)
   - Should be: `https://clerk.soulbridge.co.za/v1/oauth_callback`
7. **Also add:** `https://accounts.soulbridge.co.za/v1/oauth_callback` (for account portal)
8. **Click "Save"** at the bottom

---

### Step 5: Verify OAuth Consent Screen (1 minute)

While in Google Cloud Console:

1. **Click:** "OAuth consent screen" in the left menu
2. **Verify these are set:**

**App Information:**
- App name: `SoulBridge Memorials` (or your preferred name)
- User support email: Your email
- Developer contact: Your email

**App Domain:**
- Application homepage: `https://soulbridge.co.za`
- Privacy policy: `https://soulbridge.co.za/privacy` (create if needed)
- Terms of service: `https://soulbridge.co.za/terms` (create if needed)

**Authorized Domains:**
- `soulbridge.co.za`
- `clerk.soulbridge.co.za`

If anything is missing, fill it in and **save**.

---

## 🧪 Test the Setup (2 minutes)

### Quick Test

1. **Visit:** https://soulbridge.co.za/sign-in
2. **Look for:** "Continue with Google" button
3. **Click it**
4. **Expected:** Google OAuth screen opens
5. **Sign in** with a test Google account
6. **Expected:**
   - Redirects back to your app
   - Goes to `/dashboard`
   - User is signed in

### Verify in Supabase

```sql
SELECT
  p.email,
  p.clerk_user_id,
  p.first_name,
  p.last_name,
  up.plan_type,
  p.created_at
FROM profiles p
LEFT JOIN user_plans up ON p.id = up.profile_id
WHERE p.created_at > NOW() - INTERVAL '10 minutes'
ORDER BY p.created_at DESC;
```

**Expected:**
- User created with Google email
- Name populated from Google profile
- Lite plan auto-assigned

---

## 📋 Configuration Checklist

Complete these in order:

- [ ] **Clerk Dashboard:** Enable Google in SSO connections
- [ ] **Clerk Dashboard:** Enter Client ID and Secret
- [ ] **Clerk Dashboard:** Copy redirect URI
- [ ] **Google Console:** Add redirect URI to OAuth client
- [ ] **Google Console:** Verify OAuth consent screen
- [ ] **Google Console:** Verify authorized domains
- [ ] **Test:** Sign in with Google works
- [ ] **Verify:** User created in Supabase
- [ ] **Verify:** Lite plan assigned

---

## 🎨 What Users Will See

### On Sign-In Page

After configuration, your sign-in page will show:

```
┌───────────────────────────────────────┐
│                                       │
│  [G] Continue with Google             │
│                                       │
│  ─────────── or ────────────          │
│                                       │
│  Email address                        │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                       │
│  Password                             │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                       │
│         [Sign in] →                   │
│                                       │
│  Don't have an account? Sign up       │
│                                       │
└───────────────────────────────────────┘
```

---

## 🔐 Security Notes

**✅ Secure:**
- Client secret stored in Vercel (not in code)
- OAuth flow uses HTTPS
- Clerk handles authentication
- Google validates identity

**⚠️ Important:**
- Never commit `.env.local` to git (already in `.gitignore`)
- Don't share client secret publicly
- Keep OAuth consent screen up to date
- Monitor unauthorized access attempts

---

## 🐛 Troubleshooting

### Issue: "Redirect URI mismatch"

**Error:**
```
Error 400: redirect_uri_mismatch
The redirect URI in the request: https://clerk.soulbridge.co.za/v1/oauth_callback
does not match the ones authorized for the OAuth client.
```

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Click on your OAuth client
3. Verify **exact** URI is in "Authorized redirect URIs":
   ```
   https://clerk.soulbridge.co.za/v1/oauth_callback
   ```
4. No trailing slash
5. Exact protocol (https://)
6. Save and wait 5 minutes

---

### Issue: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen incomplete

**Solution:**
1. Go to OAuth consent screen
2. Fill in ALL required fields:
   - App name
   - Support email
   - Developer contact
   - At least one scope (email, profile)
3. Add authorized domains:
   - soulbridge.co.za
   - clerk.soulbridge.co.za
4. Save

---

### Issue: Google button not showing

**Check:**
1. Clerk Dashboard → SSO connections → Google is **enabled** (toggle is on)
2. Client ID and Secret are entered correctly
3. Settings are **saved** in Clerk
4. Clear browser cache or try incognito
5. Check browser console for errors (F12)

---

### Issue: User created in Clerk but not in Supabase

**Debug:**
1. Check Clerk Dashboard → Webhooks
2. View recent attempts for `user.created` event
3. Should show 200 status
4. If failing, check Vercel logs:
   ```bash
   vercel logs soulbridge | grep "user.created"
   ```
5. Verify webhook secret matches in both places

---

## 📊 Expected Redirect URIs

**In Google Cloud Console, you should have:**

```
https://clerk.soulbridge.co.za/v1/oauth_callback
https://accounts.soulbridge.co.za/v1/oauth_callback
```

**Optional for development:**
```
http://localhost:3000
```

---

## 🎯 Success Criteria

Google OAuth is working when:

✅ "Continue with Google" button appears on sign-in page
✅ Clicking it opens Google OAuth consent screen
✅ After signing in with Google, redirects to `/dashboard`
✅ User is created in Clerk
✅ User profile created in Supabase
✅ Lite plan auto-assigned
✅ User can sign out and sign in again with Google

---

## 📞 Support

**If you get stuck:**

**Clerk Support:**
- Dashboard help button (chat)
- Email: support@clerk.com
- Docs: https://clerk.com/docs/authentication/social-connections/google

**Google Support:**
- Google Cloud Console: https://console.cloud.google.com/support
- OAuth troubleshooting: https://developers.google.com/identity/protocols/oauth2

---

## 🚀 Next Steps After Setup

Once Google OAuth is working:

1. **Test thoroughly:**
   - Sign up with Google
   - Sign in with Google
   - Sign out and sign in again

2. **Consider adding more providers:**
   - Facebook OAuth
   - Twitter/X OAuth
   - Microsoft OAuth
   - Apple Sign In

3. **Update your documentation:**
   - Privacy policy (mention Google login)
   - Terms of service

4. **Monitor usage:**
   - Track % of users using Google vs email/password
   - Check conversion rates

---

## 🎉 That's It!

Follow the steps above and Google OAuth will be configured in ~5 minutes!

**Your users will love the 1-click sign-up experience!** 🚀

---

**Current Status:**
- ✅ Credentials stored securely in Vercel
- ✅ Local environment configured
- ⏳ Waiting for you to configure in Clerk Dashboard
- ⏳ Waiting for redirect URI in Google Console

**Next:** Go to Clerk Dashboard and enable Google OAuth!
