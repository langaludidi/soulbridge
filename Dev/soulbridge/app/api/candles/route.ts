import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { sendEmail, getCandleEmailTemplate } from '@/lib/sendgrid';

/**
 * GET /api/candles
 * Get virtual candles for a memorial
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

    // Get active candles
    const { data: candles, error } = await supabase
      .from('virtual_candles')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching candles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch candles' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: candles || [],
        count: candles?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/candles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/candles
 * Light a virtual candle
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memorial_id, lit_by_name, message, candle_type } = body;

    // Validate required fields
    if (!memorial_id || !lit_by_name) {
      return NextResponse.json(
        { error: 'memorial_id and lit_by_name are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if memorial exists and allows candles
    const { data: memorial, error: memorialError } = await supabase
      .from('memorials')
      .select('id, full_name, profile_id, allow_candles')
      .eq('id', memorial_id)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    if (!memorial.allow_candles) {
      return NextResponse.json(
        { error: 'Candles are not allowed for this memorial' },
        { status: 403 }
      );
    }

    // Get user profile if authenticated
    const { userId } = await auth();
    let litByProfileId = null;
    if (userId) {
      const profile = await getProfileByClerkId(userId);
      litByProfileId = profile?.id || null;
    }

    // Create candle (expires in 7 days by default)
    const { data: candle, error } = await supabase
      .from('virtual_candles')
      .insert({
        memorial_id,
        lit_by_profile_id: litByProfileId,
        lit_by_name,
        message: message || null,
        candle_type: candle_type || 'white',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error lighting candle:', error);
      return NextResponse.json(
        { error: 'Failed to light candle' },
        { status: 500 }
      );
    }

    // Send email notification to memorial owner
    try {
      // Get memorial owner's email from profile
      const { data: ownerProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', memorial.profile_id)
        .single();

      if (ownerProfile?.email) {
        const memorialUrl = `${process.env.NEXT_PUBLIC_APP_URL}/memorials/${memorial_id}`;
        const emailTemplate = getCandleEmailTemplate({
          memorialName: memorial.full_name,
          memorialUrl,
          lighterName: lit_by_name,
          candleType: candle_type || 'remembrance',
          dedication: message || undefined,
        });

        await sendEmail({
          to: ownerProfile.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Error sending candle notification email:', emailError);
    }

    return NextResponse.json(
      {
        data: candle,
        message: 'Candle lit successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/candles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
