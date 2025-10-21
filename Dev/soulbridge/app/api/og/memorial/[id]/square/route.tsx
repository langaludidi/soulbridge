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
    const birthYear = memorial.date_of_birth ? new Date(memorial.date_of_birth).getFullYear() : '';
    const deathYear = memorial.date_of_death ? new Date(memorial.date_of_death).getFullYear() : '';
    const years = birthYear && deathYear ? `${birthYear} - ${deathYear}` : '';
    const profileImage = memorial.profile_image_url || '';

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
            backgroundColor: '#f5f5f0',
            backgroundImage: 'linear-gradient(135deg, #f5f5f0 0%, #e8e8dc 100%)',
            padding: 60,
          }}
        >
          {/* Memorial photo */}
          {profileImage && (
            <img
              src={profileImage}
              alt={fullName}
              style={{
                width: 320,
                height: 320,
                borderRadius: '50%',
                border: '8px solid #fff',
                objectFit: 'cover',
                marginBottom: 30,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}
            />
          )}

          {/* Name */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              textAlign: 'center',
              color: '#1a1a1a',
              marginBottom: 15,
              lineHeight: 1.2,
            }}
          >
            {fullName}
          </div>

          {/* Years */}
          {years && (
            <div
              style={{
                fontSize: 32,
                color: '#666',
                marginBottom: 20,
              }}
            >
              {years}
            </div>
          )}

          {/* Memorial text */}
          <div
            style={{
              fontSize: 24,
              color: '#888',
              marginTop: 20,
            }}
          >
            🕯️ In Loving Memory
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              fontSize: 18,
              color: '#999',
            }}
          >
            soulbridge.co.za
          </div>
        </div>
      ),
      {
        width: 600,
        height: 600,
      }
    );
  } catch (error) {
    console.error('Square OG image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
