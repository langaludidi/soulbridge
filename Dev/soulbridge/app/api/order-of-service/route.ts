import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const memorial_id = searchParams.get('memorial_id');

    if (!memorial_id) {
      return NextResponse.json(
        { error: 'Memorial ID is required' },
        { status: 400 }
      );
    }

    // Get order of service
    const { data: oos, error: oosError } = await supabase
      .from('order_of_service')
      .select('*')
      .eq('memorial_id', memorial_id)
      .single();

    if (oosError && oosError.code !== 'PGRST116') {
      console.error('Error fetching order of service:', oosError);
      return NextResponse.json(
        { error: 'Failed to fetch order of service' },
        { status: 500 }
      );
    }

    // If no order of service exists, return null
    if (!oos) {
      return NextResponse.json({ data: null });
    }

    // Get items
    const { data: items, error: itemsError } = await supabase
      .from('order_of_service_items')
      .select('*')
      .eq('order_of_service_id', oos.id)
      .order('item_order', { ascending: true });

    if (itemsError) {
      console.error('Error fetching order of service items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch order of service items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        ...oos,
        items: items || [],
      },
    });
  } catch (error) {
    console.error('Error in order of service API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const body = await req.json();

    const {
      memorial_id,
      cover_title,
      cover_photo_url,
      theme_color,
      officiant,
      venue,
      service_date,
      service_time,
      pallbearers,
      items,
    } = body;

    // Verify ownership
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

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
        { error: 'You do not have permission to create order of service for this memorial' },
        { status: 403 }
      );
    }

    // Create order of service
    const { data: oos, error: oosError } = await supabase
      .from('order_of_service')
      .insert({
        memorial_id,
        cover_title: cover_title || 'In Loving Memory',
        cover_photo_url: cover_photo_url || null,
        theme_color: theme_color || 'classic',
        officiant: officiant || null,
        venue: venue || null,
        service_date: service_date || null,
        service_time: service_time || null,
        pallbearers: pallbearers || [],
        status: 'draft',
      })
      .select()
      .single();

    if (oosError) {
      console.error('Error creating order of service:', oosError);
      return NextResponse.json(
        { error: 'Failed to create order of service' },
        { status: 500 }
      );
    }

    // Create items if provided
    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any, index: number) => ({
        order_of_service_id: oos.id,
        item_order: index,
        item_type: item.item_type,
        title: item.title,
        speaker_performer: item.speaker_performer || null,
        duration: item.duration || null,
        notes: item.notes || null,
      }));

      const { error: itemsError } = await supabase
        .from('order_of_service_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error('Error creating order of service items:', itemsError);
        // Don't fail the whole request, just log the error
      }
    }

    return NextResponse.json({ data: oos }, { status: 201 });
  } catch (error) {
    console.error('Error in order of service API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const body = await req.json();

    const {
      id,
      cover_title,
      cover_photo_url,
      theme_color,
      officiant,
      venue,
      service_date,
      service_time,
      pallbearers,
      funeral_home_logo_url,
      funeral_home_name,
      funeral_home_address,
      funeral_home_phone,
      status,
    } = body;

    // Verify ownership
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { data: oos, error: oosError } = await supabase
      .from('order_of_service')
      .select('memorial_id')
      .eq('id', id)
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
        { error: 'You do not have permission to update this order of service' },
        { status: 403 }
      );
    }

    // Update order of service
    const updateData: any = {};
    if (cover_title !== undefined) updateData.cover_title = cover_title;
    if (cover_photo_url !== undefined) updateData.cover_photo_url = cover_photo_url;
    if (theme_color !== undefined) updateData.theme_color = theme_color;
    if (officiant !== undefined) updateData.officiant = officiant;
    if (venue !== undefined) updateData.venue = venue;
    if (service_date !== undefined) updateData.service_date = service_date;
    if (service_time !== undefined) updateData.service_time = service_time;
    if (pallbearers !== undefined) updateData.pallbearers = pallbearers;
    if (funeral_home_logo_url !== undefined) updateData.funeral_home_logo_url = funeral_home_logo_url;
    if (funeral_home_name !== undefined) updateData.funeral_home_name = funeral_home_name;
    if (funeral_home_address !== undefined) updateData.funeral_home_address = funeral_home_address;
    if (funeral_home_phone !== undefined) updateData.funeral_home_phone = funeral_home_phone;
    if (status !== undefined) updateData.status = status;

    const { data: updated, error: updateError } = await supabase
      .from('order_of_service')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order of service:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order of service' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error in order of service API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
