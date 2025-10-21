-- ============================================
-- Storage Bucket Setup - Safe to Run Multiple Times
-- ============================================

-- Step 1: Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('memorial-media', 'memorial-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 2: Drop and recreate policies to ensure they're correct
-- This is safe - it won't affect existing files

-- Drop existing policies (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Step 3: Create fresh policies

-- Allow anyone to read/download files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'memorial-media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memorial-media' AND auth.role() = 'authenticated');

-- CRITICAL: Allow service role to upload (used by API)
CREATE POLICY "Service role can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memorial-media' AND auth.role() = 'service_role');

-- Allow users to update files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'memorial-media' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

-- Allow users to delete files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'memorial-media' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

-- Done!
SELECT 'Storage bucket "memorial-media" is now set up correctly!' as status;
