import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const body = await req.json();

    const {
      order_of_service_id,
      item_type,
      title,
      speaker_performer,
      duration,
      notes,
    } = body;

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
        { error: 'You do not have permission to add items to this order of service' },
        { status: 403 }
      );
    }

    // Get the highest item_order
    const { data: maxItem } = await supabase
      .from('order_of_service_items')
      .select('item_order')
      .eq('order_of_service_id', order_of_service_id)
      .order('item_order', { ascending: false })
      .limit(1)
      .single();

    const newOrder = maxItem ? maxItem.item_order + 1 : 0;

    // Create item
    const { data: item, error: itemError } = await supabase
      .from('order_of_service_items')
      .insert({
        order_of_service_id,
        item_order: newOrder,
        item_type,
        title,
        speaker_performer: speaker_performer || null,
        duration: duration || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (itemError) {
      console.error('Error creating order of service item:', itemError);
      return NextResponse.json(
        { error: 'Failed to create order of service item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error('Error in order of service items API:', error);
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
      item_type,
      title,
      speaker_performer,
      duration,
      notes,
      item_order,
    } = body;

    // Verify ownership
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { data: item, error: itemError } = await supabase
      .from('order_of_service_items')
      .select('order_of_service_id')
      .eq('id', id)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Order of service item not found' },
        { status: 404 }
      );
    }

    const { data: oos, error: oosError } = await supabase
      .from('order_of_service')
      .select('memorial_id')
      .eq('id', item.order_of_service_id)
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
        { error: 'You do not have permission to update this item' },
        { status: 403 }
      );
    }

    // Update item
    const updateData: any = {};
    if (item_type !== undefined) updateData.item_type = item_type;
    if (title !== undefined) updateData.title = title;
    if (speaker_performer !== undefined) updateData.speaker_performer = speaker_performer;
    if (duration !== undefined) updateData.duration = duration;
    if (notes !== undefined) updateData.notes = notes;
    if (item_order !== undefined) updateData.item_order = item_order;

    const { data: updated, error: updateError } = await supabase
      .from('order_of_service_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order of service item:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order of service item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error in order of service items API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const profile = await getProfileByClerkId(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { data: item, error: itemError } = await supabase
      .from('order_of_service_items')
      .select('order_of_service_id, item_order')
      .eq('id', id)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Order of service item not found' },
        { status: 404 }
      );
    }

    const { data: oos, error: oosError } = await supabase
      .from('order_of_service')
      .select('memorial_id')
      .eq('id', item.order_of_service_id)
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
        { error: 'You do not have permission to delete this item' },
        { status: 403 }
      );
    }

    // Delete item
    const { error: deleteError } = await supabase
      .from('order_of_service_items')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting order of service item:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete order of service item' },
        { status: 500 }
      );
    }

    // Reorder remaining items
    const { data: remainingItems } = await supabase
      .from('order_of_service_items')
      .select('id, item_order')
      .eq('order_of_service_id', item.order_of_service_id)
      .order('item_order', { ascending: true });

    if (remainingItems && remainingItems.length > 0) {
      for (let i = 0; i < remainingItems.length; i++) {
        if (remainingItems[i].item_order !== i) {
          await supabase
            .from('order_of_service_items')
            .update({ item_order: i })
            .eq('id', remainingItems[i].id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in order of service items API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
