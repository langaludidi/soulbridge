import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';

const supabase = getSupabaseAdmin();

// GET: Fetch memorial services
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const memorialId = searchParams.get('memorial_id');

    if (!memorialId) {
      return NextResponse.json(
        { error: 'Memorial ID is required' },
        { status: 400 }
      );
    }

    // Check if user is the memorial owner (to show private services)
    const { userId } = await auth();
    let includePrivate = false;

    if (userId) {
      const profile = await getProfileByClerkId(userId);
      const { data: memorial } = await supabase
        .from('memorials')
        .select('profile_id')
        .eq('id', memorialId)
        .single();

      if (memorial && memorial.profile_id === profile.id) {
        includePrivate = true;
      }
    }

    // Fetch services
    const query = supabase
      .from('memorial_services')
      .select('*')
      .eq('memorial_id', memorialId)
      .order('service_date', { ascending: true })
      .order('service_time', { ascending: true });

    // Only show public services to non-owners
    if (!includePrivate) {
      query.eq('is_private', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching memorial services:', error);
      return NextResponse.json(
        { error: 'Failed to fetch memorial services' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, message: 'Memorial services fetched successfully' });
  } catch (error) {
    console.error('Error fetching memorial services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new memorial service
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      memorial_id,
      service_type,
      title,
      service_date,
      service_time,
      location_name,
      address,
      city,
      state_province,
      country,
      details,
      virtual_link,
      requires_rsvp,
      max_attendees,
      is_private,
    } = body;

    // Validate required fields
    if (!memorial_id || !service_type || !service_date) {
      return NextResponse.json(
        { error: 'Memorial ID, service type, and service date are required' },
        { status: 400 }
      );
    }

    // Verify user owns the memorial
    const profile = await getProfileByClerkId(userId);
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
        { error: 'Forbidden: You do not own this memorial' },
        { status: 403 }
      );
    }

    // Create memorial service
    const { data: service, error } = await supabase
      .from('memorial_services')
      .insert({
        memorial_id,
        service_type,
        title,
        service_date,
        service_time: service_time || null,
        location_name: location_name || null,
        address: address || null,
        city: city || null,
        state_province: state_province || null,
        country: country || null,
        details: details || null,
        virtual_link: virtual_link || null,
        requires_rsvp: requires_rsvp || false,
        max_attendees: max_attendees || null,
        is_private: is_private || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating memorial service:', error);
      return NextResponse.json(
        { error: 'Failed to create memorial service', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: service, message: 'Memorial service created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating memorial service:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update a memorial service
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Verify user owns the memorial associated with this service
    const profile = await getProfileByClerkId(userId);
    const { data: service, error: serviceError } = await supabase
      .from('memorial_services')
      .select('memorial_id')
      .eq('id', id)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Memorial service not found' },
        { status: 404 }
      );
    }

    const { data: memorial, error: memorialError } = await supabase
      .from('memorials')
      .select('profile_id')
      .eq('id', service.memorial_id)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    if (memorial.profile_id !== profile.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not own this memorial' },
        { status: 403 }
      );
    }

    // Sanitize empty strings to null for optional fields
    const sanitizedUpdates: any = {};
    Object.keys(updates).forEach((key) => {
      const value = updates[key];
      sanitizedUpdates[key] = (value === '' || value === undefined) ? null : value;
    });

    // Update memorial service
    const { data: updatedService, error: updateError } = await supabase
      .from('memorial_services')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating memorial service:', updateError);
      return NextResponse.json(
        { error: 'Failed to update memorial service', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: updatedService,
      message: 'Memorial service updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating memorial service:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a memorial service
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Verify user owns the memorial associated with this service
    const profile = await getProfileByClerkId(userId);
    const { data: service, error: serviceError } = await supabase
      .from('memorial_services')
      .select('memorial_id')
      .eq('id', id)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Memorial service not found' },
        { status: 404 }
      );
    }

    const { data: memorial, error: memorialError } = await supabase
      .from('memorials')
      .select('profile_id')
      .eq('id', service.memorial_id)
      .single();

    if (memorialError || !memorial) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    if (memorial.profile_id !== profile.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not own this memorial' },
        { status: 403 }
      );
    }

    // Delete memorial service
    const { error: deleteError } = await supabase
      .from('memorial_services')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting memorial service:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete memorial service', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Memorial service deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting memorial service:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
