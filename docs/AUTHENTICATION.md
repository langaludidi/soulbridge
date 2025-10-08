# Authentication System Documentation

## Overview
SoulBridge uses Supabase Auth for a complete authentication system with email/password and OAuth (Google) support.

## Authentication Flows

### 1. **Sign Up Flow**
- **Route:** `/sign-up`
- **Methods:** Email/Password, Google OAuth
- **Features:**
  - Password validation (min 8 characters)
  - Password confirmation
  - Full name capture
  - Plan parameter support (`/sign-up?plan=essential`)
  - Terms & Privacy Policy agreement
  - Email verification sent automatically

**Email/Password:**
```typescript
await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: { full_name: formData.fullName }
  }
});
```

**Google OAuth:**
```typescript
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`
  }
});
```

### 2. **Sign In Flow**
- **Route:** `/sign-in`
- **Methods:** Email/Password, Google OAuth
- **Features:**
  - Redirect parameter support (`/sign-in?redirect=/pricing`)
  - Error handling for failed auth
  - "Forgot Password" link
  - Auto-redirect to dashboard on success

### 3. **Password Reset Flow**

**Request Reset:**
- **Route:** `/reset-password`
- Sends reset email with magic link
- Email includes link to `/auth/update-password`

**Update Password:**
- **Route:** `/auth/update-password`
- Validates session from reset link
- Updates password with confirmation
- Auto-redirects to dashboard

### 4. **OAuth Callback**
- **Route:** `/auth/callback`
- Exchanges OAuth code for session
- Supports `next` parameter for redirect
- Error handling with redirect to sign-in

### 5. **Email Confirmation**
- **Route:** `/auth/confirm`
- Confirms email verification
- Shows loading/success/error states
- Auto-redirects to dashboard

### 6. **Sign Out**
- **API Route:** `POST /api/auth/signout`
- **UI:** Navbar dropdown & mobile menu
- Clears Supabase session
- Redirects to homepage

## Middleware Protection

**File:** `/src/middleware.ts`

**Protected Routes:**
- `/dashboard/*`
- `/memorial/create/*`
- `/memorial/edit/*`

**Auth Routes (redirect if logged in):**
- `/sign-in`
- `/sign-up`

**Behavior:**
- Unauthenticated users → Redirect to `/sign-in?redirect={path}`
- Authenticated users on auth pages → Redirect to `/dashboard`

## Profile Auto-Creation

**Database Trigger:** `on_auth_user_created`

When a user signs up (email or OAuth), a profile is automatically created:

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Profile includes:
- `id` - User UUID from auth.users
- `email` - User email
- `full_name` - From metadata
- `plan` - Defaults to 'free'
- `subscription_status` - Defaults to 'active'

## User Session Management

### Client-Side
```typescript
// Get current session
const { data: { session } } = await supabase.auth.getSession();

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state changes
});
```

### Server-Side
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createRouteHandlerClient({ cookies });
const { data: { session } } = await supabase.auth.getSession();
```

## Navigation Integration

The navbar (`/src/components/site/Navbar.tsx`) shows different UI based on auth state:

**Unauthenticated:**
- Sign In button
- Create Memorial button

**Authenticated:**
- Dashboard button (with User icon)
- Sign Out button (with LogOut icon)

## Security Features

1. **Row Level Security (RLS):** All tables have RLS enabled
2. **Middleware Protection:** Routes protected at edge
3. **Session Validation:** Server-side session checks
4. **PKCE Flow:** OAuth uses secure PKCE flow
5. **Email Verification:** Optional email confirmation
6. **Password Requirements:** Minimum 8 characters

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## OAuth Setup (Google)

1. **Configure in Supabase Dashboard:**
   - Go to Authentication > Providers
   - Enable Google provider
   - Add OAuth Client ID & Secret

2. **Authorized redirect URIs:**
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

3. **Authorized domains:**
   - Add your production domain
   - Add localhost for development

## Error Handling

All auth flows include:
- Toast notifications for success/error
- User-friendly error messages
- Automatic retry mechanisms
- Fallback redirects

## Testing Checklist

- [ ] Email/password sign up
- [ ] Email/password sign in
- [ ] Google OAuth sign up
- [ ] Google OAuth sign in
- [ ] Password reset request
- [ ] Password update via reset link
- [ ] Email confirmation (if enabled)
- [ ] Protected route access (unauthenticated)
- [ ] Auth route access (authenticated)
- [ ] Sign out functionality
- [ ] Session persistence across page reloads
- [ ] Mobile menu auth UI

## Common Issues & Solutions

### Issue: OAuth redirect loop
**Solution:** Check callback URL matches Supabase configuration

### Issue: Profile not created
**Solution:** Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`

### Issue: Middleware redirect loop
**Solution:** Check protected/auth paths don't overlap

### Issue: Session not persisting
**Solution:** Ensure cookies are enabled and HTTPS in production
