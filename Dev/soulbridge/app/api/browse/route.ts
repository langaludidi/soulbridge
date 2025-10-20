import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';

/**
 * GET /api/browse
 * Get all public memorials
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('memorials')
      .select('*')
      .eq('visibility', 'public')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Add search filter if provided
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,place_of_birth.ilike.%${search}%,place_of_death.ilike.%${search}%`);
    }

    const { data: memorials, error, count } = await query;

    if (error) {
      console.error('Error fetching public memorials:', error);
      return NextResponse.json(
        { error: 'Failed to fetch memorials' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: memorials || [],
        count: count || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/browse error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
