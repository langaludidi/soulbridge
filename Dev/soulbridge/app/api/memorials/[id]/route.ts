import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { toSlugFromFullName, ensureUniqueSlug } from '@/lib/slug';
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

    // Check ownership and get existing memorial data
    const { data: existing, error: fetchError } = await supabase
      .from('memorials')
      .select('*')
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
    // Sanitize empty strings to null for optional fields (especially dates)
    const sanitizeValue = (value: any) => {
      return (value === '' || value === undefined) ? null : value;
    };

    const updates: any = {};

    // Copy all fields from body, sanitizing empty strings
    Object.keys(body).forEach((key) => {
      updates[key] = sanitizeValue(body[key as keyof UpdateMemorialRequest]);
    });

    // Set published_at if changing status to published
    if (body.status === 'published' && existing.status !== 'published') {
      updates.published_at = new Date().toISOString();
    }

    // Regenerate slug if name changed
    const firstNameChanged = body.first_name && body.first_name !== existing.first_name;
    const lastNameChanged = body.last_name && body.last_name !== existing.last_name;

    if (firstNameChanged || lastNameChanged) {
      const newFirstName = body.first_name || existing.first_name;
      const newLastName = body.last_name || existing.last_name;
      const fullName = `${newFirstName} ${newLastName}`;

      const baseSlug = toSlugFromFullName(fullName);
      const birthYear = body.date_of_birth
        ? new Date(body.date_of_birth).getFullYear()
        : existing.date_of_birth
        ? new Date(existing.date_of_birth).getFullYear()
        : undefined;

      const uniqueSlug = await ensureUniqueSlug(baseSlug, {
        memorialId: id,
        birthYear,
      });

      updates.slug = uniqueSlug;
    }

    const { data: memorial, error } = await supabase
      .from('memorials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating memorial:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Update data:', JSON.stringify(updates, null, 2));
      return NextResponse.json(
        {
          error: 'Failed to update memorial',
          details: error.message || error.hint || 'Unknown database error',
          code: error.code,
        },
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
