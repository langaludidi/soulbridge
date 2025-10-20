# 🚀 Phase 2: Clerk Authentication Integration - Setup Guide

## 📋 Overview

**Phase 2 Status:** ✅ Code Complete
**Setup Status:** ⏳ Configuration Required

This guide will walk you through setting up the complete user management system with Clerk and Supabase.

---

## ✅ What's Been Built

### 1. Database Schema ✅
- **File:** `supabase/migrations/001_initial_schema.sql`
- **Tables:** profiles, user_sessions, audit_logs
- **Features:** RLS policies, triggers, views, functions

### 2. TypeScript Types ✅
- **File:** `types/database.ts`
- **Includes:** All database types, API types, webhook types

### 3. Supabase Client ✅
- **File:** `lib/supabase/client.ts`
- **Functions:** Client creation, profile management, audit logging

### 4. Clerk Webhook Handler ✅
- **File:** `app/api/webhooks/clerk/route.ts`
- **Events:** user.created, user.updated, user.deleted, session.created

### 5. Profile API Routes ✅
- **File:** `app/api/profile/route.ts`
- **Endpoints:** GET, PATCH, DELETE

---

## 🎯 Setup Steps

### Step 1: Create Supabase Project (5 minutes)

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Sign in or create account

2. **Create New Project**
   - Click "New Project"
   - **Project Name:** SoulBridge MVP
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
   - Click "Create new project"

3. **Wait for Setup**
   - Takes 1-2 minutes
   - Don't close the browser tab

---

### Step 2: Get Supabase Credentials (2 minutes)

1. **Open Project Settings**
   - Click Settings (⚙️) in sidebar
   - Go to "API" section

2. **Copy These Values:**
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJh... (starts with eyJh)
   service_role key: eyJh... (different, also starts with eyJh)
   ```

3. **Keep These Safe!**
   - You'll need them in Step 4

---

### Step 3: Run Database Migration (3 minutes)

1. **Open SQL Editor**
   - In Supabase Dashboard
   - Click "SQL Editor" in sidebar
   - Click "New Query"

2. **Copy Migration SQL**
   - Open: `supabase/migrations/001_initial_schema.sql`
   - Select ALL content (Cmd+A / Ctrl+A)
   - Copy (Cmd+C / Ctrl+C)

3. **Run Migration**
   - Paste into SQL Editor
   - Click "Run" button (or F5)
   - Should see: "Success. No rows returned"

4. **Verify Tables Created**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
     AND table_type = 'BASE TABLE';
   ```

   Expected output:
   - profiles
   - user_sessions
   - audit_logs

---

### Step 4: Update Environment Variables (2 minutes)

1. **Open .env.local**
   ```bash
   # In your project root
   nano .env.local
   # or use your text editor
   ```

2. **Update Supabase Variables**
   Replace these placeholders:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=eyJh...your_service_role_key
   ```

3. **Keep Webhook Secret for Step 5**
   ```env
   CLERK_WEBHOOK_SECRET=YOUR_CLERK_WEBHOOK_SECRET
   ```

4. **Save and Close**

---

### Step 5: Configure Clerk Webhooks (10 minutes)

#### Option A: Deploy to Vercel (Recommended)

**Why?** Webhooks need a public URL. Localhost doesn't work.

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Phase 2: User management"
   git push
   ```

2. **Deploy to Vercel**
   - Go to: https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - **Add ALL environment variables from .env.local**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Copy your URL: `https://your-app.vercel.app`

#### Option B: Use Ngrok (For Testing)

1. **Install Ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Start Ngrok** (in new terminal)
   ```bash
   ngrok http 3000
   ```

4. **Copy HTTPS URL**
   - Look for: `https://abc123.ngrok.io`

#### Set Up Webhook in Clerk

1. **Go to Clerk Dashboard**
   - Visit: https://dashboard.clerk.com
   - Select your app: "SoulBridge Memorials"

2. **Create Webhook**
   - Click "Webhooks" in sidebar
   - Click "Add Endpoint"

3. **Configure Webhook**
   - **Endpoint URL:**
     - Vercel: `https://your-app.vercel.app/api/webhooks/clerk`
     - Ngrok: `https://abc123.ngrok.io/api/webhooks/clerk`
   - **Description:** Sync to Supabase
   - **Subscribe to events:**
     - ✅ user.created
     - ✅ user.updated
     - ✅ user.deleted
     - ✅ session.created (optional)

4. **Create & Get Secret**
   - Click "Create"
   - Copy the **Signing Secret** (starts with `whsec_`)

5. **Update .env.local**
   ```env
   CLERK_WEBHOOK_SECRET=whsec_your_actual_secret
   ```

6. **Redeploy** (if using Vercel)
   - Go to Vercel dashboard
   - Add CLERK_WEBHOOK_SECRET to environment variables
   - Redeploy

7. **Restart Dev Server** (if using Ngrok)
   ```bash
   # Press Ctrl+C
   npm run dev
   ```

---

### Step 6: Test Everything (5 minutes)

#### Test 1: Create New User

1. **Sign Up**
   - Go to your app
   - Click "Get Started"
   - Sign up with a new email
   - Complete verification

2. **Check Supabase**
   - Go to Supabase Dashboard
   - Click "Table Editor"
   - Select "profiles" table
   - You should see your user! ✅

#### Test 2: Profile API

1. **Open Browser Console** (F12)

2. **Get Your Profile**
   ```javascript
   fetch('/api/profile')
     .then(r => r.json())
     .then(console.log)
   ```

3. **Update Your Profile**
   ```javascript
   fetch('/api/profile', {
     method: 'PATCH',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       city: 'Cape Town',
       province: 'Western Cape',
       country: 'South Africa'
     })
   })
   .then(r => r.json())
   .then(console.log)
   ```

4. **Check Supabase**
   - Refresh profiles table
   - See your updates! ✅

#### Test 3: Verify Webhooks

1. **Go to Clerk Dashboard**
   - Webhooks → Your webhook
   - Click "Logs" tab

2. **Check for Success**
   - Should see events with 200 status ✅
   - Click on event to see details

3. **If Errors (4xx/5xx)**
   - Click on failed event
   - Check error message
   - See troubleshooting below

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
```bash
# Check .env.local has these filled in:
cat .env.local | grep SUPABASE

# Should show actual values, not placeholders
# Restart dev server after adding
```

### Issue: Webhook Returns 400 "Missing svix headers"

**Cause:** URL is wrong or not accessible

**Solution:**
1. Verify webhook URL is correct
2. Test URL in browser (should return 400, not 404)
3. If using Ngrok, check tunnel is running

### Issue: Webhook Returns 401 "Invalid signature"

**Cause:** Wrong CLERK_WEBHOOK_SECRET

**Solution:**
1. Go to Clerk Dashboard → Webhooks
2. Click your webhook
3. Copy "Signing Secret" again
4. Update .env.local
5. Redeploy/restart

### Issue: Profile Not Created in Supabase

**Check:**
1. Webhook successfully reached (200 in logs)?
2. Check Supabase logs for errors
3. RLS policies correct?

**Fix:**
```bash
# Sign out and sign in again to trigger webhook
# Or check Supabase logs for specific error
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Restart TypeScript server
# In VS Code: Cmd+Shift+P → "Restart TS Server"

# Or check types
npm run type-check
```

---

## 📊 Database Schema Reference

### profiles Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| clerk_user_id | TEXT | Clerk user ID (unique) |
| email | TEXT | Email (unique) |
| first_name | TEXT | First name |
| last_name | TEXT | Last name |
| full_name | TEXT | Auto-generated |
| avatar_url | TEXT | Profile picture URL |
| phone_number | TEXT | Phone number |
| date_of_birth | DATE | Date of birth |
| address_line1 | TEXT | Address line 1 |
| address_line2 | TEXT | Address line 2 |
| city | TEXT | City |
| province | TEXT | Province/State |
| postal_code | TEXT | Postal code |
| country | TEXT | Country (default: South Africa) |
| preferred_language | TEXT | Language (default: en) |
| timezone | TEXT | Timezone (default: Africa/Johannesburg) |
| notification_preferences | JSONB | Email, SMS, push preferences |
| role | TEXT | user, creator, admin |
| status | TEXT | active, suspended, deleted |
| metadata | JSONB | Custom fields |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Updated timestamp |
| last_sign_in_at | TIMESTAMPTZ | Last sign in |

---

## 🔐 Security Notes

1. **Service Role Key**
   - NEVER expose in client code
   - Only use in API routes
   - Has full database access

2. **RLS Policies**
   - Enabled on all tables
   - Users can only see their own data
   - Service role bypasses RLS

3. **Webhook Signature**
   - Always verify with Svix
   - Prevents unauthorized requests

4. **Environment Variables**
   - Never commit .env.local to git
   - Use .env.local.example as template

---

## 📁 Files Created

```
soulbridge/
├── .env.local (UPDATED)
├── .env.local.example (NEW)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql (NEW)
├── types/
│   └── database.ts (NEW)
├── lib/
│   └── supabase/
│       └── client.ts (NEW)
└── app/
    └── api/
        ├── profile/
        │   └── route.ts (NEW)
        └── webhooks/
            └── clerk/
                └── route.ts (NEW)
```

---

## ✅ Phase 2 Complete Checklist

- [ ] Supabase project created
- [ ] Database migration run successfully
- [ ] Environment variables updated
- [ ] App deployed OR Ngrok running
- [ ] Clerk webhook configured
- [ ] Webhook secret added to .env.local
- [ ] New user signup creates profile in Supabase
- [ ] Profile API endpoints work
- [ ] Webhook logs show 200 status

---

## 🎉 What's Next?

Once Phase 2 is complete, you'll have:
- ✅ User profiles in your database
- ✅ Automatic sync from Clerk
- ✅ Profile management API
- ✅ Audit logging
- ✅ Session tracking

**Ready for Phase 3:** Memorial Creation System!

---

## 💬 Need Help?

Common commands:
```bash
# Check environment
cat .env.local

# Restart dev server
npm run dev

# Check webhook locally
curl -X POST http://localhost:3000/api/webhooks/clerk

# View Supabase tables
# Use Supabase Dashboard → Table Editor
```

**Questions?** Check the troubleshooting section or ask for help!
