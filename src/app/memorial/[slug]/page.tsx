/**
 * Memorial View Page
 * Displays a memorial with 60+ themes, modern floating navigation, and haptic feedback
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { MemorialPageClient } from './MemorialPageClient';
import type { Service, Photo, Memory } from '@/types/memorial';

// Fetch memorial data from database
async function getMemorial(slug: string) {
  const supabase = createServerComponentClient({ cookies });

  const { data: memorial, error } = await supabase
    .from('memorials')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !memorial) {
    return null;
  }

  // Fetch gallery items
  const { data: galleryData } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('memorial_id', memorial.id)
    .eq('type', 'photo')
    .order('display_order', { ascending: true });

  const photos: Photo[] = (galleryData || []).map(item => ({
    id: item.id,
    url: item.url,
    caption: item.description || undefined,
    uploadedBy: undefined,
    uploadedAt: item.created_at,
  }));

  // Fetch tributes
  const { data: tributesData } = await supabase
    .from('tributes')
    .select('*')
    .eq('memorial_id', memorial.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  const memories: Memory[] = (tributesData || []).map(tribute => ({
    id: tribute.id,
    authorName: tribute.author_name,
    authorPhoto: undefined,
    message: tribute.message,
    photo: undefined,
    createdAt: tribute.created_at,
    candles: 0,
  }));

  // Fetch timeline events
  const { data: timelineData } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('memorial_id', memorial.id)
    .order('date', { ascending: true });

  const timelineEvents = (timelineData || []).map(event => ({
    id: event.id,
    year: new Date(event.date).getFullYear().toString(),
    date: event.date,
    title: event.title,
    description: event.description,
    photo: event.photo_url,
  }));

  // Create service from memorial data
  const services: Service[] = [];
  if (memorial.funeral_date && memorial.funeral_location) {
    services.push({
      id: '1',
      type: 'Funeral Service',
      date: memorial.funeral_date,
      startTime: memorial.funeral_time || '10:00',
      location: memorial.funeral_location.split(',')[0] || memorial.funeral_location,
      address: memorial.funeral_location,
    });
  }

  return {
    memorial,
    photos,
    memories,
    services,
    timelineEvents,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMemorial(slug);

  if (!data) {
    return {
      title: 'Memorial Not Found | SoulBridge',
    };
  }

  const { memorial } = data;

  return {
    title: `${memorial.full_name} | SoulBridge Memorial`,
    description: `In loving memory of ${memorial.full_name}`,
    openGraph: {
      title: `In Memory of ${memorial.full_name}`,
      description: `${memorial.date_of_birth || ''} - ${memorial.date_of_death || ''}`,
      images: memorial.profile_photo_url ? [memorial.profile_photo_url] : [],
    },
  };
}

export default async function MemorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getMemorial(slug);

  if (!data) {
    notFound();
  }

  const { memorial, photos, memories, services, timelineEvents } = data;

  // Transform memorial data to match Memorial type
  const memorialData: Pick<Memorial, 'name' | 'birthDate' | 'deathDate' | 'birthPlace' | 'deathPlace' | 'portrait' | 'coverImage'> = {
    name: memorial.full_name,
    birthDate: memorial.date_of_birth || '',
    deathDate: memorial.date_of_death || '',
    birthPlace: memorial.birth_place,
    deathPlace: memorial.death_place,
    portrait: memorial.profile_photo_url || '/placeholder-portrait.jpg',
    coverImage: memorial.cover_photo_url,
  };

  return (
    <MemorialPageClient
      memorial={memorial}
      memorialData={memorialData}
      photos={photos}
      memories={memories}
      services={services}
      timelineEvents={timelineEvents}
    />
  );
}
