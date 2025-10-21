import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';

/**
 * GET /api/family-members?memorial_id=xxx
 * Get family members for a memorial
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

    const { data: familyMembers, error } = await supabase
      .rpc('get_family_tree', { p_memorial_id: memorialId });

    if (error) {
      console.error('Error fetching family members:', error);
      return NextResponse.json(
        { error: 'Failed to fetch family members' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: familyMembers || [],
        count: familyMembers?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/family-members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/family-members
 * Add a new family member (owner only)
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      memorial_id,
      full_name,
      relationship_type,
      photo_url,
      date_of_birth,
      date_of_death,
      is_living,
      description,
      parent_id,
      display_order,
    } = body;

    // Validate required fields
    if (!memorial_id || !full_name || !relationship_type) {
      return NextResponse.json(
        { error: 'memorial_id, full_name, and relationship_type are required' },
        { status: 400 }
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

    // Verify user owns the memorial
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
        { error: 'Forbidden - You do not own this memorial' },
        { status: 403 }
      );
    }

    // Create family member
    const { data: familyMember, error } = await supabase
      .from('family_members')
      .insert({
        memorial_id,
        full_name,
        relationship_type,
        photo_url: photo_url || null,
        date_of_birth: date_of_birth || null,
        date_of_death: date_of_death || null,
        is_living: is_living !== undefined ? is_living : true,
        description: description || null,
        parent_id: parent_id || null,
        display_order: display_order || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating family member:', error);
      return NextResponse.json(
        {
          error: 'Failed to create family member',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: familyMember,
        message: 'Family member added successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/family-members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/family-members
 * Update a family member (owner only)
 */
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
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

    // Verify user owns the memorial
    const { data: familyMember, error: fetchError } = await supabase
      .from('family_members')
      .select('memorial_id')
      .eq('id', id)
      .single();

    if (fetchError || !familyMember) {
      return NextResponse.json(
        { error: 'Family member not found' },
        { status: 404 }
      );
    }

    const { data: memorial } = await supabase
      .from('memorials')
      .select('profile_id')
      .eq('id', familyMember.memorial_id)
      .single();

    if (!memorial || memorial.profile_id !== profile.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Sanitize empty strings to null
    const sanitizeValue = (value: any) => {
      return (value === '' || value === undefined) ? null : value;
    };

    const sanitizedUpdates: any = {};
    Object.keys(updates).forEach((key) => {
      sanitizedUpdates[key] = sanitizeValue(updates[key]);
    });

    // Update family member
    const { data: updated, error } = await supabase
      .from('family_members')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating family member:', error);
      return NextResponse.json(
        {
          error: 'Failed to update family member',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: updated,
        message: 'Family member updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/family-members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/family-members?id=xxx
 * Delete a family member (owner only)
 */
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
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

    // Verify user owns the memorial
    const { data: familyMember, error: fetchError } = await supabase
      .from('family_members')
      .select('memorial_id')
      .eq('id', id)
      .single();

    if (fetchError || !familyMember) {
      return NextResponse.json(
        { error: 'Family member not found' },
        { status: 404 }
      );
    }

    const { data: memorial } = await supabase
      .from('memorials')
      .select('profile_id')
      .eq('id', familyMember.memorial_id)
      .single();

    if (!memorial || memorial.profile_id !== profile.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete family member
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting family member:', error);
      return NextResponse.json(
        { error: 'Failed to delete family member' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Family member deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/family-members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
