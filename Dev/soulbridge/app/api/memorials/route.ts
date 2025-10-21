import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { toSlugFromFullName, ensureUniqueSlug } from '@/lib/slug';
import type { CreateMemorialRequest } from '@/types/memorial';

/**
 * GET /api/memorials
 * Get list of user's memorials
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get user's profile
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get user's memorials
    const { data: memorials, error, count } = await supabase
      .from('memorials')
      .select('*', { count: 'exact' })
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching memorials:', error);
      return NextResponse.json(
        { error: 'Failed to fetch memorials' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: memorials || [],
        count: count || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/memorials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/memorials
 * Create a new memorial
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

    const body: CreateMemorialRequest = await req.json();

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.date_of_birth || !body.date_of_death) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, date_of_birth, date_of_death' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get user's profile
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if user can create more memorials based on their plan
    const { data: canCreate, error: planCheckError } = await supabase
      .rpc('can_create_memorial', { p_profile_id: profile.id });

    if (planCheckError) {
      console.error('Error checking plan limits:', planCheckError);
      return NextResponse.json(
        { error: 'Failed to verify plan limits' },
        { status: 500 }
      );
    }

    if (!canCreate) {
      // Get current plan details for error message
      const { data: planData } = await supabase
        .rpc('get_active_user_plan', { p_profile_id: profile.id })
        .single();

      const planName = planData?.plan_type || 'current';
      const currentCount = planData?.current_memorials_count || 0;
      const maxMemorials = planData?.max_memorials || 0;

      return NextResponse.json(
        {
          error: 'Memorial limit reached',
          message: `You have reached your ${planName} plan limit of ${maxMemorials} memorial${maxMemorials !== 1 ? 's' : ''} (${currentCount}/${maxMemorials}). Please upgrade your plan to create more memorials.`,
          planType: planName,
          currentCount,
          maxMemorials,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // Generate unique slug from full name
    const fullName = `${body.first_name} ${body.last_name}`;
    const baseSlug = toSlugFromFullName(fullName);
    const birthYear = body.date_of_birth ? new Date(body.date_of_birth).getFullYear() : undefined;
    const uniqueSlug = await ensureUniqueSlug(baseSlug, { birthYear });

    // Create memorial
    const { data: memorial, error } = await supabase
      .from('memorials')
      .insert({
        profile_id: profile.id,
        first_name: body.first_name,
        last_name: body.last_name,
        maiden_name: body.maiden_name || null,
        nickname: body.nickname || null,
        date_of_birth: body.date_of_birth,
        date_of_death: body.date_of_death,
        place_of_birth: body.place_of_birth || null,
        place_of_death: body.place_of_death || null,
        funeral_date: body.funeral_date || null,
        funeral_time: body.funeral_time || null,
        funeral_location: body.funeral_location || null,
        funeral_address: body.funeral_address || null,
        burial_location: body.burial_location || null,
        biography: body.biography || null,
        obituary: body.obituary || null,
        profile_image_url: body.profile_image_url || null,
        cover_image_url: body.cover_image_url || null,
        visibility: body.visibility || 'public',
        allow_tributes: body.allow_tributes !== undefined ? body.allow_tributes : true,
        allow_candles: body.allow_candles !== undefined ? body.allow_candles : true,
        allow_photos: body.allow_photos !== undefined ? body.allow_photos : true,
        status: body.status || 'published',
        published_at: body.status === 'published' ? new Date().toISOString() : null,
        slug: uniqueSlug, // Use our robust slug generation
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating memorial:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Request body:', JSON.stringify(body, null, 2));
      return NextResponse.json(
        {
          error: 'Failed to create memorial',
          details: error.message || error.hint || 'Unknown database error',
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: memorial,
        message: 'Memorial created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/memorials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
