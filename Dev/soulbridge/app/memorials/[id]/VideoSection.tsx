'use client';

import { useState } from 'react';

interface Video {
  id: string;
  media_url: string;
  caption: string | null;
  created_at: string;
}

interface VideoSectionProps {
  memorialId: string;
  initialVideos: Video[];
}

export default function VideoSection({ memorialId, initialVideos }: VideoSectionProps) {
  const [videos] = useState<Video[]>(initialVideos);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-[#ede8e8] dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Videos ({videos.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="relative aspect-video cursor-pointer group overflow-hidden rounded-lg bg-black"
            >
              {/* Video Thumbnail */}
              <video
                src={video.media_url}
                className="w-full h-full object-cover"
                preload="metadata"
              />

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Caption */}
              {video.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent text-white p-3">
                  <p className="text-sm font-medium truncate">{video.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="max-w-5xl w-full relative" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={selectedVideo.media_url}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>

            {/* Caption */}
            {selectedVideo.caption && (
              <div className="mt-4 text-center">
                <p className="text-white text-lg">{selectedVideo.caption}</p>
              </div>
            )}

            {/* Date */}
            <p className="text-gray-400 text-sm text-center mt-2">
              Added {new Date(selectedVideo.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
