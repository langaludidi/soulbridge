import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Memorial } from '@/types/memorial';
import { getSupabaseAdmin, getProfileByClerkId } from '@/lib/supabase/client';
import { auth } from '@clerk/nextjs/server';
import TributeForm from './TributeForm';
import CandleForm from './CandleForm';
import ShareButtons from './ShareButtons';
import BiographySection from './BiographySection';
import GallerySection from './GallerySection';
import VideoSection from './VideoSection';
import AudioSection from './AudioSection';
import TimelineSection from './TimelineSection';
import AddPhotoForm from './AddPhotoForm';
import AddVideoForm from './AddVideoForm';
import AddAudioForm from './AddAudioForm';
import AddTimelineForm from './AddTimelineForm';
import GuestbookForm from './GuestbookForm';
import StickyActionBar from './StickyActionBar';

async function getMemorial(id: string): Promise<Memorial | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('memorials')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    // Increment view count
    await supabase
      .from('memorials')
      .update({ view_count: data.view_count + 1 })
      .eq('id', id);

    return data;
  } catch (error) {
    console.error('Error fetching memorial:', error);
    return null;
  }
}

async function getTributes(memorialId: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('tributes')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    return data || [];
  } catch (error) {
    console.error('Error fetching tributes:', error);
    return [];
  }
}

async function getCandles(memorialId: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('virtual_candles')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    return data || [];
  } catch (error) {
    console.error('Error fetching candles:', error);
    return [];
  }
}

async function getGallery(memorialId: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('memorial_media')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('media_type', 'photo')
      .eq('is_approved', true)
      .order('media_order', { ascending: true })
      .order('created_at', { ascending: false });

    return data || [];
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

async function getVideos(memorialId: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('memorial_media')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('media_type', 'video')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    return data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

async function getAudios(memorialId: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('memorial_media')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('media_type', 'audio')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    return data || [];
  } catch (error) {
    console.error('Error fetching audios:', error);
    return [];
  }
}

async function getTimeline(memorialId: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('memorial_id', memorialId)
      .order('event_date', { ascending: true });

    return data || [];
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return [];
  }
}

async function getGuestbook(memorialId: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .eq('memorial_id', memorialId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    return data || [];
  } catch (error) {
    console.error('Error fetching guestbook entries:', error);
    return [];
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function MemorialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memorial = await getMemorial(id);

  if (!memorial) {
    notFound();
  }

  const tributes = await getTributes(id);
  const candles = await getCandles(id);
  const gallery = await getGallery(id);
  const videos = await getVideos(id);
  const audios = await getAudios(id);
  const timeline = await getTimeline(id);
  const guestbook = await getGuestbook(id);

  const memorialUrl = `${process.env.NEXT_PUBLIC_APP_URL}/memorials/${id}`;

  // Check if current user is the owner
  const { userId } = await auth();
  let isOwner = false;
  if (userId) {
    const profile = await getProfileByClerkId(userId);
    isOwner = profile?.id === memorial.profile_id;
  }

  // Check if service is upcoming or recent (within 7 days)
  const isServiceRelevant = memorial.funeral_date ?
    Math.abs(new Date(memorial.funeral_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7 :
    false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 1. Hero / Identity Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        {/* Cover Image */}
        {memorial.cover_image_url && (
          <div className="absolute inset-0">
            <img
              src={memorial.cover_image_url}
              alt="Memorial cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Owner Actions (Owner Only) */}
          {isOwner && (
            <div className="absolute top-4 right-4 flex flex-wrap gap-2">
              <Link
                href={`/memorials/${id}/order-of-service`}
                className="inline-flex items-center px-3 py-2 bg-white text-[#9FB89D] rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Order of Service
              </Link>
              <Link
                href={`/memorials/${id}/analytics`}
                className="inline-flex items-center px-3 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
              <Link
                href={`/memorials/${id}/edit`}
                className="inline-flex items-center px-3 py-2 bg-white text-[#2B3E50] rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
            </div>
          )}
          <div className="text-center">
            {/* Profile Picture */}
            {memorial.profile_image_url && (
              <div className="mb-6">
                <img
                  src={memorial.profile_image_url}
                  alt={memorial.full_name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-2xl mx-auto"
                />
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {memorial.full_name}
            </h1>
            {memorial.maiden_name && (
              <p className="text-xl opacity-90 mb-4">
                (née {memorial.maiden_name})
              </p>
            )}
            {memorial.nickname && (
              <p className="text-lg opacity-80 mb-4">
                &quot;{memorial.nickname}&quot;
              </p>
            )}
            <div className="text-xl opacity-90">
              {formatDate(memorial.date_of_birth)} - {formatDate(memorial.date_of_death)}
            </div>
            <div className="text-lg opacity-75 mt-2">
              Age {memorial.age_at_death} years
            </div>
            {/* Micro-meta */}
            {(memorial.place_of_birth || memorial.place_of_death) && (
              <div className="text-sm opacity-70 mt-3">
                {memorial.place_of_death || memorial.place_of_birth}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Primary Action Bar (Sticky on Mobile) */}
      <StickyActionBar
        memorial={memorial}
        dateRange={`${formatDate(memorial.date_of_birth)} - ${formatDate(memorial.date_of_death)}`}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 3. Service Card (only if upcoming or recent) */}
        {isServiceRelevant && (memorial.funeral_date || memorial.funeral_location) && (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-rose-200 dark:border-rose-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Memorial Service
                </h2>
                <div className="space-y-3">
                  {memorial.funeral_date && (
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatDate(memorial.funeral_date)}
                          {memorial.funeral_time && ` at ${memorial.funeral_time}`}
                        </div>
                      </div>
                    </div>
                  )}
                  {memorial.funeral_location && (
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {memorial.funeral_location}
                        </div>
                        {memorial.funeral_address && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {memorial.funeral_address}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {memorial.burial_location && (
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Burial: {memorial.burial_location}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/memorials/${id}/order-of-service`}
                    className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Order of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Biography & Obituary */}
        {(memorial.biography || memorial.obituary) && (
          <BiographySection
            biography={memorial.biography || ''}
            obituary={memorial.obituary}
          />
        )}

        {/* 5. Gallery & Media Section */}
        {(gallery.length > 0 || videos.length > 0 || audios.length > 0 || isOwner) && (
          <div>
            {isOwner && (
              <div className="mb-4 flex flex-wrap gap-3">
                <AddPhotoForm memorialId={id} />
                <AddVideoForm memorialId={id} />
                <AddAudioForm memorialId={id} />
              </div>
            )}
            {gallery.length > 0 && (
              <div className="mb-8">
                <GallerySection memorialId={id} initialPhotos={gallery} />
              </div>
            )}
            {videos.length > 0 && (
              <div className="mb-8">
                <VideoSection memorialId={id} initialVideos={videos} />
              </div>
            )}
            {audios.length > 0 && (
              <div className="mb-8">
                <AudioSection memorialId={id} initialAudios={audios} />
              </div>
            )}
          </div>
        )}

        {/* 6. Life Timeline */}
        {(timeline.length > 0 || isOwner) && (
          <div>
            {isOwner && (
              <div className="mb-4">
                <AddTimelineForm memorialId={id} />
              </div>
            )}
            {timeline.length > 0 && (
              <TimelineSection events={timeline} />
            )}
          </div>
        )}

        {/* 7. Tribute Wall (Form First, then Wall) */}
        {memorial.allow_tributes && (
          <div id="tributes" className="scroll-mt-20">
            <div className="mb-6">
              <TributeForm memorialId={id} />
            </div>
            {tributes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Tributes ({tributes.length})
                </h2>
                <div className="space-y-6">
                  {tributes.map((tribute: any) => (
                    <div key={tribute.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {tribute.author_name}
                          </h4>
                          {tribute.relationship && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tribute.relationship}
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(tribute.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {tribute.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. Virtual Candles (Form, then Candles List) */}
        {memorial.allow_candles && (
          <div id="candles" className="scroll-mt-20">
            <div className="mb-6">
              <CandleForm memorialId={id} />
            </div>
            {candles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Virtual Candles ({candles.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candles.map((candle: any) => (
                    <div key={candle.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                      <div className="text-4xl mb-2">🕯️</div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {candle.lit_by_name}
                      </p>
                      {candle.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          &quot;{candle.message}&quot;
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(candle.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. Locations & Community */}
        {(memorial.place_of_birth || memorial.place_of_death) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Locations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memorial.place_of_birth && (
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Place of Birth
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {memorial.place_of_birth}
                  </div>
                </div>
              )}
              {memorial.place_of_death && (
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Place of Passing
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {memorial.place_of_death}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 10. Guestbook */}
        <div className="mb-8">
          <GuestbookForm memorialId={id} />
        </div>
        {guestbook.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Guestbook ({guestbook.length})
            </h2>
            <div className="space-y-6">
              {guestbook.map((entry: any) => (
                <div key={entry.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {entry.signed_by_name}
                      </h4>
                      {entry.location && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📍 {entry.location}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {entry.message && (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-2">
                      {entry.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. Share & Stats Section */}
        <div id="share" className="scroll-mt-20">
          <ShareButtons
            memorialId={id}
            memorialName={memorial.full_name}
            memorialUrl={memorialUrl}
            dates={`${formatDate(memorial.date_of_birth)} - ${formatDate(memorial.date_of_death)}`}
          />
        </div>

        {/* Stats Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#2B3E50] dark:text-[#9FB89D]">
                {memorial.view_count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#9FB89D] dark:text-[#bac9b7]">
                {memorial.tribute_count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tributes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {memorial.candle_count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Candles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {memorial.guestbook_count || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Guestbook</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {memorial.share_count || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Shares</div>
            </div>
          </div>
        </div>

        {/* 12. Footer */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-[#2B3E50] hover:text-[#243342] dark:text-[#9FB89D] font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>Memorial created with SoulBridge • Honoring lives, preserving memories</p>
            <p>© {new Date().getFullYear()} SoulBridge Memorials. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
