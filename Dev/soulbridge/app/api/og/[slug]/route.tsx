import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = getSupabaseAdmin();

    const { data: memorial, error } = await supabase
      .from('memorials')
      .select('*')
      .eq('slug', params.slug)
      .single();

    if (error || !memorial) {
      return new Response('Memorial not found', { status: 404 });
    }

    // Privacy check - return neutral image for non-public memorials
    if (memorial.visibility !== 'public') {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #e9eee8 0%, #c9d1e3 100%)',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 700, color: '#2B3E50', marginBottom: 20 }}>
              Private Memorial
            </div>
            <div style={{ fontSize: 24, color: '#666' }}>
              This memorial is private
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const fullName = memorial.full_name || 'In Loving Memory';
    const profileImage = memorial.hero_photo_url || memorial.profile_image_url || '';

    // Format dates
    const formatDate = (dateString: string | null) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const birthDate = memorial.date_of_birth ? formatDate(memorial.date_of_birth) : '';
    const deathDate = memorial.date_of_death ? formatDate(memorial.date_of_death) : '';
    const dateRange = birthDate && deathDate ? `${birthDate} – ${deathDate}` : '';

    // Format funeral info
    let funeralInfo = '';
    if (memorial.funeral_date) {
      const funeralDate = new Date(memorial.funeral_date);
      const dayName = funeralDate.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = formatDate(memorial.funeral_date);
      const time = memorial.funeral_time || '';
      funeralInfo = `Funeral: ${dayName}, ${formattedDate}${time ? ' • ' + time : ''}`;
    }

    // Generate initials for fallback
    const initials = fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

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
            /* Fallback gradient with initials */
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #2B3E50 0%, #1a2833 100%)',
                fontSize: 200,
                fontWeight: 700,
                color: '#9FB89D',
                position: 'absolute',
              }}
            >
              {initials}
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
                fontSize: fullName.length > 25 ? 52 : 64,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: 16,
                maxWidth: '90%',
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
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                {dateRange}
              </div>
            )}

            {/* Funeral Info */}
            {funeralInfo && (
              <div
                style={{
                  fontSize: 24,
                  color: '#F1C566',
                  fontWeight: 500,
                }}
              >
                {funeralInfo}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
