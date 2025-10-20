import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const body = await req.json();
    const { order_of_service_id } = body;

    if (!order_of_service_id) {
      return NextResponse.json(
        { error: 'Order of service ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { data: oos, error: oosError } = await supabase
      .from('order_of_service')
      .select('memorial_id')
      .eq('id', order_of_service_id)
      .single();

    if (oosError || !oos) {
      return NextResponse.json(
        { error: 'Order of service not found' },
        { status: 404 }
      );
    }

    const { data: memorial, error: memorialError } = await supabase
      .from('memorials')
      .select('profile_id')
      .eq('id', oos.memorial_id)
      .single();

    if (memorialError || !memorial || memorial.profile_id !== profile.id) {
      return NextResponse.json(
        { error: 'You do not have permission to generate review links for this order of service' },
        { status: 403 }
      );
    }

    // Generate a unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Update order of service with review token
    const { data: updated, error: updateError } = await supabase
      .from('order_of_service')
      .update({
        review_token: token,
        review_expires_at: expiresAt.toISOString(),
        review_approved: false,
      })
      .eq('id', order_of_service_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error generating review link:', updateError);
      return NextResponse.json(
        { error: 'Failed to generate review link' },
        { status: 500 }
      );
    }

    // Construct the review URL
    const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/memorials/${oos.memorial_id}/order-of-service/review/${token}`;

    return NextResponse.json({
      data: {
        review_token: token,
        review_url: reviewUrl,
        expires_at: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in review link API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();
    const { token, approved_by } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Review token is required' },
        { status: 400 }
      );
    }

    // Find order of service by token
    const { data: oos, error: oosError } = await supabase
      .from('order_of_service')
      .select('*')
      .eq('review_token', token)
      .single();

    if (oosError || !oos) {
      return NextResponse.json(
        { error: 'Invalid or expired review link' },
        { status: 404 }
      );
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(oos.review_expires_at);

    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Review link has expired' },
        { status: 410 }
      );
    }

    // Mark as approved
    const { data: updated, error: updateError } = await supabase
      .from('order_of_service')
      .update({
        review_approved: true,
        review_approved_at: now.toISOString(),
        review_approved_by: approved_by || 'Family Member',
      })
      .eq('id', oos.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error approving review:', updateError);
      return NextResponse.json(
        { error: 'Failed to approve review' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error in review approval API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
