# Supabase Configuration Verification Checklist

**Date:** October 21, 2025
**Project:** SoulBridge Memorial Platform
**Supabase URL:** https://dgozbsamgmgmkygsunnt.supabase.co

---

## ✅ 1. ENVIRONMENT VARIABLES

### Local (.env.local)
```bash
✅ NEXT_PUBLIC_SUPABASE_URL=https://dgozbsamgmgmkygsunnt.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
✅ SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### Vercel Production
Check these are set in Vercel Dashboard → Settings → Environment Variables:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

**How to verify:**
```bash
vercel env ls
```

---

## ✅ 2. DATABASE MIGRATIONS

### Required Migrations (in order):

1. **001_initial_schema.sql** - Profiles, sessions, audit logs
2. **002_memorials_schema.sql** - Memorials, tributes, candles, media
3. **003_timeline_and_sharing.sql** - Timeline events, shares
4. **004_storage_setup.sql** - Storage bucket & policies
5. **005_advanced_features.sql** - Advanced memorial features
6. **006_order_of_service.sql** - Funeral service planning
7. **007_subscription_plans.sql** - User plans & payments
8. **008_plan_usage_triggers.sql** - Memorial count triggers
9. **009_share_tracking_function.sql** - Share count function ⚠️ NEW

### How to Verify Migrations:

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Check what tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected tables:**
- [ ] `profiles`
- [ ] `user_sessions`
- [ ] `audit_logs`
- [ ] `memorials`
- [ ] `memorial_media`
- [ ] `tributes`
- [ ] `virtual_candles`
- [ ] `timeline_events`
- [ ] `memorial_shares`
- [ ] `user_plans`
- [ ] `payment_transactions`
- [ ] `plan_usage`
- [ ] `order_of_service` (optional)

---

## ✅ 3. DATABASE FUNCTIONS

### Required Functions:

Run this to check:
```sql
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

**Expected functions:**
- [ ] `can_create_memorial(UUID)` - Checks if user can create memorial
- [ ] `get_active_user_plan(UUID)` - Gets user's active plan
- [ ] `increment_share_count(UUID)` - Increments share count ⚠️ NEW
- [ ] `generate_memorial_slug(TEXT, TEXT, DATE)` - Generates URL slug
- [ ] `create_default_user_plan()` - Creates Lite plan for new users
- [ ] `activate_plan_after_payment()` - Activates plan after payment
- [ ] `update_memorial_counters()` - Updates tribute/candle counts
- [ ] `update_memorial_count_on_create()` - Increments memorial count
- [ ] `update_memorial_count_on_delete()` - Decrements memorial count

### Missing Function? Run Migration 009

If `increment_share_count` is missing:

```sql
CREATE OR REPLACE FUNCTION increment_share_count(memorial_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE memorials
  SET share_count = COALESCE(share_count, 0) + 1
  WHERE id = memorial_id;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_share_count(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION increment_share_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_share_count(UUID) TO anon;
```

---

## ✅ 4. STORAGE BUCKET

### Check Storage Setup:

1. **Go to:** Supabase Dashboard → Storage
2. **Look for bucket:** `memorial-media`
3. **Settings should be:**
   - ✅ Public bucket: **ON**
   - ✅ File size limit: **100 MB** (or at least 10MB)
   - ✅ Allowed MIME types: `image/*`, `video/*`, `audio/*`

### Check Storage Policies:

```sql
SELECT
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY policyname;
```

**Expected policies:**
- [ ] `Public Access` (SELECT)
- [ ] `Authenticated users can upload` (INSERT)
- [ ] `Service role can upload` (INSERT) ⚠️ CRITICAL
- [ ] `Users can update own files` (UPDATE)
- [ ] `Users can delete own files` (DELETE)

### Missing Policies? Run This:

Use the SQL from `STORAGE_BUCKET_SETUP.sql`:

```sql
-- Drop and recreate all policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Create fresh policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'memorial-media');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memorial-media' AND auth.role() = 'authenticated');

CREATE POLICY "Service role can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memorial-media' AND auth.role() = 'service_role');

CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'memorial-media' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'memorial-media' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));
```

---

## ✅ 5. ROW LEVEL SECURITY (RLS)

### Check RLS is Enabled:

```sql
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**All tables should have `rowsecurity = true`**

### Check Table Policies:

```sql
-- Check memorials policies
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'memorials';

-- Check profiles policies
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'profiles';

-- Check user_plans policies
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'user_plans';
```

**Expected for memorials:**
- Anyone can view published public memorials (SELECT)
- Users can view their own memorials (SELECT)
- Users can create their own memorials (INSERT)
- Users can update their own memorials (UPDATE)
- Users can delete their own memorials (DELETE)
- Service role can do everything (ALL)

---

## ✅ 6. AUTHENTICATION INTEGRATION

### Clerk → Supabase Sync:

Check webhook is configured:
1. **Clerk Dashboard** → Webhooks
2. **Endpoint:** `https://soulbridge.co.za/api/webhooks/clerk`
3. **Events subscribed:**
   - `user.created`
   - `user.updated`
   - `session.created`

### Verify Profile Creation:

```sql
-- Check if your profile exists
SELECT * FROM profiles
WHERE email = 'your-email@example.com';

-- Check if profiles are being created
SELECT
    clerk_user_id,
    email,
    first_name,
    last_name,
    created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;
```

---

## ✅ 7. PLAN SYSTEM

### Check Default Plan Creation:

```sql
-- Check if new users get Lite plan
SELECT
    p.email,
    up.plan_type,
    up.max_memorials,
    up.plan_status,
    up.valid_until
FROM profiles p
LEFT JOIN user_plans up ON p.id = up.profile_id
ORDER BY p.created_at DESC
LIMIT 10;
```

**Every profile should have a user_plan**

### Missing Plans? Check Trigger:

```sql
SELECT
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'profiles';
```

**Expected:** `create_default_plan_trigger` on INSERT

---

## ✅ 8. API ENDPOINTS

### Test These Endpoints Work:

```bash
# Test profile endpoint
curl https://soulbridge.co.za/api/profile

# Test memorials endpoint
curl https://soulbridge.co.za/api/memorials

# Test upload endpoint (requires auth)
# curl -X POST -F "file=@test.jpg" https://soulbridge.co.za/api/upload
```

---

## ✅ 9. DEPLOYMENT CHECKS

### Vercel Environment Variables:

```bash
vercel env ls
```

**Should show:**
- `NEXT_PUBLIC_SUPABASE_URL` (Production, Preview, Development)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production, Preview, Development)
- `SUPABASE_SERVICE_ROLE_KEY` (Production, Preview, Development)
- Plus all Clerk variables

### Build Configuration:

Check `vercel.json` or project settings:
- Node version: 18.x or higher
- Build command: `npm run build`
- Output directory: `.next`

---

## ✅ 10. COMMON ISSUES & FIXES

### Issue: "Profile not found"
**Fix:** User profile not synced from Clerk
```sql
-- Manually create profile
INSERT INTO profiles (clerk_user_id, email, first_name, last_name)
VALUES ('user_xxx', 'email@example.com', 'First', 'Last');
```

### Issue: "Memorial limit reached" (Lite plan has 0/1)
**Fix:** Plan usage not tracking correctly
```sql
-- Reset memorial count
UPDATE plan_usage pu
SET current_memorials_count = (
    SELECT COUNT(*) FROM memorials m
    WHERE m.profile_id = pu.profile_id
)
WHERE pu.plan_id IN (
    SELECT id FROM user_plans WHERE plan_type = 'lite'
);
```

### Issue: "Failed to upload file"
**Fix:** Storage bucket or policies missing (see section 4)

### Issue: Share tracking not working
**Fix:** Missing `increment_share_count` function (see section 3)

---

## 📋 QUICK VERIFICATION SCRIPT

Run this one SQL query to check everything:

```sql
-- Comprehensive health check
SELECT
    'Tables' as category,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'

UNION ALL

SELECT
    'Functions' as category,
    COUNT(*) as count
FROM information_schema.routines
WHERE routine_schema = 'public'

UNION ALL

SELECT
    'Storage Policies' as category,
    COUNT(*) as count
FROM pg_policies
WHERE schemaname = 'storage'

UNION ALL

SELECT
    'Profiles' as category,
    COUNT(*) as count
FROM profiles

UNION ALL

SELECT
    'User Plans' as category,
    COUNT(*) as count
FROM user_plans

UNION ALL

SELECT
    'Memorials' as category,
    COUNT(*) as count
FROM memorials;
```

**Expected Results:**
- Tables: ~12-15
- Functions: ~9
- Storage Policies: ~5
- Profiles: (your user count)
- User Plans: (should match profiles)
- Memorials: (your memorial count)

---

## ✅ DEPLOYMENT READINESS

### Pre-Deploy Checklist:

- [ ] All migrations run in Supabase
- [ ] Storage bucket `memorial-media` exists with correct policies
- [ ] `increment_share_count` function exists
- [ ] Environment variables set in Vercel
- [ ] Clerk webhook configured
- [ ] Test profile creation works
- [ ] Test memorial creation works
- [ ] Test image upload works
- [ ] Test share tracking works

### Post-Deploy Verification:

1. Create test user on production
2. Check profile created in Supabase
3. Check Lite plan assigned
4. Try creating memorial
5. Try uploading image
6. Share memorial on social media
7. Check share count incremented

---

## 🚨 CRITICAL ITEMS FOR YOUR BUILD

Based on your recent issues, ensure these are done:

1. ✅ **Storage Bucket:** Run `STORAGE_BUCKET_SETUP.sql`
2. ✅ **Share Function:** Run `supabase/migrations/009_share_tracking_function.sql`
3. ✅ **Vercel Env Vars:** All Supabase keys in Vercel
4. ✅ **Service Role Policy:** Storage must have service_role INSERT policy

---

**Generated:** October 21, 2025
**Status:** Ready for verification
**Next:** Run verification queries in Supabase SQL Editor
