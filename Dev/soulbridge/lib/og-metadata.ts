import { Metadata } from 'next';
import { getSupabaseAdmin } from './supabase/client';

interface MemorialMetadataOptions {
  memorialId: string;
  ogImageStyle?: 'elegant' | 'traditional' | 'minimalist' | 'modern';
}

export async function generateMemorialMetadata({
  memorialId,
  ogImageStyle = 'elegant',
}: MemorialMetadataOptions): Promise<Metadata> {
  try {
    const supabase = getSupabaseAdmin();

    const { data: memorial, error } = await supabase
      .from('memorials')
      .select('*')
      .eq('id', memorialId)
      .single();

    if (error || !memorial) {
      return {
        title: 'Memorial Not Found | SoulBridge',
        description: 'This memorial page could not be found.',
      };
    }

    const fullName = memorial.full_name || 'In Loving Memory';
    const birthYear = memorial.date_of_birth ? new Date(memorial.date_of_birth).getFullYear() : '';
    const deathYear = memorial.date_of_death ? new Date(memorial.date_of_death).getFullYear() : '';
    const years = birthYear && deathYear ? `${birthYear} - ${deathYear}` : '';
    const memorialUrl = `https://soulbridge.co.za/memorials/${memorial.id}`;
    const ogImageUrl = `https://soulbridge.co.za/api/og/memorial/${memorial.id}?style=${ogImageStyle}`;
    const squareOgImageUrl = `https://soulbridge.co.za/api/og/memorial/${memorial.id}/square`;

    // Craft dignified description
    const description = memorial.headline
      ? `${memorial.headline} - Visit ${fullName.split(' ')[0]}'s memorial to light a candle, share memories, and celebrate their life.`
      : `In loving memory of ${fullName} ${years ? `(${years})` : ''}. Light a virtual candle, share memories and tributes, and celebrate their remarkable life.`;

    return {
      title: `${fullName} ${years ? `(${years})` : ''} - In Loving Memory`,
      description,

      // Open Graph tags (Facebook, LinkedIn, WhatsApp)
      openGraph: {
        type: 'profile',
        url: memorialUrl,
        title: `In Loving Memory of ${fullName}`,
        description,
        siteName: 'SoulBridge Memorial Platform',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `Memorial for ${fullName}`,
            type: 'image/png',
          },
          // Add square version for WhatsApp
          {
            url: squareOgImageUrl,
            width: 600,
            height: 600,
            alt: `Memorial for ${fullName}`,
            type: 'image/png',
          },
        ],
        locale: 'en_ZA',
      },

      // Twitter Card tags
      twitter: {
        card: 'summary_large_image',
        site: '@soulbridge',
        creator: '@soulbridge',
        title: `In Loving Memory of ${fullName}`,
        description,
        images: [ogImageUrl],
      },

      // Additional metadata
      keywords: [
        fullName,
        'memorial',
        'obituary',
        'tribute',
        'remembrance',
        'celebration of life',
        'South Africa',
        ...(memorial.headline ? [memorial.headline] : []),
      ],

      // Robots
      robots: {
        index: memorial.status === 'published',
        follow: memorial.status === 'published',
        googleBot: {
          index: memorial.status === 'published',
          follow: memorial.status === 'published',
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Canonical URL
      alternates: {
        canonical: memorialUrl,
      },

      // Additional tags
      other: {
        'profile:first_name': memorial.full_name?.split(' ')[0] || '',
        'profile:last_name': memorial.full_name?.split(' ').slice(1).join(' ') || '',
        'article:published_time': memorial.created_at,
        'article:modified_time': memorial.updated_at,
      },
    };
  } catch (error) {
    console.error('Error generating memorial metadata:', error);
    return {
      title: 'Memorial | SoulBridge',
      description: 'Honor and remember your loved ones with SoulBridge.',
    };
  }
}

// Generate structured data (JSON-LD) for SEO
export async function generateMemorialStructuredData(memorialId: string) {
  try {
    const supabase = getSupabaseAdmin();

    const { data: memorial, error } = await supabase
      .from('memorials')
      .select('*')
      .eq('id', memorialId)
      .single();

    if (error || !memorial) {
      return null;
    }

    const fullName = memorial.full_name || '';
    const birthDate = memorial.date_of_birth || '';
    const deathDate = memorial.date_of_death || '';

    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: fullName,
      birthDate,
      deathDate,
      image: memorial.profile_image_url || '',
      description: memorial.headline || memorial.biography || '',
      url: `https://soulbridge.co.za/memorials/${memorial.id}`,
      memorialLocation: memorial.burial_location || undefined,
      // Add more structured data as needed
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `https://soulbridge.co.za/memorials/${memorial.id}`,
          url: `https://soulbridge.co.za/memorials/${memorial.id}`,
          name: `${fullName} Memorial`,
          description: `Memorial page for ${fullName}`,
          inLanguage: 'en-ZA',
          potentialAction: {
            '@type': 'ViewAction',
            target: `https://soulbridge.co.za/memorials/${memorial.id}`,
          },
        },
      ],
    };
  } catch (error) {
    console.error('Error generating structured data:', error);
    return null;
  }
}
