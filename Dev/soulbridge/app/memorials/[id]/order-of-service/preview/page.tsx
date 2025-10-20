import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import PreviewControls from './PreviewControls';

interface OrderOfServiceItem {
  id: string;
  item_order: number;
  item_type: string;
  title: string;
  subtitle?: string;
  speaker_performer?: string;
  duration?: number;
  notes?: string;
  is_congregation_participation?: boolean;
  page_break_before?: boolean;
}

interface OrderOfService {
  id: string;
  memorial_id: string;
  cover_title: string;
  cover_subtitle?: string;
  cover_photo_url?: string;
  theme_color: string;
  officiant?: string;
  co_officiant?: string;
  venue?: string;
  venue_address?: string;
  service_date?: string;
  service_time?: string;
  service_end_time?: string;
  reception_venue?: string;
  reception_address?: string;
  reception_time?: string;
  funeral_home_logo_url?: string;
  funeral_home_name?: string;
  funeral_home_address?: string;
  funeral_home_phone?: string;
  funeral_home_website?: string;
  funeral_home_email?: string;
  pallbearers?: string[];
  honorary_pallbearers?: string[];
  flower_bearers?: string[];
  special_acknowledgements?: string;
  donations_in_lieu?: string;
  additional_notes?: string;
  interment_location?: string;
  interment_address?: string;
  interment_time?: string;
  interment_private?: boolean;
  items?: OrderOfServiceItem[];
}

interface Memorial {
  id: string;
  full_name: string;
  date_of_birth?: string;
  date_of_death?: string;
  profile_image_url?: string;
}

const THEME_STYLES = {
  classic: {
    bgColor: 'bg-black',
    textColor: 'text-yellow-600',
    accentColor: 'border-yellow-600',
    printBg: '#000000',
    printText: '#ca8a04',
    printAccent: '#ca8a04',
  },
  modern: {
    bgColor: 'bg-blue-900',
    textColor: 'text-gray-300',
    accentColor: 'border-gray-300',
    printBg: '#1e3a8a',
    printText: '#d1d5db',
    printAccent: '#d1d5db',
  },
  traditional: {
    bgColor: 'bg-amber-900',
    textColor: 'text-amber-100',
    accentColor: 'border-amber-100',
    printBg: '#78350f',
    printText: '#fef3c7',
    printAccent: '#fef3c7',
  },
  ubuntu: {
    bgColor: 'bg-orange-600',
    textColor: 'text-white',
    accentColor: 'border-white',
    printBg: '#ea580c',
    printText: '#ffffff',
    printAccent: '#ffffff',
  },
  serene: {
    bgColor: 'bg-blue-700',
    textColor: 'text-blue-100',
    accentColor: 'border-blue-100',
    printBg: '#1d4ed8',
    printText: '#dbeafe',
    printAccent: '#dbeafe',
  },
  elegant: {
    bgColor: 'bg-purple-900',
    textColor: 'text-purple-100',
    accentColor: 'border-purple-100',
    printBg: '#581c87',
    printText: '#f3e8ff',
    printAccent: '#f3e8ff',
  },
};

function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timeString?: string): string {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export default async function OrderOfServicePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  // Fetch memorial
  const { data: memorial, error: memorialError } = await supabase
    .from('memorials')
    .select('id, full_name, date_of_birth, date_of_death, profile_image_url')
    .eq('id', id)
    .single();

  if (memorialError || !memorial) {
    notFound();
  }

  // Fetch order of service
  const { data: oos, error: oosError } = await supabase
    .from('order_of_service')
    .select('*')
    .eq('memorial_id', id)
    .single();

  if (oosError || !oos) {
    notFound();
  }

  // Fetch items
  const { data: items } = await supabase
    .from('order_of_service_items')
    .select('*')
    .eq('order_of_service_id', oos.id)
    .order('item_order', { ascending: true });

  const orderOfService: OrderOfService = {
    ...oos,
    items: items || [],
  };

  const theme = THEME_STYLES[orderOfService.theme_color as keyof typeof THEME_STYLES] || THEME_STYLES.classic;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .no-print {
            display: none !important;
          }

          .print-page {
            page-break-after: always;
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .cover-page {
            background-color: ${theme.printBg} !important;
            color: ${theme.printText} !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .page-break-before {
            page-break-before: always;
          }
        }

        @media screen {
          .print-page {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        }
      ` }} />

      {/* No-print controls */}
      <PreviewControls memorialId={id} memorialName={memorial.full_name} />

      <div className="no-print h-20"></div>

      {/* Cover Page */}
      <div className={`print-page cover-page ${theme.bgColor} ${theme.textColor} flex flex-col items-center justify-center relative overflow-hidden`}>
        {/* Background image overlay */}
        {orderOfService.cover_photo_url && (
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${orderOfService.cover_photo_url})` }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 text-center px-12 max-w-4xl">
          {/* Cover Title */}
          <h1 className="text-5xl font-serif mb-8 tracking-wide">
            {orderOfService.cover_title}
          </h1>

          {/* Cover Subtitle */}
          {orderOfService.cover_subtitle && (
            <p className="text-2xl font-light italic mb-12 opacity-90">
              {orderOfService.cover_subtitle}
            </p>
          )}

          {/* Name */}
          <h2 className="text-6xl font-bold mb-4 tracking-tight">
            {memorial.full_name}
          </h2>

          {/* Dates */}
          <div className="text-2xl font-light mb-16 opacity-90">
            {memorial.date_of_birth && memorial.date_of_death && (
              <>
                {new Date(memorial.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {' - '}
                {new Date(memorial.date_of_death).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </>
            )}
          </div>

          {/* Service Details */}
          <div className={`border-t-2 ${theme.accentColor} pt-8 text-xl space-y-2`}>
            {orderOfService.venue && (
              <p className="font-medium">{orderOfService.venue}</p>
            )}
            {orderOfService.venue_address && (
              <p className="text-lg opacity-80">{orderOfService.venue_address}</p>
            )}
            {orderOfService.service_date && (
              <p className="font-light mt-4">{formatDate(orderOfService.service_date)}</p>
            )}
            {orderOfService.service_time && (
              <p className="font-light">
                {formatTime(orderOfService.service_time)}
                {orderOfService.service_end_time && ` - ${formatTime(orderOfService.service_end_time)}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Program Page */}
      <div className="print-page bg-white p-16">
        <div className={`border-4 ${theme.accentColor} p-12 min-h-full`}>
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Order of Service</h2>
            {orderOfService.officiant && (
              <p className="text-lg text-gray-600">
                Officiant: {orderOfService.officiant}
                {orderOfService.co_officiant && ` & ${orderOfService.co_officiant}`}
              </p>
            )}
          </div>

          {/* Program Items */}
          <div className="space-y-6 mb-16">
            {orderOfService.items?.map((item, index) => (
              <div
                key={item.id}
                className={item.page_break_before ? 'page-break-before' : ''}
              >
                <div className="flex items-start">
                  <div className="text-gray-900">
                    <p className="text-xl font-medium uppercase tracking-wide">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-base text-gray-600 mt-1">{item.subtitle}</p>
                    )}
                    {item.speaker_performer && (
                      <p className="text-base text-gray-600 italic mt-1">{item.speaker_performer}</p>
                    )}
                    {item.is_congregation_participation && (
                      <p className="text-sm text-gray-500 mt-1">(All Stand)</p>
                    )}
                    {item.notes && (
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{item.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Sections */}
          {orderOfService.special_acknowledgements && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Special Acknowledgements</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{orderOfService.special_acknowledgements}</p>
            </div>
          )}

          {orderOfService.donations_in_lieu && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">In Lieu of Flowers</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{orderOfService.donations_in_lieu}</p>
            </div>
          )}

          {/* Interment Details */}
          {orderOfService.interment_location && !orderOfService.interment_private && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interment</h3>
              <p className="text-gray-700">{orderOfService.interment_location}</p>
              {orderOfService.interment_address && (
                <p className="text-gray-600 text-sm">{orderOfService.interment_address}</p>
              )}
              {orderOfService.interment_time && (
                <p className="text-gray-600 text-sm">{formatTime(orderOfService.interment_time)}</p>
              )}
            </div>
          )}

          {/* Reception Details */}
          {orderOfService.reception_venue && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reception</h3>
              <p className="text-gray-700">{orderOfService.reception_venue}</p>
              {orderOfService.reception_address && (
                <p className="text-gray-600 text-sm">{orderOfService.reception_address}</p>
              )}
              {orderOfService.reception_time && (
                <p className="text-gray-600 text-sm">{formatTime(orderOfService.reception_time)}</p>
              )}
            </div>
          )}

          {/* Footer Grid */}
          <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t-2 border-gray-200">
            {/* Left Column - Pallbearers */}
            <div>
              {orderOfService.pallbearers && orderOfService.pallbearers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Pallbearers</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {orderOfService.pallbearers.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {orderOfService.honorary_pallbearers && orderOfService.honorary_pallbearers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Honorary Pallbearers</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {orderOfService.honorary_pallbearers.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {orderOfService.flower_bearers && orderOfService.flower_bearers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Flower Bearers</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {orderOfService.flower_bearers.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Funeral Service */}
            <div className="text-right">
              {orderOfService.funeral_home_name && (
                <div>
                  {orderOfService.funeral_home_logo_url && (
                    <img
                      src={orderOfService.funeral_home_logo_url}
                      alt={orderOfService.funeral_home_name}
                      className="h-12 ml-auto mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {orderOfService.funeral_home_name}
                  </h3>
                  {orderOfService.funeral_home_address && (
                    <p className="text-sm text-gray-700 mb-1">{orderOfService.funeral_home_address}</p>
                  )}
                  {orderOfService.funeral_home_phone && (
                    <p className="text-sm text-gray-700 mb-1">{orderOfService.funeral_home_phone}</p>
                  )}
                  {orderOfService.funeral_home_website && (
                    <p className="text-sm text-gray-700 mb-1">{orderOfService.funeral_home_website}</p>
                  )}
                  {orderOfService.funeral_home_email && (
                    <p className="text-sm text-gray-700">{orderOfService.funeral_home_email}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {orderOfService.additional_notes && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic text-center whitespace-pre-wrap">
                {orderOfService.additional_notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
