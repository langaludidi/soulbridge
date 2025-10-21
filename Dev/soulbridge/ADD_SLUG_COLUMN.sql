-- ============================================
-- Add Slug Column and Functions to Memorials
-- Safe to run multiple times
-- ============================================

-- Step 1: Add slug column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'memorials' AND column_name = 'slug'
    ) THEN
        ALTER TABLE memorials ADD COLUMN slug TEXT UNIQUE;
        CREATE INDEX idx_memorials_slug ON memorials(slug);
    END IF;
END $$;

-- Step 2: Create slug generation function
CREATE OR REPLACE FUNCTION generate_memorial_slug(fname TEXT, lname TEXT, dod DATE)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Create base slug: firstname-lastname-year
    base_slug := lower(
        regexp_replace(
            fname || '-' || lname || '-' || EXTRACT(YEAR FROM dod)::TEXT,
            '[^a-z0-9-]', '-', 'g'
        )
    );
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(both '-' from base_slug);

    final_slug := base_slug;

    -- Check for uniqueness, add counter if needed
    WHILE EXISTS (SELECT 1 FROM memorials WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter::TEXT;
    END LOOP;

    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create trigger function
CREATE OR REPLACE FUNCTION set_memorial_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_memorial_slug(NEW.first_name, NEW.last_name, NEW.date_of_death);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger (drop first if exists)
DROP TRIGGER IF EXISTS memorial_slug_trigger ON memorials;
CREATE TRIGGER memorial_slug_trigger
    BEFORE INSERT ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION set_memorial_slug();

-- Step 5: Generate slugs for existing memorials
UPDATE memorials
SET slug = generate_memorial_slug(first_name, last_name, date_of_death)
WHERE slug IS NULL OR slug = '';

-- Step 6: Verify results
SELECT 'Setup complete! Here are your memorial slugs:' as status;
SELECT
    id,
    first_name,
    last_name,
    date_of_death,
    slug,
    created_at
FROM memorials
ORDER BY created_at DESC;
