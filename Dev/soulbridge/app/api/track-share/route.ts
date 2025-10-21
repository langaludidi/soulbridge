import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { memorialId, platform } = await request.json();

    if (!memorialId || !platform) {
      return NextResponse.json(
        { error: 'Memorial ID and platform are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Increment share count on memorial
    const { error: updateError } = await supabase.rpc('increment_share_count', {
      memorial_id: memorialId,
    });

    if (updateError) {
      console.error('Error incrementing share count:', updateError);
    }

    // Log the share event (if you have a share_events table)
    // const { error: insertError } = await supabase.from('share_events').insert({
    //   memorial_id: memorialId,
    //   platform,
    //   timestamp: new Date().toISOString(),
    //   user_ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    //   user_agent: request.headers.get('user-agent'),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking share:', error);
    return NextResponse.json(
      { error: 'Failed to track share' },
      { status: 500 }
    );
  }
}
