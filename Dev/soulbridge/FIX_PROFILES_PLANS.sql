-- ============================================
-- Fix: Profiles Without Plans
-- This will check and fix the profile/plan issue
-- ============================================

-- Step 1: Check if profiles exist
SELECT 'Step 1: Profile Check' as step;
SELECT COUNT(*) as profile_count FROM profiles;

-- Step 2: Check if user_plans exist
SELECT 'Step 2: User Plans Check' as step;
SELECT COUNT(*) as plan_count FROM user_plans;

-- Step 3: Find profiles without plans
SELECT 'Step 3: Profiles Without Plans' as step;
SELECT
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.created_at
FROM profiles p
LEFT JOIN user_plans up ON p.id = up.profile_id
WHERE up.id IS NULL;

-- Step 4: Check if default plan trigger exists
SELECT 'Step 4: Check Trigger' as step;
SELECT
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'profiles'
  AND trigger_name = 'create_default_plan_trigger';

-- ============================================
-- FIX: Create plans for existing profiles
-- ============================================

-- This will create Lite plans for all profiles that don't have one
INSERT INTO user_plans (
    profile_id,
    plan_type,
    plan_status,
    max_memorials,
    max_photos_per_memorial,
    max_videos_per_memorial,
    max_audios_per_memorial,
    available_themes,
    explore_listing_enabled,
    analytics_level,
    support_level,
    hosting_duration_months,
    plan_price,
    valid_from,
    valid_until
)
SELECT
    p.id,
    'lite',
    'active',
    1,
    5,
    0,
    0,
    ARRAY['classic']::TEXT[],
    false,
    'basic',
    'faq',
    3,
    0.00,
    NOW(),
    NOW() + INTERVAL '3 months'
FROM profiles p
LEFT JOIN user_plans up ON p.id = up.profile_id
WHERE up.id IS NULL;

-- Step 5: Create plan_usage entries for new plans
INSERT INTO plan_usage (profile_id, plan_id, current_memorials_count)
SELECT
    up.profile_id,
    up.id,
    COALESCE((
        SELECT COUNT(*)
        FROM memorials m
        WHERE m.profile_id = up.profile_id
    ), 0)
FROM user_plans up
LEFT JOIN plan_usage pu ON pu.plan_id = up.id
WHERE pu.id IS NULL;

-- Step 6: Verify fix
SELECT 'Step 6: Verification' as step;
SELECT
    p.email,
    up.plan_type,
    up.max_memorials,
    up.plan_status,
    pu.current_memorials_count,
    up.valid_until
FROM profiles p
JOIN user_plans up ON p.id = up.profile_id
LEFT JOIN plan_usage pu ON pu.plan_id = up.id
ORDER BY p.created_at DESC;

-- Final count
SELECT 'Final: All profiles now have plans!' as result;
SELECT COUNT(*) as profiles_with_plans
FROM profiles p
JOIN user_plans up ON p.id = up.profile_id;
