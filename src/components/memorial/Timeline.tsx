/**
 * Timeline Component
 * Clean, respectful life timeline section
 *
 * Features:
 * - Vertical timeline with simple connecting line
 * - Consistent card-based design
 * - Year markers and event details
 * - Optional photos for events
 * - Smooth reveal animations
 * - Responsive design
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  year: string;
  date?: string;
  title: string;
  description: string;
  photo?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  return (
    <div className={cn(className)}>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">
        Life Timeline
      </h2>

      {events.length > 0 ? (
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gray-300" />

          {/* Timeline events */}
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="relative pl-12 md:pl-20">
                {/* Year marker */}
                <div className="absolute left-0 md:left-4 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border-4 border-gray-300 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                </div>

                {/* Event card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Event photo */}
                  {event.photo && (
                    <div className="relative w-full h-48">
                      <Image
                        src={event.photo}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Event content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{event.year}</span>
                          </div>
                          {event.date && (
                            <>
                              <span>•</span>
                              <span>{event.date}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">No timeline events yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Timeline events will appear here
          </p>
        </div>
      )}
    </div>
  );
}
