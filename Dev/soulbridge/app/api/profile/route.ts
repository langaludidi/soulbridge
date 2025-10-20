import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin, upsertProfile, createAuditLog } from '@/lib/supabase/client';
import type { ProfileUpdate } from '@/types/database';

/**
 * GET /api/profile
 * Get current user's profile
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get profile from Supabase
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    // If profile doesn't exist, create it from Clerk data
    if (error && error.code === 'PGRST116') {
      console.log('Profile not found, creating from Clerk data...');

      const user = await currentUser();
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      );

      if (!primaryEmail) {
        return NextResponse.json(
          { error: 'No email address found' },
          { status: 400 }
        );
      }

      profile = await upsertProfile({
        clerk_user_id: user.id,
        email: primaryEmail.emailAddress,
        first_name: user.firstName || undefined,
        last_name: user.lastName || undefined,
        avatar_url: user.imageUrl || undefined,
      });

      return NextResponse.json({ data: profile }, { status: 200 });
    }

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: profile }, { status: 200 });
  } catch (error) {
    console.error('GET /api/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile
 * Update current user's profile
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

    const body: ProfileUpdate = await req.json();

    // Validate allowed fields
    const allowedFields = [
      'first_name',
      'last_name',
      'phone_number',
      'date_of_birth',
      'address_line1',
      'address_line2',
      'city',
      'province',
      'postal_code',
      'country',
      'preferred_language',
      'timezone',
      'notification_preferences',
      'metadata',
    ];

    const updates: ProfileUpdate = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key)) {
        (updates as any)[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get current profile for audit log
    const { data: oldProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    // Update profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('clerk_user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Log the update
    if (oldProfile) {
      await createAuditLog({
        profile_id: profile.id,
        action: 'profile.updated',
        resource_type: 'profile',
        resource_id: profile.id,
        old_values: oldProfile,
        new_values: profile,
        metadata: {
          source: 'api',
          updated_fields: Object.keys(updates),
        },
      });
    }

    return NextResponse.json(
      {
        data: profile,
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PATCH /api/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile
 * Soft delete current user's profile
 */
export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Soft delete (set status to 'deleted')
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ status: 'deleted' })
      .eq('clerk_user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting profile:', error);
      return NextResponse.json(
        { error: 'Failed to delete profile' },
        { status: 500 }
      );
    }

    // Log the deletion
    await createAuditLog({
      profile_id: profile.id,
      action: 'profile.deleted',
      resource_type: 'profile',
      resource_id: profile.id,
      old_values: profile,
      metadata: {
        source: 'api',
      },
    });

    return NextResponse.json(
      {
        message: 'Profile deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
