import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const memorial_id = searchParams.get('memorial_id');

    if (!memorial_id) {
      return NextResponse.json(
        { error: 'Memorial ID is required' },
        { status: 400 }
      );
    }

    // Get user profile
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Verify ownership
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
        { error: 'You do not have permission to view analytics for this memorial' },
        { status: 403 }
      );
    }

    // Get analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from('memorial_analytics')
      .select('*')
      .eq('memorial_id', memorial_id)
      .order('event_date', { ascending: false });

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics' },
        { status: 500 }
      );
    }

    // Aggregate statistics
    const stats = {
      total_views: 0,
      total_tributes: 0,
      total_candles: 0,
      total_shares: 0,
      total_photos: 0,
      total_guestbook: 0,
      total_qr_scans: 0,
      by_date: {} as Record<string, any>,
      by_type: {} as Record<string, number>,
    };

    analytics?.forEach((entry: any) => {
      // Sum by type
      stats.by_type[entry.event_type] = (stats.by_type[entry.event_type] || 0) + entry.count;

      // Sum totals
      switch (entry.event_type) {
        case 'view':
          stats.total_views += entry.count;
          break;
        case 'tribute':
          stats.total_tributes += entry.count;
          break;
        case 'candle':
          stats.total_candles += entry.count;
          break;
        case 'share':
          stats.total_shares += entry.count;
          break;
        case 'photo':
          stats.total_photos += entry.count;
          break;
        case 'guestbook':
          stats.total_guestbook += entry.count;
          break;
        case 'qr_scan':
          stats.total_qr_scans += entry.count;
          break;
      }

      // Group by date
      if (!stats.by_date[entry.event_date]) {
        stats.by_date[entry.event_date] = {};
      }
      stats.by_date[entry.event_date][entry.event_type] = entry.count;
    });

    return NextResponse.json({
      data: {
        stats,
        raw_analytics: analytics || [],
      },
    });
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Track an analytics event
export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();

    const { memorial_id, event_type, referrer, user_agent, country, city } = body;

    // Validate required fields
    if (!memorial_id || !event_type) {
      return NextResponse.json(
        { error: 'Memorial ID and event type are required' },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Try to increment existing record, or insert new one
    const { data: existing, error: fetchError } = await supabase
      .from('memorial_analytics')
      .select('*')
      .eq('memorial_id', memorial_id)
      .eq('event_type', event_type)
      .eq('event_date', today)
      .single();

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('memorial_analytics')
        .update({
          count: existing.count + 1,
          referrer: referrer || existing.referrer,
          user_agent: user_agent || existing.user_agent,
          country: country || existing.country,
          city: city || existing.city,
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating analytics:', updateError);
        return NextResponse.json(
          { error: 'Failed to update analytics' },
          { status: 500 }
        );
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('memorial_analytics')
        .insert({
          memorial_id,
          event_type,
          event_date: today,
          count: 1,
          referrer: referrer || null,
          user_agent: user_agent || null,
          country: country || null,
          city: city || null,
        });

      if (insertError) {
        console.error('Error inserting analytics:', insertError);
        return NextResponse.json(
          { error: 'Failed to insert analytics' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
