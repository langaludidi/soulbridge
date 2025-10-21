import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { sendEmail, getTributeEmailTemplate } from '@/lib/sendgrid';

/**
 * GET /api/tributes
 * Get tributes for a memorial
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

    // Get approved tributes (public)
    const { data: tributes, error } = await supabase
      .from('tributes')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tributes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tributes' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: tributes || [],
        count: tributes?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/tributes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tributes
 * Submit a new tribute
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { memorial_id, author_name, author_email, relationship, message } = body;

    // Validate required fields
    if (!memorial_id || !author_name || !message) {
      return NextResponse.json(
        { error: 'memorial_id, author_name, and message are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if memorial exists and allows tributes
    const { data: memorial, error: memorialError } = await supabase
      .from('memorials')
      .select('id, full_name, profile_id, allow_tributes')
      .eq('id', memorial_id)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    if (!memorial.allow_tributes) {
      return NextResponse.json(
        { error: 'Tributes are not allowed for this memorial' },
        { status: 403 }
      );
    }

    // Get user profile if authenticated
    const { userId } = await auth();
    let authorProfileId = null;
    if (userId) {
      const profile = await getProfileByClerkId(userId);
      authorProfileId = profile?.id || null;
    }

    // Create tribute
    const { data: tribute, error } = await supabase
      .from('tributes')
      .insert({
        memorial_id,
        author_profile_id: authorProfileId,
        author_name,
        author_email: author_email || null,
        author_relationship: relationship || null,
        message,
        is_approved: true, // Auto-approve for now (can add moderation later)
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tribute:', error);
      return NextResponse.json(
        { error: 'Failed to create tribute' },
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
        const emailTemplate = getTributeEmailTemplate({
          memorialName: memorial.full_name,
          memorialUrl,
          authorName: author_name,
          relationship: relationship || undefined,
          message,
        });

        await sendEmail({
          to: ownerProfile.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Error sending tribute notification email:', emailError);
    }

    return NextResponse.json(
      {
        data: tribute,
        message: 'Tribute submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/tributes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
