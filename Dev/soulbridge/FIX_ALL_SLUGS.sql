-- FIX ALL MEMORIAL SLUGS
-- This SQL script fixes all broken slugs in the database
-- Run this in Supabase SQL Editor

-- Function to generate proper slug from name
CREATE OR REPLACE FUNCTION fix_memorial_slug(
  p_first_name TEXT,
  p_last_name TEXT,
  p_birth_year INTEGER
) RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Normalize and create base slug
  -- Remove honorifics, normalize Unicode, lowercase, replace non-alphanumeric
  base_slug := regexp_replace(
    lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            unaccent(trim(p_first_name || ' ' || p_last_name)),
            '^(mr|mrs|ms|miss|dr|prof)\.?\s+', '', 'i'
          ),
          '[^a-z0-9\s\-'']+', '-', 'g'
        ),
        '''', '-', 'g'
      )
    ),
    '\s+', '-', 'g'
  );

  -- Clean up multiple hyphens and trim
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  -- Start with base slug
  final_slug := base_slug;

  -- Check for uniqueness and add birth year or number if needed
  WHILE EXISTS (SELECT 1 FROM memorials WHERE slug = final_slug) LOOP
    IF counter = 1 AND p_birth_year IS NOT NULL THEN
      -- Try with birth year first
      final_slug := base_slug || '-' || p_birth_year::TEXT;
    ELSE
      -- Add incrementing number
      final_slug := base_slug || '-' || counter::TEXT;
    END IF;
    counter := counter + 1;

    -- Safety check to prevent infinite loop
    IF counter > 1000 THEN
      final_slug := base_slug || '-' || gen_random_uuid()::TEXT;
      EXIT;
    END IF;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Create temporary table to store slug mappings
CREATE TEMP TABLE slug_updates AS
SELECT
  id,
  slug AS old_slug,
  fix_memorial_slug(
    first_name,
    last_name,
    EXTRACT(YEAR FROM date_of_birth)::INTEGER
  ) AS new_slug,
  first_name,
  last_name
FROM memorials
WHERE slug IS NOT NULL;

-- Show what will be changed
SELECT
  old_slug,
  new_slug,
  first_name || ' ' || last_name AS full_name,
  CASE
    WHEN old_slug = new_slug THEN '✅ Already correct'
    ELSE '🔧 Will be fixed'
  END as status
FROM slug_updates
ORDER BY status DESC, old_slug;

-- Update the slugs
UPDATE memorials m
SET slug = su.new_slug
FROM slug_updates su
WHERE m.id = su.id
  AND m.slug != su.new_slug;

-- Show results
SELECT
  COUNT(*) FILTER (WHERE old_slug != new_slug) as fixed_count,
  COUNT(*) FILTER (WHERE old_slug = new_slug) as already_correct_count,
  COUNT(*) as total_count
FROM slug_updates;

-- Clean up
DROP FUNCTION IF EXISTS fix_memorial_slug(TEXT, TEXT, INTEGER);
