# 🚀 SoulBridge - Quick Start Checklist

Get your SoulBridge memorial platform up and running in 5 steps!

## ✅ Step 1: Database Setup (5 minutes)

1. Open **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `/supabase/migrations/00_cleanup_and_fresh_install.sql`
4. Paste and click **Run**
5. You should see: "Success. No rows returned"
6. Go to **Settings** → **General** → **Restart Project**
7. Wait 30 seconds for restart

**Verify:** Go to Table Editor, you should see 8 tables: memorials, gallery_items, timeline_events, tributes, virtual_candles, relationships, plans, payments

## ✅ Step 2: Storage Buckets (3 minutes)

1. Go to **Supabase Dashboard** → **Storage**
2. Click **New Bucket** and create:
   - Name: `memorial-photos`, Public: ✅
   - Name: `memorial-videos`, Public: ✅
   - Name: `memorial-audio`, Public: ✅
3. Go to **SQL Editor** → **New Query**
4. Copy storage policies SQL from `STORAGE_SETUP_GUIDE.md` (lines 35-104)
5. Paste and **Run**

**Verify:** Go to Storage, you should see 3 buckets with policies

## ✅ Step 3: Environment Variables (1 minute)

Check your `.env.local` has:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ✅ Step 4: Update Type Definitions (2 minutes)

1. Get your project reference ID:
   - **Supabase Dashboard** → **Settings** → **General**
   - Copy **Reference ID**

2. Run this command (replace `YOUR_PROJECT_REF`):
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/lib/supabase/database.types.ts
   ```

**Skip if:** Command fails (types will work with existing definitions)

## ✅ Step 5: Test Memorial Creation (5 minutes)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Run diagnostic test:**
   - Go to http://localhost:3000/test-db
   - Click "Run Tests"
   - All 4 tests should pass ✅

3. **Create test memorial:**
   - Go to http://localhost:3000/sign-in (sign in first)
   - Go to http://localhost:3000/memorial/create
   - Fill Step 1 (Profile) - enter a name, dates
   - Click "Next" through all 8 steps
   - Click "Publish Memorial"
   - Should redirect to memorial page ✅

4. **Verify memorial page:**
   - Memorial loads without errors ✅
   - Hero section shows ✅
   - Share bar at bottom ✅
   - Floating navigation on side ✅

## 🎉 Success!

If all steps pass, your SoulBridge platform is ready!

## ❌ Troubleshooting

### Database Issues
- **"Column not found"** → Re-run migration, restart Supabase
- **"Infinite recursion"** → Old tables still exist, re-run cleanup

### Storage Issues
- **"Bucket not found"** → Create buckets in Step 2
- **"RLS violation"** → Run storage policies SQL

### Memorial Issues
- **"Memorial not found"** → Code is fixed, restart dev server
- **Empty error `{}`** → Run the migration script

### Still Stuck?
Check detailed guides:
- 📖 `SUPABASE_SETUP_GUIDE.md` - Database setup
- 📖 `STORAGE_SETUP_GUIDE.md` - Storage buckets
- 📖 `TESTING_MEMORIAL_CREATION.md` - Full test suite
- 📖 `FIXES_SUMMARY.md` - What was fixed

## 📋 Reference Commands

```bash
# Start dev server
npm run dev

# Generate types
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/lib/supabase/database.types.ts

# Login to Supabase CLI
npx supabase login
```

## 🔗 Important URLs

- Dev server: http://localhost:3000
- Database test: http://localhost:3000/test-db
- Sign in: http://localhost:3000/sign-in
- Create memorial: http://localhost:3000/memorial/create
- Supabase Dashboard: https://app.supabase.com

---

**Time to Complete:** ~15 minutes
**Last Updated:** 2025-10-05
