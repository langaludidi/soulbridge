-- ============================================
-- Generate Slugs for Existing Memorials
-- This will create slugs for any memorials missing them
-- ============================================

-- Check which memorials are missing slugs
SELECT 'Memorials without slugs:' as status;
SELECT
    id,
    first_name,
    last_name,
    date_of_death,
    slug
FROM memorials
WHERE slug IS NULL OR slug = '';

-- Generate slugs for memorials that don't have one
UPDATE memorials
SET slug = generate_memorial_slug(first_name, last_name, date_of_death)
WHERE slug IS NULL OR slug = '';

-- Verify all memorials now have slugs
SELECT 'After update - Memorials without slugs:' as status;
SELECT COUNT(*) as count_without_slugs
FROM memorials
WHERE slug IS NULL OR slug = '';

-- Show all memorial slugs
SELECT 'All memorial slugs:' as status;
SELECT
    id,
    first_name,
    last_name,
    slug,
    created_at
FROM memorials
ORDER BY created_at DESC;
