'use client';

interface TimelineEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: string;
  image_url: string | null;
}

interface TimelineSectionProps {
  events: TimelineEvent[];
}

export default function TimelineSection({ events }: TimelineSectionProps) {
  if (events.length === 0) {
    return null;
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'birth':
        return '🎂';
      case 'graduation':
        return '🎓';
      case 'marriage':
        return '💍';
      case 'career':
        return '💼';
      case 'achievement':
        return '🏆';
      case 'travel':
        return '✈️';
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'hobby':
        return '🎨';
      default:
        return '📅';
    }
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-[#d6d6d6] dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Life Timeline
      </h2>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#bcccdc] dark:bg-[#243342]"></div>

        {/* Timeline Events */}
        <div className="space-y-8">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex gap-6">
              {/* Year Badge */}
              <div className="flex-shrink-0 w-16 text-right">
                <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-semibold">
                  {formatYear(event.event_date)}
                </span>
              </div>

              {/* Icon Circle */}
              <div className="flex-shrink-0 w-16 h-16 bg-[#2B3E50] dark:bg-indigo-500 rounded-full flex items-center justify-center text-2xl shadow-lg z-10">
                {getEventIcon(event.event_type)}
              </div>

              {/* Event Content */}
              <div className="flex-1 pb-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFullDate(event.event_date)}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {event.description}
                    </p>
                  )}

                  {event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full max-w-md rounded-lg mt-3"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
