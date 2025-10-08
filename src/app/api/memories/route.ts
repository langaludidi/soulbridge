import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    const { data, error } = await supabase
      .from('tributes')
      .insert({
        memorial_id: body.memorial_id,
        author_name: body.author_name,
        message: body.message,
        is_public: body.is_public,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Transform to Memory format
    const memory = {
      id: data.id,
      authorName: data.author_name,
      authorPhoto: undefined,
      message: data.message,
      photo: undefined,
      createdAt: data.created_at,
      candles: 0,
    };

    return NextResponse.json(memory, { status: 201 });
  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json(
      { error: 'Failed to create memory' },
      { status: 500 }
    );
  }
}
