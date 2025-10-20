-- Phase 7: File Upload Storage Setup
-- File: 004_storage_setup.sql

-- Create storage bucket for memorial media
INSERT INTO storage.buckets (id, name, public)
VALUES ('memorial-media', 'memorial-media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for memorial-media bucket

-- Allow anyone to read files from public bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'memorial-media');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memorial-media' AND auth.role() = 'authenticated');

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'memorial-media' AND auth.role() = 'authenticated');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'memorial-media' AND auth.role() = 'authenticated');
