import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getProfileByClerkId, getSupabaseAdmin } from '@/lib/supabase/client';
import TributeReviewList from './TributeReviewList';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Review tributes | Soulbridge', robots: { index: false, follow: false } };

export default async function TributeReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  const profile = await getProfileByClerkId(userId);
  if (!profile) notFound();

  const { data: memorial, error } = await getSupabaseAdmin()
    .from('memorials')
    .select('id, first_name, last_name')
    .eq('id', id)
    .eq('profile_id', profile.id)
    .single();

  if (error || !memorial) notFound();
  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-8 text-[#2B3E50] sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link className="text-sm underline underline-offset-4" href={`/memorials/${id}`}>← Back to memorial</Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[.16em] text-[#6a8668]">Family moderation</p>
        <h1 className="mt-2 text-3xl font-semibold">Review tributes</h1>
        <p className="mt-3 leading-7 text-[#52616a]">Messages for {memorial.first_name} {memorial.last_name} are shown publicly only after your approval.</p>
        <TributeReviewList memorialId={id} />
      </div>
    </main>
  );
}
