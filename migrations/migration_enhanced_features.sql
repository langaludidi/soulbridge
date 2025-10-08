-- Migration: Add enhanced features for memorial pages
-- Date: 2025-10-06
-- Description: Adds theme support, favorites section, enhanced timeline, and tribute photos

-- ============================================================================
-- STEP 1: Add new columns to memorials table
-- ============================================================================

ALTER TABLE public.memorials
ADD COLUMN IF NOT EXISTS background_theme TEXT DEFAULT 'nature-roses',
ADD COLUMN IF NOT EXISTS custom_background_url TEXT,
ADD COLUMN IF NOT EXISTS favorite_quote TEXT,
ADD COLUMN IF NOT EXISTS favorite_song TEXT,
ADD COLUMN IF NOT EXISTS hobbies TEXT[],
ADD COLUMN IF NOT EXISTS personal_traits TEXT[];

-- ============================================================================
-- STEP 2: Add photo column to timeline_events
-- ============================================================================

ALTER TABLE public.timeline_events
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- ============================================================================
-- STEP 3: Add photo column to tributes
-- ============================================================================

ALTER TABLE public.tributes
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- ============================================================================
-- STEP 4: Add relationship columns for family tree
-- ============================================================================

ALTER TABLE public.relationships
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS death_date DATE;

-- ============================================================================
-- STEP 5: Create comments for documentation
-- ============================================================================

COMMENT ON COLUMN public.memorials.background_theme IS 'Background theme preset: nature-roses, nature-lilies, sky-clouds, etc.';
COMMENT ON COLUMN public.memorials.custom_background_url IS 'Custom background image uploaded by user';
COMMENT ON COLUMN public.memorials.favorite_quote IS 'Deceased favorite quote or saying';
COMMENT ON COLUMN public.memorials.favorite_song IS 'Deceased favorite song or music';
COMMENT ON COLUMN public.memorials.hobbies IS 'Array of hobbies (e.g., ["Reading", "Gardening"])';
COMMENT ON COLUMN public.memorials.personal_traits IS 'Array of personal traits (e.g., ["Kind", "Generous"])';
COMMENT ON COLUMN public.timeline_events.photo_url IS 'Optional photo for timeline event';
COMMENT ON COLUMN public.tributes.photo_url IS 'Optional photo attachment for tribute';
COMMENT ON COLUMN public.relationships.photo_url IS 'Profile photo for family member';
COMMENT ON COLUMN public.relationships.birth_date IS 'Birth date for family tree visualization';
COMMENT ON COLUMN public.relationships.death_date IS 'Death date if applicable (NULL if living)';
