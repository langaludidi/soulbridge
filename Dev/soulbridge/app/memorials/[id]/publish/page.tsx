import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { getProfileByClerkId, getSupabaseAdmin } from '@/lib/supabase/client';
import PublishMemorialForm from './PublishMemorialForm';

export const dynamic = 'force-dynamic';

export default async function MemorialPublishingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const profile = await getProfileByClerkId(userId);
  if (!profile) notFound();
  // The server never renders this flow for anyone other than the owner.
  const { data: memorial, error } = await getSupabaseAdmin()
    .from('memorials')
    .select('id, first_name, last_name, date_of_birth, date_of_death, visibility, status, profile_image_url, obituary')
    .eq('id', id)
    .eq('profile_id', profile.id)
    .single();

  if (error || !memorial) notFound();
  return <PublishMemorialForm memorial={memorial} />;
}
