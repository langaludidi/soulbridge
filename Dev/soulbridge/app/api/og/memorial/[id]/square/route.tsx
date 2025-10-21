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
            backgroundColor: '#2B3E50',
            backgroundImage: 'linear-gradient(135deg, #2B3E50 0%, #1a2833 100%)',
            padding: 40,
          }}
        >
          {/* Memorial photo - Large and centered for WhatsApp */}
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              style={{
                width: 420,
                height: 420,
                borderRadius: '50%',
                border: '10px solid #9FB89D',
                objectFit: 'cover',
                marginBottom: 25,
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
              }}
            />
          ) : (
            <div
              style={{
                width: 420,
                height: 420,
                borderRadius: '50%',
                border: '10px solid #9FB89D',
                backgroundColor: '#9FB89D',
                marginBottom: 25,
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 160,
                color: '#fff',
              }}
            >
              🕯️
            </div>
          )}

          {/* Name */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              textAlign: 'center',
              color: '#ffffff',
              marginBottom: 10,
              lineHeight: 1.1,
              maxWidth: '90%',
            }}
          >
            {fullName}
          </div>

          {/* Years */}
          {years && (
            <div
              style={{
                fontSize: 28,
                color: '#9FB89D',
                marginBottom: 15,
              }}
            >
              {years}
            </div>
          )}

          {/* Memorial text */}
          <div
            style={{
              fontSize: 20,
              color: '#cccccc',
              marginTop: 10,
            }}
          >
            In Loving Memory
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
