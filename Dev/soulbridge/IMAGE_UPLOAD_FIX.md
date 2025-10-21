# Image Upload Fix - Mobile Issue

## Your Issue
> "failed to upload file" error when creating memorial on mobile
> Error appears at "uploading photo..." stage
> No detailed error message shown

## What I Fixed ✅

### 1. Enhanced Upload Error Logging
**File:** `app/api/upload/route.ts`

Now returns detailed errors:
```json
{
  "error": "Failed to upload file",
  "details": "Bucket not found",
  "fileInfo": {
    "name": "photo.jpg",
    "type": "image/jpeg",
    "size": "2.45MB"
  },
  "hint": "Check Supabase storage bucket exists"
}
```

### 2. Client Shows Detailed Errors
**File:** `app/create-memorial/page.tsx`

Error message now shows:
- Exact error from server
- What file failed
- Why it failed

---

## STEP 1: Check Storage Bucket Exists

The upload might be failing because the **memorial-media** storage bucket doesn't exist.

### Check in Supabase:

1. **Open Supabase Dashboard** → https://supabase.com/dashboard
2. **Go to Storage** (left sidebar)
3. **Look for bucket named:** `memorial-media`

### If Bucket DOESN'T Exist:

Run this in Supabase SQL Editor:

```sql
-- Create storage bucket for memorial media
INSERT INTO storage.buckets (id, name, public)
VALUES ('memorial-media', 'memorial-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read files from public bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'memorial-media');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memorial-media' AND auth.role() = 'authenticated');

-- Allow service role to upload (for API uploads)
CREATE POLICY "Service role can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memorial-media' AND auth.role() = 'service_role');

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'memorial-media');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'memorial-media');
```

### If Bucket EXISTS:

1. Click on `memorial-media` bucket
2. Check **Settings** tab
3. Verify:
   - ✅ Public bucket: **ON**
   - ✅ File size limit: At least **10MB** for images
   - ✅ Allowed MIME types: Includes `image/*`

---

## STEP 2: Try Upload Again

Now try creating a memorial with an image:

1. **Refresh your browser** to load the updated code
2. **Go to** `/create-memorial`
3. **Fill the form** and add an image
4. **Click "Create Memorial"**

---

## STEP 3: Check Error Details

If it still fails, you'll now see MUCH more detail:

### In Browser Console (F12):
```
Profile image upload error: {
  error: "Failed to upload file",
  details: "The actual error message",
  fileInfo: { name: "...", type: "...", size: "..." }
}
```

### In Dev Server Logs:
```
Storage upload error: <full error>
Error details: <JSON error>
File details: { name: "...", type: "...", size: "..." }
```

---

## Common Upload Errors & Solutions

### Error: "Bucket not found"
**Cause:** `memorial-media` storage bucket doesn't exist

**Fix:** Run the SQL above to create it

---

### Error: "new row violates row-level security policy"
**Cause:** Storage policies don't allow upload

**Fix:**
1. Check policies in Supabase → Storage → memorial-media → Policies
2. Make sure there's a policy for INSERT with service_role
3. Run the SQL above to add missing policy

---

### Error: "File size exceeds maximum allowed"
**Cause:** Image too large (over 10MB)

**Fix:**
1. Compress your image
2. Use a smaller image
3. Or increase limit in Supabase Storage settings

---

### Error: "Invalid file type"
**Cause:** File is not an allowed image format

**Fix:**
- Use JPEG, PNG, GIF, or WebP only
- Check file extension matches actual type
- Don't rename .heic to .jpg (convert it properly)

---

### Error on Mobile: "Network request failed"
**Cause:** Mobile network timeout or connection issue

**Fix:**
1. Switch to WiFi (more stable)
2. Use smaller images on mobile
3. Check phone has good signal
4. Try again - mobile networks can be flaky

---

### Error on Mobile: "Unable to access camera roll"
**Cause:** App doesn't have permission to photos

**Fix:**
1. Go to phone Settings → Safari (or Chrome) → Photos
2. Enable "All Photos" access
3. Refresh browser and try again

---

## Mobile-Specific Issues

Since you're on mobile, here are extra tips:

### 1. Image Size
Mobile photos can be HUGE (10-20MB). Compress them:
- iOS: Use built-in "Reduce File Size" when sharing
- Android: Use Google Photos to save smaller version

### 2. HEIC Format (iPhone)
iPhones use HEIC format which might not work:
- Go to Settings → Camera → Formats
- Choose "Most Compatible" instead of "High Efficiency"
- Take new photo or convert existing ones

### 3. Network Issues
Mobile networks are unreliable:
- Use WiFi when uploading
- Wait for good signal
- Don't navigate away during upload

### 4. Browser Permissions
Safari/Chrome need permission:
- Allow photo access when prompted
- Check browser settings if blocked
- Try different browser (Safari vs Chrome)

---

## Test Checklist

Try uploading with these test cases:

1. **Small test image** (under 1MB):
   - Take screenshot on phone (usually small)
   - Try uploading that first

2. **JPEG image**:
   - Make sure it's .jpg or .jpeg
   - Not .heic or .webp

3. **From camera roll**:
   - Select existing photo
   - Not taking new photo (eliminates camera permission issues)

4. **On WiFi**:
   - Connect to WiFi
   - Not mobile data

---

## What to Send Me If Still Broken

If it STILL doesn't work after all this:

### 1. Screenshot of Error
The error message should now be detailed. Send screenshot.

### 2. File Info
What file are you trying to upload?
- Format (JPEG, PNG, etc.)
- Size (in MB)
- Source (camera, gallery, downloaded, etc.)

### 3. Browser Console
1. Open browser console (if possible on mobile)
2. Try upload
3. Screenshot any red errors

### 4. Server Logs
If you have access to dev server, send the error logs.

---

## Summary of Changes

```
✅ app/api/upload/route.ts - Detailed error logging
✅ app/create-memorial/page.tsx - Shows specific errors
✅ IMAGE_UPLOAD_FIX.md - This troubleshooting guide
```

**Next Step:** Check if memorial-media bucket exists in Supabase Storage!

---

**Generated:** October 21, 2025
**Issue:** Mobile image upload failing
**Status:** ✅ Better error logging added, ⚠️ Need to verify bucket exists
