import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';

/**
 * POST /api/share
 * Track a memorial share
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memorial_id, share_type } = body;

    // Validate required fields
    if (!memorial_id || !share_type) {
      return NextResponse.json(
        { error: 'memorial_id and share_type are required' },
        { status: 400 }
      );
    }

    // Validate share type
    const validShareTypes = ['facebook', 'twitter', 'whatsapp', 'email', 'link', 'qr_code', 'other'];
    if (!validShareTypes.includes(share_type)) {
      return NextResponse.json(
        { error: 'Invalid share_type' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if memorial exists
    const { data: memorial, error: memorialError } = await supabase
      .from('memorials')
      .select('id')
      .eq('id', memorial_id)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    // Get IP address for tracking (optional)
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';

    // Create share record
    const { data: share, error } = await supabase
      .from('memorial_shares')
      .insert({
        memorial_id,
        share_type,
        shared_by_ip: ip,
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording share:', error);
      return NextResponse.json(
        { error: 'Failed to record share' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: share,
        message: 'Share recorded successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/share error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/share
 * Get share statistics for a memorial
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

    // Get share counts by type
    const { data: shares, error } = await supabase
      .from('memorial_shares')
      .select('share_type')
      .eq('memorial_id', memorialId);

    if (error) {
      console.error('Error fetching shares:', error);
      return NextResponse.json(
        { error: 'Failed to fetch shares' },
        { status: 500 }
      );
    }

    // Count by share type
    const shareCounts = shares?.reduce((acc: any, share: any) => {
      acc[share.share_type] = (acc[share.share_type] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    }, {}) || { total: 0 };

    return NextResponse.json(
      {
        data: shareCounts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/share error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
