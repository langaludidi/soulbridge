import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import type { UpdateMemorialRequest } from '@/types/memorial';

/**
 * GET /api/memorials/[id]
 * Get a specific memorial by ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    // Get memorial
    const { data: memorial, error } = await supabase
      .from('memorials')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !memorial) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    // Check if user can view this memorial
    const { userId } = await auth();

    // Public memorials can be viewed by anyone
    if (memorial.visibility === 'public' && memorial.status === 'published') {
      // Increment view count
      await supabase
        .from('memorials')
        .update({ view_count: memorial.view_count + 1 })
        .eq('id', id);

      return NextResponse.json({ data: memorial }, { status: 200 });
    }

    // Private/unlisted memorials require authentication
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if user owns this memorial
    if (memorial.profile_id !== profile.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ data: memorial }, { status: 200 });
  } catch (error) {
    console.error('GET /api/memorials/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/memorials/[id]
 * Update a memorial
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: UpdateMemorialRequest = await req.json();
    const supabase = getSupabaseAdmin();

    // Get user's profile
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check ownership
    const { data: existing, error: fetchError } = await supabase
      .from('memorials')
      .select('profile_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    if (existing.profile_id !== profile.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update memorial
    const updates: any = { ...body };

    // Set published_at if changing status to published
    if (body.status === 'published' && existing.profile_id !== profile.id) {
      updates.published_at = new Date().toISOString();
    }

    const { data: memorial, error } = await supabase
      .from('memorials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating memorial:', error);
      return NextResponse.json(
        { error: 'Failed to update memorial' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: memorial,
        message: 'Memorial updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/memorials/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/memorials/[id]
 * Delete a memorial
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check ownership
    const { data: existing, error: fetchError } = await supabase
      .from('memorials')
      .select('profile_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    if (existing.profile_id !== profile.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete memorial (cascade will handle related data)
    const { error } = await supabase
      .from('memorials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting memorial:', error);
      return NextResponse.json(
        { error: 'Failed to delete memorial' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Memorial deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/memorials/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
