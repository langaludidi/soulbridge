'use client';

import { useState } from 'react';

interface Photo {
  id: string;
  media_url: string;
  caption: string | null;
  created_at: string;
}

interface GallerySectionProps {
  memorialId: string;
  initialPhotos: Photo[];
}

export default function GallerySection({ memorialId, initialPhotos }: GallerySectionProps) {
  const [photos] = useState<Photo[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-[#c9d1e3] dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Photo Gallery ({photos.length})
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
            >
              <img
                src={photo.media_url}
                alt={photo.caption || 'Memorial photo'}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedPhoto.media_url}
              alt={selectedPhoto.caption || 'Memorial photo'}
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            {selectedPhoto.caption && (
              <p className="text-white text-center mt-4 text-lg">
                {selectedPhoto.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
