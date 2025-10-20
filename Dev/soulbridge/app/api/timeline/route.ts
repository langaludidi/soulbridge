import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';

/**
 * GET /api/timeline
 * Get timeline events for a memorial
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const memorialId = searchParams.get('memorial_id');

    if (!memorialId) {
      return NextResponse.json(
        { error: 'memorial_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get timeline events
    const { data: events, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('memorial_id', memorialId)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching timeline events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch timeline events' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: events || [],
        count: events?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/timeline error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/timeline
 * Create a timeline event
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

    const body = await req.json();
    const { memorial_id, title, description, event_date, event_type, image_url } = body;

    // Validate required fields
    if (!memorial_id || !title || !event_date) {
      return NextResponse.json(
        { error: 'memorial_id, title, and event_date are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const profile = await getProfileByClerkId(userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if user owns this memorial
    const { data: memorial, error: memorialError } = await supabase
      .from('memorials')
      .select('profile_id')
      .eq('id', memorial_id)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    if (memorial.profile_id !== profile.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Create timeline event
    const { data: event, error } = await supabase
      .from('timeline_events')
      .insert({
        memorial_id,
        title,
        description: description || null,
        event_date,
        event_type: event_type || 'life_event',
        image_url: image_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating timeline event:', error);
      return NextResponse.json(
        { error: 'Failed to create timeline event' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: event,
        message: 'Timeline event created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/timeline error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
