import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get memorial data from Supabase
    const supabase = getSupabaseAdmin();

    const { data: memorial, error } = await supabase
      .from('memorials')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !memorial) {
      return new Response('Memorial not found', { status: 404 });
    }

    const fullName = memorial.full_name || 'In Loving Memory';
    const profileImageUrl = memorial.cover_image_url || memorial.profile_image_url || '';

    // Use image URL directly - @vercel/og can fetch external images
    // Skip base64 conversion for better performance
    const profileImage = profileImageUrl;

    // Format dates
    const formatDate = (dateString: string | null) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const birthDate = memorial.date_of_birth ? formatDate(memorial.date_of_birth) : '';
    const deathDate = memorial.date_of_death ? formatDate(memorial.date_of_death) : '';
    const dateRange = birthDate && deathDate ? `${birthDate} – ${deathDate}` : '';

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'relative',
          }}
        >
          {/* Background Image (Profile Picture) */}
          {profileImage ? (
            <>
              <img
                src={profileImage}
                alt={fullName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 35%',
                  position: 'absolute',
                }}
              />
              {/* Vignette Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                }}
              />
            </>
          ) : (
            /* Fallback gradient with candle */
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #2B3E50 0%, #1a2833 100%)',
                fontSize: 200,
                position: 'absolute',
              }}
            >
              🕯️
            </div>
          )}

          {/* Text Content */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '60px',
            }}
          >
            {/* "In loving memory of" */}
            <div
              style={{
                fontSize: 24,
                color: '#F1C566',
                fontWeight: 600,
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              In loving memory of
            </div>

            {/* Full Name */}
            <div
              style={{
                fontSize: fullName.length > 20 ? 52 : 64,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: 16,
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {fullName}
            </div>

            {/* Date Range */}
            {dateRange && (
              <div
                style={{
                  fontSize: 32,
                  color: '#ffffff',
                  fontWeight: 500,
                }}
              >
                {dateRange}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (error) {
    console.error('Square OG image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
