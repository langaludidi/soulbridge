import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';

/**
 * POST /api/upload
 * Upload a file to Supabase Storage
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    const audioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
    const allowedTypes = [...imageTypes, ...videoTypes, ...audioTypes];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: Images (JPEG, PNG, GIF, WebP), Videos (MP4, WebM, MOV, AVI), Audio (MP3, WAV, OGG)' },
        { status: 400 }
      );
    }

    // Determine media type
    let mediaType = 'photo';
    if (videoTypes.includes(file.type)) {
      mediaType = 'video';
    } else if (audioTypes.includes(file.type)) {
      mediaType = 'audio';
    }

    // Validate file size based on type
    let maxSize: number;
    let maxSizeText: string;

    if (mediaType === 'video') {
      maxSize = 100 * 1024 * 1024; // 100MB for videos
      maxSizeText = '100MB';
    } else if (mediaType === 'audio') {
      maxSize = 50 * 1024 * 1024; // 50MB for audio
      maxSizeText = '50MB';
    } else {
      maxSize = 10 * 1024 * 1024; // 10MB for images
      maxSizeText = '10MB';
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size for ${mediaType} is ${maxSizeText}.` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('memorial-media')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('memorial-media')
      .getPublicUrl(fileName);

    return NextResponse.json(
      {
        url: urlData.publicUrl,
        path: fileName,
        mediaType,
        message: 'File uploaded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
