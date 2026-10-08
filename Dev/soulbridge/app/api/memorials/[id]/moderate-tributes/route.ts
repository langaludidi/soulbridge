import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getProfileByClerkId, getSupabaseAdmin } from '@/lib/supabase/client';

async function getOwnerMemorial(id: string, clerkUserId: string) {
  const profile = await getProfileByClerkId(clerkUserId);
  if (!profile) return null;
  const { data } = await getSupabaseAdmin()
    .from('memorials')
    .select('id')
    .eq('id', id)
    .eq('profile_id', profile.id)
    .single();
  return data;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    if (!await getOwnerMemorial(id, userId)) {
      return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
    }
    const { data, error } = await getSupabaseAdmin()
      .from('tributes')
      .select('id, author_name, author_relationship, message, created_at')
      .eq('memorial_id', id)
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ data: data || [] }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Tribute moderation list failed:', error);
    return NextResponse.json({ error: 'Unable to load pending tributes' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    if (!await getOwnerMemorial(id, userId)) {
      return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
    }
    const body = await request.json();
    if (typeof body.tribute_id !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.tribute_id) ||
        !['approve', 'reject'].includes(body.action)) {
      return NextResponse.json({ error: 'Invalid moderation request' }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const query = body.action === 'approve'
      ? supabase.from('tributes').update({ is_approved: true })
      : supabase.from('tributes').delete();
    const { data, error } = await query
      .eq('memorial_id', id)
      .eq('id', body.tribute_id)
      .eq('is_approved', false)
      .select('id')
      .single();
    if (error || !data) {
      return NextResponse.json({ error: 'Tribute not found or already reviewed' }, { status: 404 });
    }
    return NextResponse.json({ message: body.action === 'approve' ? 'Tribute approved' : 'Tribute removed' },
      { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Tribute moderation failed:', error);
    return NextResponse.json({ error: 'Unable to moderate tribute' }, { status: 500 });
  }
}
