/**
 * ServicesSection Component
 * Memorial services listing with dates, times, locations, and RSVP
 * Clean card-based design matching reference
 */

'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Navigation, UserCheck } from 'lucide-react';
import type { Service } from '@/types/memorial';

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const [rsvpStatus, setRsvpStatus] = useState<{ [key: string]: boolean }>({});
  const [showRsvpForm, setShowRsvpForm] = useState<string | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleRSVP = async (serviceId: string, attending: boolean) => {
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: serviceId, attending }),
      });

      if (response.ok) {
        setRsvpStatus({ ...rsvpStatus, [serviceId]: attending });
        setShowRsvpForm(null);
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    }
  };

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">
        Services
      </h2>

      <div className="space-y-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {service.type}
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDate(service.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">
                    {service.startTime}
                    {service.endTime && ` - ${service.endTime}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    {service.location}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {service.address}
                  </p>
                </div>
              </div>

              {service.details && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 text-sm">
                    {service.details}
                  </p>
                </div>
              )}

              {service.directions && (
                <div className="mt-4">
                  <a
                    href={service.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              )}

              {/* RSVP Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                {rsvpStatus[service.id] !== undefined ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <UserCheck className="w-5 h-5" />
                    <p className="font-medium">
                      You {rsvpStatus[service.id] ? 'will' : 'will not'} be attending
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRSVP(service.id, true)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-delft-blue text-white rounded-lg hover:bg-delft-blue-600 transition-colors font-medium"
                    >
                      <UserCheck className="w-4 h-4" />
                      I'll Attend
                    </button>
                    <button
                      onClick={() => handleRSVP(service.id, false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Can't Attend
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
