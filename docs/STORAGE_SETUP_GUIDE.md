# Supabase Storage Setup Guide

## Issue: "Bucket not found" Error

When uploading files during memorial creation, you need to create storage buckets in Supabase.

## Step-by-Step Setup

### 1. Create Storage Buckets

1. Go to **Supabase Dashboard** → **Storage**
2. Click **New Bucket**
3. Create the following buckets:

#### Bucket 1: memorial-photos
- **Name:** `memorial-photos`
- **Public:** ✅ Yes (checked)
- **Allowed MIME types:** `image/jpeg, image/png, image/jpg, image/webp`
- **Max file size:** 5 MB

#### Bucket 2: memorial-videos
- **Name:** `memorial-videos`
- **Public:** ✅ Yes (checked)
- **Allowed MIME types:** `video/mp4, video/quicktime, video/x-msvideo`
- **Max file size:** 50 MB

#### Bucket 3: memorial-audio
- **Name:** `memorial-audio`
- **Public:** ✅ Yes (checked)
- **Allowed MIME types:** `audio/mpeg, audio/mp3, audio/wav, audio/ogg`
- **Max file size:** 10 MB

### 2. Set Up Storage Policies

For each bucket, add these RLS policies:

#### Policy 1: Allow Public Read Access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'memorial-photos' );
```

#### Policy 2: Allow Authenticated Users to Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memorial-photos'
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Allow Users to Update Their Own Files
```sql
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING ( auth.uid()::text = (storage.foldername(name))[1] )
WITH CHECK ( bucket_id = 'memorial-photos' );
```

#### Policy 4: Allow Users to Delete Their Own Files
```sql
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING ( auth.uid()::text = (storage.foldername(name))[1] );
```

**Repeat these policies for:**
- `memorial-videos`
- `memorial-audio`

### 3. Quick Setup SQL Script

Run this in **SQL Editor** to set up all policies at once:

```sql
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

-- Memorial Audio Bucket Policies
CREATE POLICY "memorial_audio_public_access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'memorial-audio' );

CREATE POLICY "memorial_audio_authenticated_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memorial-audio'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "memorial_audio_user_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'memorial-audio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "memorial_audio_user_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'memorial-audio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Verify Setup

Test that buckets are working:

```sql
-- Check buckets exist
SELECT * FROM storage.buckets;

-- Check policies exist
SELECT * FROM storage.policies;
```

You should see:
- 3 buckets (memorial-photos, memorial-videos, memorial-audio)
- 12 policies (4 per bucket)

### 5. Update Your Code

Make sure your upload code uses the correct bucket names:

```typescript
// For photos
const { data, error } = await supabase.storage
  .from('memorial-photos')
  .upload(`${userId}/${fileName}`, file);

// For videos
const { data, error } = await supabase.storage
  .from('memorial-videos')
  .upload(`${userId}/${fileName}`, file);

// For audio
const { data, error } = await supabase.storage
  .from('memorial-audio')
  .upload(`${userId}/${fileName}`, file);
```

### 6. Get Public URLs

After upload, get the public URL:

```typescript
const { data: { publicUrl } } = supabase.storage
  .from('memorial-photos')
  .getPublicUrl(filePath);
```

## Troubleshooting

### Issue: "Bucket not found"
**Solution:** Make sure you created the buckets with exact names: `memorial-photos`, `memorial-videos`, `memorial-audio`

### Issue: "new row violates row-level security policy"
**Solution:** Make sure you ran the storage policies SQL script

### Issue: Files upload but can't be accessed
**Solution:** Make sure buckets are set to **Public** when creating them

---

**After Setup:**
- ✅ File uploads should work
- ✅ Images/videos/audio will be stored in appropriate buckets
- ✅ Public URLs will be accessible to view memorials
