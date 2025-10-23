import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export const runtime = 'nodejs'; // Use Node.js runtime for more flexibility
export const maxDuration = 60; // 60 seconds for generation + upload

export async function POST(request: NextRequest) {
  try {
    const { memorialId } = await request.json();

    if (!memorialId) {
      return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch memorial data
    const { data: memorial, error: fetchError } = await supabase
      .from('memorials')
      .select('*')
      .eq('id', memorialId)
      .single();

    if (fetchError || !memorial) {
      return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
    }

    const fullName = memorial.full_name || 'In Loving Memory';
    const profileImageUrl = memorial.cover_image_url || memorial.profile_image_url || '';

    // Generate initials for fallback
    const initials = fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    // Format dates
    const formatDate = (dateString: string | null) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const birthDate = memorial.date_of_birth ? formatDate(memorial.date_of_birth) : '';
    const deathDate = memorial.date_of_death ? formatDate(memorial.date_of_death) : '';
    const dateRange = birthDate && deathDate ? `${birthDate} – ${deathDate}` : '';

    // Fetch and convert profile image to base64
    let profileImage = '';
    if (profileImageUrl) {
      try {
        const imageResponse = await fetch(profileImageUrl);
        if (imageResponse.ok) {
          const arrayBuffer = await imageResponse.arrayBuffer();
          if (arrayBuffer.byteLength < 5 * 1024 * 1024) {
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
            profileImage = `data:${contentType};base64,${base64}`;
          }
        }
      } catch (error) {
        console.error('[Generate OG] Image fetch failed:', error);
      }
    }

    // Generate OG image
    const ogImage = new ImageResponse(
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
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    // Convert ImageResponse to buffer
    const imageBuffer = await ogImage.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Upload to Supabase Storage
    const fileName = `og-images/${memorialId}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('memorial-media')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true, // Overwrite if exists
      });

    if (uploadError) {
      console.error('[Generate OG] Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload OG image' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('memorial-media')
      .getPublicUrl(fileName);

    const ogImageUrl = urlData.publicUrl;

    // Update memorial with OG image URL
    const { error: updateError } = await supabase
      .from('memorials')
      .update({ og_image_url: ogImageUrl })
      .eq('id', memorialId);

    if (updateError) {
      console.error('[Generate OG] Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update memorial' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ogImageUrl,
      message: 'OG image generated and uploaded successfully',
    });

  } catch (error) {
    console.error('[Generate OG] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate OG image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
