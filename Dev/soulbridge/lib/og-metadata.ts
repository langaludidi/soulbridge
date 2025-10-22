import { Metadata } from 'next';
import { getSupabaseAdmin } from './supabase/client';

interface MemorialMetadataOptions {
  slug: string;
}

export async function generateMemorialMetadata({
  slug,
}: MemorialMetadataOptions): Promise<Metadata> {
  try {
    const supabase = getSupabaseAdmin();

    const { data: memorial, error } = await supabase
      .from('memorials')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !memorial) {
      return {
        title: 'Memorial Not Found | SoulBridge',
        description: 'This memorial page could not be found.',
      };
    }

    const fullName = memorial.full_name || 'In Loving Memory';

    // Format dates
    const formatDate = (dateString: string | null) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const birthDate = memorial.date_of_birth ? formatDate(memorial.date_of_birth) : '';
    const deathDate = memorial.date_of_death ? formatDate(memorial.date_of_death) : '';

    // URLs using slug
    const memorialUrl = `https://soulbridge.co.za/${memorial.slug}`;
    const ogImageUrl = `https://soulbridge.co.za/api/og/${memorial.slug}`;
    const squareOgImageUrl = `https://soulbridge.co.za/api/og/memorial/${memorial.id}/square`;

    // Add cache-busting with updated timestamp
    const cacheBuster = memorial.updated_at ? `?v=${new Date(memorial.updated_at).getTime()}` : '';

    // Craft description
    let description = '';
    if (birthDate && deathDate) {
      description = `Born ${birthDate}, passed ${deathDate}. `;
    }

    // Add funeral info if available
    if (memorial.funeral_date) {
      const funeralDate = new Date(memorial.funeral_date);
      const dayName = funeralDate.toLocaleDateString('en-US', { weekday: 'long' });
      const formattedDate = formatDate(memorial.funeral_date);
      const time = memorial.funeral_time ? ` at ${memorial.funeral_time}` : '';
      const location = memorial.funeral_location ? ` ${memorial.funeral_location}` : '';
      description += `Funeral: ${dayName}, ${formattedDate}${time}${location}. `;
    }

    description += `Light a candle, share memories, and celebrate ${fullName.split(' ')[0]}'s remarkable life.`;

    return {
      title: `${fullName} — In Loving Memory`,
      description,

      // Open Graph tags (Facebook, LinkedIn, WhatsApp)
      openGraph: {
        type: 'profile',
        url: memorialUrl,
        title: `${fullName} — In Loving Memory`,
        description,
        siteName: 'SoulBridge',
        images: [
          {
            url: ogImageUrl + cacheBuster,
            width: 1200,
            height: 630,
            alt: `Memorial for ${fullName}`,
            type: 'image/png',
          },
          {
            url: squareOgImageUrl + cacheBuster,
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
        title: `${fullName} — In Loving Memory`,
        description,
        images: [ogImageUrl + cacheBuster],
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
        'SoulBridge',
      ],

      // Robots
      robots: {
        index: memorial.status === 'published' && memorial.visibility === 'public',
        follow: memorial.status === 'published' && memorial.visibility === 'public',
        googleBot: {
          index: memorial.status === 'published' && memorial.visibility === 'public',
          follow: memorial.status === 'published' && memorial.visibility === 'public',
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
export async function generateMemorialStructuredData(slug: string) {
  try {
    const supabase = getSupabaseAdmin();

    const { data: memorial, error } = await supabase
      .from('memorials')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !memorial) {
      return null;
    }

    const fullName = memorial.full_name || '';
    const birthDate = memorial.date_of_birth || '';
    const deathDate = memorial.date_of_death || '';
    const memorialUrl = `https://soulbridge.co.za/${memorial.slug}`;

    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: fullName,
      birthDate,
      deathDate,
      image: memorial.profile_image_url || '',
      description: memorial.biography || memorial.obituary || '',
      url: memorialUrl,
      memorialLocation: memorial.burial_location || undefined,
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': memorialUrl,
          url: memorialUrl,
          name: `${fullName} Memorial`,
          description: `Memorial page for ${fullName}`,
          inLanguage: 'en-ZA',
          potentialAction: {
            '@type': 'ViewAction',
            target: memorialUrl,
          },
        },
      ],
    };
  } catch (error) {
    console.error('Error generating structured data:', error);
    return null;
  }
}
