import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getSupabaseAdmin } from '@/lib/supabase/client';

/**
 * GET /api/qr-code
 * Generate QR code for a memorial
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const memorialId = searchParams.get('memorial_id');
    const format = searchParams.get('format') || 'png'; // png or svg

    if (!memorialId) {
      return NextResponse.json(
        { error: 'memorial_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if memorial exists
    const { data: memorial, error } = await supabase
      .from('memorials')
      .select('id, full_name, status, visibility')
      .eq('id', memorialId)
      .single();

    if (error || !memorial) {
      return NextResponse.json(
        { error: 'Memorial not found' },
        { status: 404 }
      );
    }

    // Generate memorial URL
    const memorialUrl = `${process.env.NEXT_PUBLIC_APP_URL}/memorials/${memorialId}`;

    // Generate QR code
    if (format === 'svg') {
      const qrSvg = await QRCode.toString(memorialUrl, {
        type: 'svg',
        width: 300,
        margin: 2,
      });

      return new NextResponse(qrSvg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } else {
      // Default to PNG
      const qrPng = await QRCode.toDataURL(memorialUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return NextResponse.json(
        {
          data: {
            qr_code: qrPng,
            url: memorialUrl,
            memorial_id: memorialId,
            memorial_name: memorial.full_name,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('GET /api/qr-code error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
