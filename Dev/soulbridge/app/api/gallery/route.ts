import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';

/**
 * GET /api/gallery
 * Get gallery photos for a memorial
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const memorialId = searchParams.get('memorial_id');
    const mediaType = searchParams.get('media_type') || 'photo';

    if (!memorialId) {
      return NextResponse.json(
        { error: 'memorial_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get media items
    const { data: media, error } = await supabase
      .from('memorial_media')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('media_type', mediaType)
      .eq('is_approved', true)
      .order('media_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery:', error);
      return NextResponse.json(
        { error: 'Failed to fetch gallery' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: media || [],
        count: media?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gallery
 * Add a photo/video to gallery (URL-based for now)
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const { memorial_id, media_url, media_type, caption, thumbnail_url } = body;

    // Validate required fields
    if (!memorial_id || !media_url) {
      return NextResponse.json(
        { error: 'memorial_id and media_url are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if memorial exists and allows photos
    const { data: memorial, error: memorialError } = await supabase
      .from('memorials')
      .select('allow_photos, profile_id')
      .eq('id', memorial_id)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    if (!memorial.allow_photos) {
      return NextResponse.json(
        { error: 'Photos are not allowed for this memorial' },
        { status: 403 }
      );
    }

    // Get memorial owner's plan to check upload limits
    const { data: planData } = await supabase
      .rpc('get_active_user_plan', { p_profile_id: memorial.profile_id })
      .single();

    if (!planData) {
      return NextResponse.json(
        { error: 'Unable to verify plan limits' },
        { status: 500 }
      );
    }

    // Check media limits based on type
    const mediaTypeValue = media_type || 'photo';
    let maxAllowed = 0;
    let limitName = '';

    switch (mediaTypeValue) {
      case 'photo':
        maxAllowed = planData.max_photos_per_memorial;
        limitName = 'photos';
        break;
      case 'video':
        maxAllowed = planData.max_videos_per_memorial;
        limitName = 'videos';
        break;
      case 'audio':
        maxAllowed = planData.max_audios_per_memorial;
        limitName = 'audio files';
        break;
      default:
        maxAllowed = planData.max_photos_per_memorial;
        limitName = 'media files';
    }

    // Check if this media type is allowed (0 means not allowed)
    if (maxAllowed === 0) {
      return NextResponse.json(
        {
          error: `${mediaTypeValue.charAt(0).toUpperCase() + mediaTypeValue.slice(1)} uploads not allowed`,
          message: `Your ${planData.plan_type} plan does not include ${limitName} uploads. Please upgrade to add ${limitName} to your memorials.`,
          planType: planData.plan_type,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // Count existing media of this type for this memorial
    const { count, error: countError } = await supabase
      .from('memorial_media')
      .select('*', { count: 'exact', head: true })
      .eq('memorial_id', memorial_id)
      .eq('media_type', mediaTypeValue);

    if (countError) {
      console.error('Error counting media:', countError);
      return NextResponse.json(
        { error: 'Failed to verify media limits' },
        { status: 500 }
      );
    }

    const currentCount = count || 0;

    // Check if limit reached
    if (currentCount >= maxAllowed) {
      return NextResponse.json(
        {
          error: `${mediaTypeValue.charAt(0).toUpperCase() + mediaTypeValue.slice(1)} limit reached`,
          message: `You have reached your ${planData.plan_type} plan limit of ${maxAllowed} ${limitName} per memorial (${currentCount}/${maxAllowed}). Please upgrade your plan to add more ${limitName}.`,
          planType: planData.plan_type,
          currentCount,
          maxAllowed,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // Get user profile if authenticated
    let uploadedBy = null;
    if (userId) {
      const profile = await getProfileByClerkId(userId);
      uploadedBy = profile?.id || null;
    }

    // Create media item
    const { data: media, error } = await supabase
      .from('memorial_media')
      .insert({
        memorial_id,
        uploaded_by: uploadedBy,
        media_type: media_type || 'photo',
        media_url,
        thumbnail_url: thumbnail_url || null,
        caption: caption || null,
        is_approved: true, // Auto-approve for now (can add moderation later)
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to gallery:', error);
      return NextResponse.json(
        { error: 'Failed to add to gallery' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: media,
        message: 'Added to gallery successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
