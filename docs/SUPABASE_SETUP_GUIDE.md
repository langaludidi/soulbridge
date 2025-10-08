# SoulBridge - Complete Supabase Database Setup Guide

This guide will help you completely reset and set up your Supabase database for the SoulBridge application, removing any conflicts from previous builds (like Figma Make).

## ⚠️ Important Warning

**This process will DELETE all existing data in these tables:**
- memorials
- gallery_items
- timeline_events
- tributes
- virtual_candles
- relationships
- plans
- payments

**Your `profiles` and `auth.users` tables will NOT be affected**, so user accounts will remain intact.

## Step-by-Step Setup

### Step 1: Backup Current Data (Optional)

If you have any important data, export it first:

1. Go to **Supabase Dashboard** → **Table Editor**
2. For each table you want to backup, click **Export** → **CSV**

### Step 2: Run the Clean Install Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `/supabase/migrations/00_cleanup_and_fresh_install.sql`
4. Paste into the SQL Editor
5. Click **Run** or press `Cmd/Ctrl + Enter`

You should see: **Success. No rows returned**

### Step 3: Verify Tables Were Created

Run this query to check all tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'memorials',
    'gallery_items',
    'timeline_events',
    'tributes',
    'virtual_candles',
    'relationships',
    'plans',
    'payments'
  )
ORDER BY table_name;
```

You should see all 8 tables listed.

### Step 4: Verify RLS Policies

Run this to check RLS policies for memorials:

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'memorials';
```

You should see 4 policies:
- Anyone can view published public memorials (SELECT)
- Users can create their own memorials (INSERT)
- Users can update their own memorials (UPDATE)
- Users can delete their own memorials (DELETE)

### Step 5: Verify Default Plans

```sql
SELECT name, price_monthly, price_annual, price_lifetime, max_memorials
FROM public.plans
ORDER BY price_monthly NULLS FIRST;
```

You should see 4 plans: Free, Essential, Family, Lifetime

### Step 6: Test Memorial Creation

1. Go to http://localhost:3002/test-db
2. Click **Run Tests**
3. All tests should pass ✅

### Step 7: Update Type Definitions (If Needed)

If you see TypeScript errors, regenerate the types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID (found in Project Settings).

## Troubleshooting

### Issue: "infinite recursion detected in policy"

**Solution:** The RLS policies in the migration script are fixed. Make sure you ran the complete migration.

### Issue: "Could not find column X in schema cache"

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Click **Restart** next to "Restart server"
3. Wait 30 seconds
4. Try again

### Issue: Memorial creation still fails

**Solution:**
1. Check if the API route exists: `/src/app/api/memorial/create/route.ts`
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
3. Check server logs in terminal for detailed errors

## Database Schema Overview

### Tables Created

1. **memorials** - Core memorial pages
2. **gallery_items** - Photos, videos, audio
3. **timeline_events** - Life events timeline
4. **tributes** - Guestbook messages
5. **virtual_candles** - Virtual candle lighting
6. **relationships** - Family & friends
7. **plans** - Subscription tiers
8. **payments** - Payment records

### Key Relationships

```
profiles (existing from auth)
  ↓
memorials
  ↓
gallery_items, timeline_events, tributes, virtual_candles, relationships
```

## Environment Variables

Make sure your `.env.local` has:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## After Setup

Once setup is complete:

1. ✅ Memorial creation should work
2. ✅ All memorial features should be functional
3. ✅ RLS policies properly protect data
4. ✅ No more "column not found" errors

## Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Check the terminal for server-side errors
3. Verify all environment variables are set
4. Make sure you're signed in when testing

---

**Last Updated:** 2025-10-05
**Migration File:** `/supabase/migrations/00_cleanup_and_fresh_install.sql`
