/**
 * PhotoGallery Component
 * Clean photo grid with lightbox
 * Professional design matching reference
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Upload, Play } from 'lucide-react';
import { Photo } from '@/types/memorial';

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
  allowUpload?: boolean;
}

export function PhotoGallery({ photos, className = '', allowUpload = false }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    }
  };

  const prevPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  };

  if (!photos || photos.length === 0) {
    return (
      <section id="photos" className={`scroll-mt-24 ${className}`}>
        <div className="max-w-4xl mx-auto px-6 py-12 bg-white">
          <div className="mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Photo Gallery
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>
          <div className="text-center py-12 text-gray-500">
            <p>No photos have been added yet.</p>
            {allowUpload && (
              <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Upload Photo
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="photos" className={`scroll-mt-24 ${className}`}>
        <div className="max-w-6xl mx-auto px-6 py-12 bg-white">
          {/* Section Header */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Photo Gallery
              </h2>
              <div className="w-20 h-1 bg-primary rounded-full" />
            </div>
            {allowUpload && (
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Upload className="w-4 h-4" />
                Add Photo
              </button>
            )}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity group"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || 'Memorial photo'}
                  fill
                  className="object-cover"
                />

                {/* Video Play Button Overlay */}
                {photo.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-900 ml-1" />
                    </div>
                  </div>
                )}

                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm line-clamp-2">{photo.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous Button */}
          {selectedPhoto > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Next Button */}
          {selectedPhoto < photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Image/Video */}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              {photos[selectedPhoto].type === 'video' ? (
                <video
                  src={photos[selectedPhoto].url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={photos[selectedPhoto].url}
                  alt={photos[selectedPhoto].caption || 'Memorial photo'}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>

          {/* Caption */}
          {photos[selectedPhoto].caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
              <p className="text-white text-lg">{photos[selectedPhoto].caption}</p>
              {photos[selectedPhoto].uploadedBy && (
                <p className="text-white/70 text-sm mt-2">
                  Uploaded by {photos[selectedPhoto].uploadedBy}
                </p>
              )}
            </div>
          )}

          {/* Photo Counter */}
          <div className="absolute top-4 left-4 bg-white/10 px-3 py-1 rounded-full">
            <p className="text-white text-sm">
              {selectedPhoto + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
