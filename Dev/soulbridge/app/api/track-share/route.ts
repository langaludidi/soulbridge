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

    // Track share analytics event
    const today = new Date().toISOString().split('T')[0];
    const userAgent = request.headers.get('user-agent') || null;
    const referrer = request.headers.get('referer') || `share:${platform}`;

    // Try to increment existing record, or insert new one
    const { data: existing, error: fetchError } = await supabase
      .from('memorial_analytics')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('event_type', 'share')
      .eq('event_date', today)
      .single();

    if (existing) {
      // Update existing record
      await supabase
        .from('memorial_analytics')
        .update({
          count: existing.count + 1,
          referrer: referrer,
          user_agent: userAgent,
        })
        .eq('id', existing.id);
    } else {
      // Insert new record
      await supabase
        .from('memorial_analytics')
        .insert({
          memorial_id: memorialId,
          event_type: 'share',
          event_date: today,
          count: 1,
          referrer: referrer,
          user_agent: userAgent,
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking share:', error);
    return NextResponse.json(
      { error: 'Failed to track share' },
      { status: 500 }
    );
  }
}
