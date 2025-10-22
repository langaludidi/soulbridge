-- FIX ALL MEMORIAL SLUGS
-- This SQL script fixes all broken slugs in the database
-- Run this in Supabase SQL Editor

-- Enable unaccent extension (required for Unicode normalization)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Function to generate proper slug from name
CREATE OR REPLACE FUNCTION fix_memorial_slug(
  p_memorial_id UUID,
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
  -- Exclude the current memorial from the uniqueness check
  WHILE EXISTS (
    SELECT 1 FROM memorials
    WHERE slug = final_slug
    AND id != p_memorial_id
  ) LOOP
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

-- Main function to update all slugs one by one
DO $$
DECLARE
  memorial_record RECORD;
  new_slug TEXT;
  fixed_count INTEGER := 0;
  already_correct_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting slug repair process...';
  RAISE NOTICE '';

  -- Loop through each memorial and fix slug one at a time
  FOR memorial_record IN
    SELECT id, slug, first_name, last_name, date_of_birth
    FROM memorials
    WHERE slug IS NOT NULL
    ORDER BY created_at
  LOOP
    -- Generate new slug
    new_slug := fix_memorial_slug(
      memorial_record.id,
      memorial_record.first_name,
      memorial_record.last_name,
      EXTRACT(YEAR FROM memorial_record.date_of_birth)::INTEGER
    );

    -- Check if slug needs updating
    IF memorial_record.slug != new_slug THEN
      -- Update the slug
      UPDATE memorials
      SET slug = new_slug
      WHERE id = memorial_record.id;

      RAISE NOTICE '🔧 Fixed: % → % (%)',
        memorial_record.slug,
        new_slug,
        memorial_record.first_name || ' ' || memorial_record.last_name;

      fixed_count := fixed_count + 1;
    ELSE
      already_correct_count := already_correct_count + 1;
    END IF;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Repair complete!';
  RAISE NOTICE 'Fixed: %', fixed_count;
  RAISE NOTICE 'Already correct: %', already_correct_count;
  RAISE NOTICE 'Total: %', fixed_count + already_correct_count;
END $$;

-- Clean up
DROP FUNCTION IF EXISTS fix_memorial_slug(UUID, TEXT, TEXT, INTEGER);
