import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const style = searchParams.get('style') || 'elegant';

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
    const birthYear = memorial.date_of_birth ? new Date(memorial.date_of_birth).getFullYear() : '';
    const deathYear = memorial.date_of_death ? new Date(memorial.date_of_death).getFullYear() : '';
    const years = birthYear && deathYear ? `${birthYear} - ${deathYear}` : '';
    const headline = memorial.headline || '';
    const profileImage = memorial.profile_image_url || '';

    // Generate OG Image based on style
    if (style === 'traditional') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2c2c2c',
              backgroundImage: 'radial-gradient(circle, #3a3a3a 0%, #1a1a1a 100%)',
            }}
          >
            {/* Golden cross at top */}
            <div style={{ fontSize: 60, marginBottom: 30, color: '#d4af37' }}>
              ✝
            </div>

            {/* Photo with golden frame */}
            {profileImage && (
              <img
                src={profileImage}
                alt={fullName}
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  border: '6px solid #d4af37',
                  objectFit: 'cover',
                  marginBottom: 40,
                }}
              />
            )}

            <div style={{ fontSize: 28, color: '#d4af37', marginBottom: 20, letterSpacing: 2 }}>
              IN LOVING MEMORY OF
            </div>

            <div style={{ fontSize: 64, fontWeight: 700, color: '#ffffff', marginBottom: 20, textAlign: 'center', maxWidth: '90%' }}>
              {fullName}
            </div>

            {years && (
              <div style={{ fontSize: 42, color: '#cccccc', marginBottom: 30 }}>
                {years}
              </div>
            )}

            {/* Decorative line */}
            <div
              style={{
                width: 200,
                height: 2,
                backgroundColor: '#d4af37',
                marginTop: 20,
                marginBottom: 40,
              }}
            />

            <div style={{ fontSize: 24, color: '#999999' }}>
              Forever in our hearts
            </div>

            {/* Footer */}
            <div
              style={{
                position: 'absolute',
                bottom: 30,
                fontSize: 20,
                color: '#666',
                fontWeight: 500,
              }}
            >
              soulbridge.co.za
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    if (style === 'minimalist') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              backgroundColor: '#ffffff',
              padding: 80,
            }}
          >
            {/* Photo on left */}
            {profileImage && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <img
                  src={profileImage}
                  alt={fullName}
                  style={{
                    width: 400,
                    height: 400,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              </div>
            )}

            {/* Text on right */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingLeft: 60,
              }}
            >
              <div style={{ fontSize: 72, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                {fullName}
              </div>
              {years && (
                <div style={{ fontSize: 48, color: '#666', marginTop: 20 }}>
                  {years}
                </div>
              )}
              {headline && (
                <div style={{ fontSize: 32, color: '#888', marginTop: 40, fontStyle: 'italic' }}>
                  "{headline}"
                </div>
              )}
              <div style={{ fontSize: 24, color: '#999', marginTop: 40 }}>
                🕯️ soulbridge.co.za
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    if (style === 'modern') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: 'linear-gradient(135deg, #2B3E50 0%, #9FB89D 100%)',
            }}
          >
            {/* Photo */}
            {profileImage && (
              <img
                src={profileImage}
                alt={fullName}
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  border: '8px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  objectFit: 'cover',
                  marginBottom: 40,
                }}
              />
            )}

            <div
              style={{
                fontSize: 32,
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 20,
                fontWeight: 400,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              In Loving Memory of
            </div>

            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: 20,
                textAlign: 'center',
                maxWidth: '90%',
                lineHeight: 1.2,
              }}
            >
              {fullName}
            </div>

            {years && (
              <div
                style={{
                  fontSize: 42,
                  color: 'rgba(255, 255, 255, 0.85)',
                  marginBottom: 40,
                  fontWeight: 300,
                }}
              >
                {years}
              </div>
            )}

            {headline && (
              <div
                style={{
                  fontSize: 28,
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontStyle: 'italic',
                  maxWidth: 800,
                  textAlign: 'center',
                  marginBottom: 40,
                  lineHeight: 1.4,
                }}
              >
                "{headline}"
              </div>
            )}

            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: 20,
              }}
            >
              🕯️ Light a candle • 💐 Share a memory
            </div>

            {/* Footer */}
            <div
              style={{
                position: 'absolute',
                bottom: 30,
                fontSize: 20,
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 500,
              }}
            >
              soulbridge.co.za
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Default: Elegant style
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignments: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f0',
            backgroundImage: 'linear-gradient(135deg, #f5f5f0 0%, #e8e8dc 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              display: 'flex',
            }}
          >
            <div style={{ position: 'absolute', top: 40, left: 40, fontSize: 80 }}>✝</div>
            <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: 80 }}>🕊️</div>
          </div>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 80,
              textAlign: 'center',
            }}
          >
            {/* Memorial photo */}
            {profileImage && (
              <img
                src={profileImage}
                alt={fullName}
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  border: '8px solid #fff',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                  objectFit: 'cover',
                  marginBottom: 40,
                }}
              />
            )}

            {/* In Loving Memory text */}
            <div
              style={{
                fontSize: 32,
                color: '#666',
                marginBottom: 20,
                fontWeight: 400,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              In Loving Memory of
            </div>

            {/* Name */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: 20,
                lineHeight: 1.2,
                maxWidth: '90%',
              }}
            >
              {fullName}
            </div>

            {/* Years */}
            {years && (
              <div
                style={{
                  fontSize: 42,
                  color: '#888',
                  marginBottom: 40,
                  fontWeight: 300,
                }}
              >
                {years}
              </div>
            )}

            {/* Memorial headline or verse */}
            {headline && (
              <div
                style={{
                  fontSize: 28,
                  color: '#555',
                  fontStyle: 'italic',
                  maxWidth: 800,
                  marginBottom: 40,
                  lineHeight: 1.4,
                }}
              >
                "{headline}"
              </div>
            )}

            {/* Call to action */}
            <div
              style={{
                fontSize: 24,
                color: '#666',
                marginTop: 20,
              }}
            >
              🕯️ Light a candle • 💐 Share a memory • 📖 View service details
            </div>
          </div>

          {/* Footer with domain */}
          <div
            style={{
              position: 'absolute',
              bottom: 30,
              fontSize: 24,
              color: '#999',
              fontWeight: 500,
            }}
          >
            soulbridge.co.za
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
