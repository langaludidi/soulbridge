-- Add 'audio' to memorial_media type constraint
-- This migration fixes the issue where audio uploads fail due to CHECK constraint

-- First, check if the column is named 'type' or 'media_type' and rename if needed
DO $$
BEGIN
  -- Rename column from 'type' to 'media_type' if it exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'memorial_media'
    AND column_name = 'type'
  ) THEN
    ALTER TABLE memorial_media RENAME COLUMN type TO media_type;
  END IF;
END $$;

-- Drop the old constraint (whether it's named type_check or media_type_check)
ALTER TABLE memorial_media DROP CONSTRAINT IF EXISTS memorial_media_type_check;
ALTER TABLE memorial_media DROP CONSTRAINT IF EXISTS memorial_media_media_type_check;

-- Add new constraint that includes 'audio'
ALTER TABLE memorial_media
  ADD CONSTRAINT memorial_media_media_type_check
  CHECK (media_type IN ('photo', 'video', 'audio', 'document'));

-- Update the index if it was using 'type'
DROP INDEX IF EXISTS idx_memorial_media_type;
CREATE INDEX IF NOT EXISTS idx_memorial_media_media_type ON memorial_media(media_type);

-- Update the comment
COMMENT ON TABLE memorial_media IS 'Photos, videos, audio files, and documents for memorials';
