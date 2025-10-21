'use client';

import { format, parseISO } from 'date-fns';

interface MemorialService {
  id: string;
  service_type: string;
  title?: string;
  service_date: string;
  service_time?: string;
  location_name?: string;
  address?: string;
  city?: string;
  state_province?: string;
  country?: string;
  details?: string;
  virtual_link?: string;
  requires_rsvp?: boolean;
  max_attendees?: number;
  is_private?: boolean;
}

interface MemorialServicesProps {
  services: MemorialService[];
  isOwner?: boolean;
  onAdd?: () => void;
  onEdit?: (service: MemorialService) => void;
  onDelete?: (id: string) => void;
}

export default function MemorialServices({
  services,
  isOwner = false,
  onAdd,
  onEdit,
  onDelete,
}: MemorialServicesProps) {
  const getServiceIcon = (type: string) => {
    const icons: Record<string, string> = {
      funeral: '⚰️',
      memorial_service: '🕯️',
      celebration_of_life: '🌟',
      visitation: '👥',
      unveiling: '🪦',
      other: '📅',
    };
    return icons[type] || '📅';
  };

  const getServiceTypeName = (type: string) => {
    const names: Record<string, string> = {
      funeral: 'Funeral Service',
      memorial_service: 'Memorial Service',
      celebration_of_life: 'Celebration of Life',
      visitation: 'Visitation/Viewing',
      unveiling: 'Unveiling Ceremony',
      other: 'Other Service',
    };
    return names[type] || type;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      // Parse time string (HH:mm:ss format)
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    } catch {
      return timeString;
    }
  };

  const getFullAddress = (service: MemorialService) => {
    const parts = [];
    if (service.address) parts.push(service.address);
    if (service.city) parts.push(service.city);
    if (service.state_province) parts.push(service.state_province);
    if (service.country) parts.push(service.country);
    return parts.join(', ');
  };

  if (services.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p className="mb-4">No memorial services scheduled yet.</p>
          {isOwner && onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Memorial Service
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h2>
        {isOwner && onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center px-3 py-2 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </button>
        )}
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Service Type and Title */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{getServiceIcon(service.service_type)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {service.title || getServiceTypeName(service.service_type)}
                    </h3>
                    {service.title && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getServiceTypeName(service.service_type)}
                      </p>
                    )}
                    {service.is_private && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mt-1">
                        🔒 Private
                      </span>
                    )}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">{formatDate(service.service_date)}</span>
                    {service.service_time && (
                      <>
                        <span className="text-gray-400">at</span>
                        <span className="font-medium">{formatTime(service.service_time)}</span>
                      </>
                    )}
                  </div>

                  {/* Location */}
                  {service.location_name && (
                    <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="font-medium">{service.location_name}</div>
                        {getFullAddress(service) && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">{getFullAddress(service)}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Virtual Link */}
                  {service.virtual_link && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href={service.virtual_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2B3E50] dark:text-[#9FB89D] hover:underline"
                      >
                        Join Virtual Service
                      </a>
                    </div>
                  )}

                  {/* RSVP */}
                  {service.requires_rsvp && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span>
                        RSVP Required
                        {service.max_attendees && ` (Max ${service.max_attendees} attendees)`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                {service.details && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{service.details}</p>
                  </div>
                )}
              </div>

              {/* Actions (Owner Only) */}
              {isOwner && (onEdit || onDelete) && (
                <div className="flex gap-2 ml-4">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(service)}
                      className="p-2 text-gray-600 hover:text-[#2B3E50] dark:text-gray-400 dark:hover:text-[#9FB89D]"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to delete this ${getServiceTypeName(service.service_type).toLowerCase()}?`
                          )
                        ) {
                          onDelete(service.id);
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
