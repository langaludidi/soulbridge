'use client';

import AddPhotoForm from '@/app/memorials/[id]/AddPhotoForm';
import AddVideoForm from '@/app/memorials/[id]/AddVideoForm';
import AddAudioForm from '@/app/memorials/[id]/AddAudioForm';
import AddTimelineForm from '@/app/memorials/[id]/AddTimelineForm';

interface MediaActionPanelProps {
  memorialId: string;
  showTimeline?: boolean;
}

export default function MediaActionPanel({ memorialId, showTimeline = false }: MediaActionPanelProps) {
  const mediaActions = [
    {
      component: <AddPhotoForm memorialId={memorialId} />,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Photo',
      description: 'Add photos to the gallery',
      color: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      component: <AddVideoForm memorialId={memorialId} />,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Video',
      description: 'Share video memories',
      color: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      component: <AddAudioForm memorialId={memorialId} />,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
      title: 'Audio',
      description: 'Upload audio recordings',
      color: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
    },
  ];

  if (showTimeline) {
    mediaActions.push({
      component: <AddTimelineForm memorialId={memorialId} />,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Event',
      description: 'Add a life milestone',
      color: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Content</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Enrich this memorial with photos, videos, audio, and timeline events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mediaActions.map((action, index) => (
          <div
            key={index}
            className={`relative border-2 rounded-lg p-5 transition-all duration-200 ${action.color}`}
          >
            <div className={`mb-3 ${action.iconColor}`}>{action.icon}</div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{action.description}</p>
            <div>{action.component}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
