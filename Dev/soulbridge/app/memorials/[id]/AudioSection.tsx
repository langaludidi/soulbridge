'use client';

import { useState } from 'react';

interface Audio {
  id: string;
  media_url: string;
  caption: string | null;
  created_at: string;
}

interface AudioSectionProps {
  memorialId: string;
  initialAudios: Audio[];
}

export default function AudioSection({ memorialId, initialAudios }: AudioSectionProps) {
  const [audios] = useState<Audio[]>(initialAudios);
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (audios.length === 0) {
    return null;
  }

  const handlePlay = (audioId: string) => {
    setPlayingId(audioId);
  };

  const handlePause = () => {
    setPlayingId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Audio Recordings ({audios.length})
      </h2>

      <div className="space-y-4">
        {audios.map((audio) => (
          <div
            key={audio.id}
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  playingId === audio.id
                    ? 'bg-green-600 animate-pulse'
                    : 'bg-green-500'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title/Caption */}
                {audio.caption && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {audio.caption}
                  </h3>
                )}

                {/* Audio Player */}
                <audio
                  controls
                  src={audio.media_url}
                  onPlay={() => handlePlay(audio.id)}
                  onPause={handlePause}
                  onEnded={handlePause}
                  className="w-full mb-2"
                  style={{
                    height: '40px',
                    borderRadius: '8px',
                  }}
                />

                {/* Date */}
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Added {new Date(audio.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Message */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Audio recordings help preserve the voice and memories of your loved one. Share favorite songs, voice messages, or meaningful audio clips.
          </p>
        </div>
      </div>
    </div>
  );
}
