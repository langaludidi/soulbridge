import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { toSlugFromFullName, ensureUniqueSlug } from '@/lib/slug';
import type { UpdateMemorialRequest } from '@/types/memorial';
import { canViewMemorial, isDiscoverableMemorial } from '@/lib/memorials/access';
import { validateLifeDates } from '@/lib/memorials/validation';

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
    const { data: memorial, error } = await supabase
      .from('memorials').select('*').eq('id', id).single();
    if (error || !memorial) {
      return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
    }

    const { userId } = await auth();
    const profile = userId ? await getProfileByClerkId(userId) : null;
    if (!canViewMemorial(memorial, profile?.id)) {
      return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
    }

    return NextResponse.json({ data: memorial }, {
      status: 200,
      headers: !isDiscoverableMemorial(memorial) ? { 'X-Robots-Tag': 'noindex, nofollow' } : {},
    });
  } catch (error) {
    console.error('GET /api/memorials/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

    // Never let a client overwrite profile_id, IDs, slugs, stats or audit columns
    // while this handler uses an elevated database client.
    const editable = new Set([
      'first_name', 'last_name', 'maiden_name', 'nickname',
      'date_of_birth', 'date_of_death', 'place_of_birth', 'place_of_death',
      'funeral_date', 'funeral_time', 'funeral_location', 'funeral_address',
      'burial_location', 'biography', 'obituary', 'profile_image_url',
      'cover_image_url', 'visibility', 'allow_tributes', 'allow_candles',
      'allow_photos', 'status', 'theme',
    ]);
    // The review acknowledgement is checked but is never stored as a DB column.
    const publicationConfirmed = (body as UpdateMemorialRequest & { publication_confirmed?: boolean }).publication_confirmed === true;
    const keys = Object.keys(body).filter(key => key !== 'publication_confirmed');
    if (keys.length === 0 || keys.some(key => !editable.has(key))) {
      return NextResponse.json({ error: 'Unexpected or missing update fields' }, { status: 400 });
    }
    if (body.visibility && !['public', 'unlisted', 'private'].includes(body.visibility)) {
      return NextResponse.json({ error: 'Invalid memorial visibility' }, { status: 400 });
    }
    if (body.status && !['draft', 'published', 'archived'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid memorial status' }, { status: 400 });
    }
    if (body.status === 'published' && existing.status !== 'published' && !publicationConfirmed) {
      return NextResponse.json({ error: 'Please review and confirm publication first' }, { status: 400 });
    }
    if (body.date_of_birth || body.date_of_death) {
      const dateError = validateLifeDates(
        body.date_of_birth || existing.date_of_birth,
        body.date_of_death || existing.date_of_death
      );
      if (dateError) return NextResponse.json({ error: dateError }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    keys.forEach(key => {
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
