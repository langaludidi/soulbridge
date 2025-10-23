-- Add OG image URL field to memorials table
-- This stores the pre-generated Open Graph image URL

ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS og_image_url TEXT;

COMMENT ON COLUMN memorials.og_image_url IS 'Pre-generated Open Graph image URL stored in Supabase Storage';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_memorials_og_image_url ON memorials(og_image_url) WHERE og_image_url IS NOT NULL;
