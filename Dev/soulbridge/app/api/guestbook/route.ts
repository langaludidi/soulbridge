import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();

    const {
      memorial_id,
      signed_by_name,
      signed_by_email,
      location,
      message,
    } = body;

    // Validate required fields
    if (!memorial_id || !signed_by_name) {
      return NextResponse.json(
        { error: 'Memorial ID and name are required' },
        { status: 400 }
      );
    }

    // Insert guestbook entry
    const { data: entry, error } = await supabase
      .from('guestbook_entries')
      .insert({
        memorial_id,
        signed_by_name,
        signed_by_email: signed_by_email || null,
        location: location || null,
        message: message || null,
        is_approved: true, // Auto-approve for now
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating guestbook entry:', error);
      return NextResponse.json(
        { error: 'Failed to sign guestbook' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (error) {
    console.error('Error in guestbook API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { data: entries, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .eq('memorial_id', memorial_id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching guestbook entries:', error);
      return NextResponse.json(
        { error: 'Failed to fetch guestbook entries' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: entries || [] });
  } catch (error) {
    console.error('Error in guestbook API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
