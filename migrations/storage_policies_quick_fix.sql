-- ============================================================================
-- Storage Policies for memorial-photos and memorial-videos
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Memorial Photos Bucket Policies
CREATE POLICY "memorial_photos_public_access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'memorial-photos' );

CREATE POLICY "memorial_photos_authenticated_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memorial-photos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "memorial_photos_user_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'memorial-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "memorial_photos_user_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'memorial-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Memorial Videos Bucket Policies
CREATE POLICY "memorial_videos_public_access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'memorial-videos' );

CREATE POLICY "memorial_videos_authenticated_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memorial-videos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "memorial_videos_user_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'memorial-videos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "memorial_videos_user_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'memorial-videos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- Verification
-- ============================================================================

-- Policies created successfully!
-- To verify:
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click on each bucket (memorial-photos, memorial-videos)
-- 3. Go to Policies tab
-- 4. You should see 4 policies for each bucket
