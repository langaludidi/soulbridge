# Clerk Configuration for SoulBridge

**Production Site:** https://soulbridge.co.za

---

## Current Configuration Status

✅ **Webhook Secret Confirmed:** `whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy`

---

## Clerk Dashboard Configuration

### 1. Domains & URLs

Go to **Clerk Dashboard > Configure > Paths**

#### Application URLs
```
Production URL: https://soulbridge.co.za
Home URL: https://soulbridge.co.za
```

#### Authorized Domains
Add the following domains to **Settings > Domains**:
```
soulbridge.co.za
www.soulbridge.co.za
```

---

### 2. Authentication Paths

Go to **Clerk Dashboard > Configure > Paths**

#### Sign In
```
Path: /sign-in
```

#### Sign Up
```
Path: /sign-up
```

#### After Sign In
```
Redirect URL: /dashboard
```

#### After Sign Up
```
Redirect URL: /dashboard
```

#### Sign Out
```
Redirect URL: /
```

---

### 3. Webhook Configuration

Go to **Clerk Dashboard > Webhooks**

#### Endpoint URL
```
https://soulbridge.co.za/api/webhooks/clerk
```

#### Signing Secret
```
whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy
```

#### Events to Subscribe
Select the following events:
- ✅ `user.created`
- ✅ `user.updated`
- ✅ `user.deleted`
- ✅ `session.created`

---

## Application Routes

### Authentication Routes (Public)
These routes are accessible without authentication:

| Route | Purpose | Component |
|-------|---------|-----------|
| `/sign-in` | User sign in | Clerk `<SignIn />` |
| `/sign-up` | User registration | Clerk `<SignUp />` |

### Protected Routes
These routes require authentication (configured in `middleware.ts`):

| Route Pattern | Purpose |
|---------------|---------|
| `/dashboard/*` | User dashboard and stats |
| `/create-memorial/*` | Create new memorial |
| `/my-memorials/*` | Manage user's memorials |
| `/settings/*` | User settings |
| `/checkout/*` | Payment checkout (requires login) |
| `/memorials/[id]/edit/*` | Edit memorial (owner only) |

### API Routes
These routes handle backend operations:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/webhooks/clerk` | POST | Clerk webhook handler (user sync) |
| `/api/memorials` | GET, POST | Memorial management |
| `/api/payment/*` | Multiple | Payment processing |

---

## Environment Variables

### Production (Vercel)
All set correctly ✅

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGl2ZXJzZS1jcmF3ZGFkLTUzLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_GDeDbnISTS01ViPRP18Kw0ODOEog0YwC9bgbEIybL6
CLERK_WEBHOOK_SECRET=whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy
```

### Local Development
Stored in `.env.local` ✅

---

## Middleware Configuration

**File:** `middleware.ts`

Protected routes are defined using `createRouteMatcher`:

```typescript
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/create-memorial(.*)',
  '/my-memorials(.*)',
  '/settings(.*)',
  '/checkout(.*)',
  '/memorials/[^/]+/edit(.*)',
])
```

The middleware:
1. Runs on all routes (except static files)
2. Checks if route is protected
3. If protected, calls `auth.protect()` to enforce authentication
4. Redirects to `/sign-in` if user is not authenticated

---

## User Sync Flow

### How It Works

1. **User Signs Up in Clerk**
   - User completes sign-up form
   - Clerk creates user account
   - Clerk triggers `user.created` webhook

2. **Webhook Received**
   - POST request sent to `https://soulbridge.co.za/api/webhooks/clerk`
   - Webhook signature verified using signing secret
   - Event type checked

3. **Profile Created in Supabase**
   - Profile created in `profiles` table
   - User data synced: email, name, avatar, phone
   - Database trigger creates free Lite plan automatically

4. **User Redirected to Dashboard**
   - After sign-up, user goes to `/dashboard`
   - Dashboard shows their Lite plan
   - User can create their first memorial

### Database Trigger
When a profile is created, the database automatically:
- Creates a user plan record (Lite plan by default)
- Sets plan limits (1 memorial, 5 photos, 3 months)
- Initializes usage tracking

---

## Testing the Configuration

### 1. Test Sign Up Flow

1. Go to https://soulbridge.co.za
2. Click "Get Started" or "Sign Up"
3. Fill in sign-up form
4. Complete email verification (if required)
5. Should redirect to `/dashboard`
6. Check that:
   - User profile created in Supabase
   - Lite plan assigned automatically
   - Dashboard shows plan details

### 2. Test Sign In Flow

1. Go to https://soulbridge.co.za/sign-in
2. Enter credentials
3. Click "Sign In"
4. Should redirect to `/dashboard`
5. Session should persist across page refreshes

### 3. Test Webhook

Check webhook logs in Clerk Dashboard:
1. Go to **Webhooks > Select your endpoint**
2. View "Recent Attempts"
3. Should see successful deliveries (200 status)
4. If failing, check:
   - Endpoint URL is correct
   - Signing secret matches
   - Server is responding

### 4. Test Protected Routes

Try accessing protected routes without authentication:
1. Sign out
2. Try to access `/dashboard`
3. Should redirect to `/sign-in`
4. After sign-in, should return to `/dashboard`

### 5. Test Memorial Creation

1. Sign in
2. Go to "Create Memorial"
3. Fill in memorial details
4. Submit
5. Should create memorial (Lite plan allows 1)
6. Try to create 2nd memorial
7. Should show upgrade prompt

---

## Troubleshooting

### Issue: Users can access protected routes without signing in

**Check:**
1. Middleware is running: `middleware.ts` exists in root
2. Route is in protected list
3. Clear browser cache and cookies
4. Check Clerk keys are correct

### Issue: Webhook not receiving events

**Check:**
1. Webhook URL: `https://soulbridge.co.za/api/webhooks/clerk`
2. Signing secret matches in both Clerk and Vercel
3. Events are selected in Clerk dashboard
4. Check Vercel logs: `vercel logs soulbridge --prod`

### Issue: Profile not created in Supabase

**Check:**
1. Webhook is firing (check Clerk dashboard)
2. Webhook returns 200 status
3. Check Supabase service role key is correct
4. View webhook logs in Vercel
5. Check database trigger is active

### Issue: Redirect loops on sign-in

**Check:**
1. After sign-in redirect is set to `/dashboard`
2. Dashboard is in protected routes list
3. Clear cookies and try again
4. Check Clerk session is valid

---

## Security Notes

1. **Webhook Verification**
   - All webhooks verify Svix signature
   - Prevents unauthorized requests
   - Uses `CLERK_WEBHOOK_SECRET`

2. **Protected Routes**
   - Middleware enforces authentication
   - Runs on every request
   - Redirects to sign-in if needed

3. **Environment Variables**
   - Never commit secrets to git
   - Use Vercel environment variables
   - Rotate keys if compromised

4. **Row Level Security (RLS)**
   - All Supabase tables have RLS enabled
   - Users can only access their own data
   - Service role bypasses RLS for webhooks

---

## Next Steps

1. ✅ Verify webhook secret matches: `whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy`
2. ⚠️ Add `soulbridge.co.za` to authorized domains in Clerk
3. ⚠️ Verify webhook URL in Clerk: `https://soulbridge.co.za/api/webhooks/clerk`
4. ⚠️ Test complete sign-up flow
5. ⚠️ Verify profile creation in Supabase
6. ⚠️ Test Lite plan auto-assignment

---

## API Endpoint: /api/webhooks/clerk

**Method:** POST
**Authentication:** Svix signature verification
**Content-Type:** application/json

### Request Headers Required
```
svix-id: <message-id>
svix-timestamp: <unix-timestamp>
svix-signature: <signature>
```

### Events Handled

#### user.created
Creates new profile in Supabase with:
- clerk_user_id
- email (primary)
- first_name
- last_name
- avatar_url
- phone_number

Triggers auto-creation of Lite plan.

#### user.updated
Updates existing profile with latest data from Clerk.

#### user.deleted
Soft deletes profile (sets status to 'deleted').

#### session.created
Logs user sign-in:
- Updates last_sign_in_at
- Creates session record

### Response Codes
- `200` - Success
- `400` - Missing headers or invalid signature
- `500` - Server error or missing configuration

---

## Verification Checklist

### ✅ Completed in Application

- ✅ Webhook endpoint configured: `/api/webhooks/clerk`
- ✅ Webhook signature verification implemented
- ✅ Sign-in page: `/sign-in`
- ✅ Sign-up page: `/sign-up`
- ✅ Protected routes configured in middleware:
  - `/dashboard/*`
  - `/create-memorial/*`
  - `/my-memorials/*`
  - `/settings/*`
  - `/checkout/*`
  - `/memorials/[id]/edit/*`
- ✅ Environment variables set in Vercel production:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET` (matches: `whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy`)
- ✅ User sync handlers implemented (create, update, delete, session)
- ✅ Auto Lite plan creation on user sign-up

### ⚠️ Required in Clerk Dashboard

Complete these steps in your Clerk Dashboard at https://dashboard.clerk.com:

1. **Add Authorized Domains** (Settings > Domains):
   ```
   soulbridge.co.za
   www.soulbridge.co.za
   ```

2. **Configure Paths** (Configure > Paths):
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in redirect: `/dashboard`
   - After sign-up redirect: `/dashboard`
   - Sign-out redirect: `/`

3. **Set Up Webhook** (Webhooks):
   - Endpoint URL: `https://soulbridge.co.za/api/webhooks/clerk`
   - Signing Secret: `whsec_2U13AwdQyOFOVqsNfNx8VR+xlSI2bNfy`
   - Events: `user.created`, `user.updated`, `user.deleted`, `session.created`

4. **Verify Application URLs** (Configure > General):
   - Application URL: `https://soulbridge.co.za`
   - Homepage URL: `https://soulbridge.co.za`

---

## Summary

**All Clerk paths are correctly configured in the SoulBridge application.**

The authentication system is production-ready and will be fully operational once you complete the Clerk Dashboard configuration steps above.

**Key Points:**
- Webhook secret is confirmed and matches production
- All protected routes enforce authentication via middleware
- User sync creates profiles in Supabase automatically
- Lite plan is assigned to new users automatically
- Session tracking is implemented
