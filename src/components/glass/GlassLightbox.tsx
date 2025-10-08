/**
 * GlassLightbox Component
 * iOS 26 Liquid Glass Image Lightbox
 *
 * Features:
 * - Full-screen image viewer with glass backdrop
 * - Smooth zoom animations
 * - Navigation between images
 * - Download and share actions
 * - Keyboard navigation (arrow keys, ESC)
 * - Swipe gestures on mobile
 * - Image info overlay
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
  uploadedBy?: string;
  uploadedDate?: string;
}

interface GlassLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (image: LightboxImage, index: number) => void;
  onShare?: (image: LightboxImage, index: number) => void;
}

export function GlassLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  onDownload,
  onShare,
}: GlassLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const currentImage = images[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setZoom(1);
    }
  }, [currentIndex, images.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setZoom(1);
    }
  }, [currentIndex]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrevious]);

  // Swipe gestures
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      goToPrevious();
    } else if (info.offset.x < -swipeThreshold) {
      goToNext();
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
    },
  };

  const lightboxContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Glass Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className={cn(
              'fixed inset-0 z-[100]',
              'bg-black/80 backdrop-blur-glass-xl backdrop-saturate-[120%]'
            )}
          />

          {/* Lightbox Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                'fixed top-6 right-6 z-10',
                'flex items-center justify-center',
                'w-12 h-12 rounded-full',
                'bg-white/90 backdrop-blur-glass-md',
                'border border-white/60',
                'shadow-glass-xl',
                'hover:bg-white hover:scale-110',
                'active:scale-95',
                'transition-all duration-200'
              )}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6 text-gray-900" />
            </button>

            {/* Image Counter */}
            <div
              className={cn(
                'fixed top-6 left-6 z-10',
                'px-4 py-2 rounded-full',
                'bg-white/90 backdrop-blur-glass-md',
                'border border-white/60',
                'shadow-glass-lg',
                'text-sm font-medium text-gray-900'
              )}
            >
              {currentIndex + 1} / {images.length}
            </div>

            {/* Action Buttons - Top Right */}
            <div className="fixed top-6 right-24 z-10 flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={cn(
                  'flex items-center justify-center',
                  'w-12 h-12 rounded-full',
                  'border border-white/60',
                  'shadow-glass-lg',
                  'hover:scale-110',
                  'active:scale-95',
                  'transition-all duration-200',
                  showInfo
                    ? 'bg-purple-500/90 backdrop-blur-glass-md'
                    : 'bg-white/90 backdrop-blur-glass-md'
                )}
                aria-label="Toggle info"
              >
                <Info className={cn('h-5 w-5', showInfo ? 'text-white' : 'text-gray-900')} />
              </button>

              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className={cn(
                  'flex items-center justify-center',
                  'w-12 h-12 rounded-full',
                  'bg-white/90 backdrop-blur-glass-md',
                  'border border-white/60',
                  'shadow-glass-lg',
                  'hover:bg-white hover:scale-110',
                  'active:scale-95',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-200'
                )}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5 text-gray-900" />
              </button>

              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className={cn(
                  'flex items-center justify-center',
                  'w-12 h-12 rounded-full',
                  'bg-white/90 backdrop-blur-glass-md',
                  'border border-white/60',
                  'shadow-glass-lg',
                  'hover:bg-white hover:scale-110',
                  'active:scale-95',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-200'
                )}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5 text-gray-900" />
              </button>

              {onDownload && (
                <button
                  onClick={() => onDownload(currentImage, currentIndex)}
                  className={cn(
                    'flex items-center justify-center',
                    'w-12 h-12 rounded-full',
                    'bg-white/90 backdrop-blur-glass-md',
                    'border border-white/60',
                    'shadow-glass-lg',
                    'hover:bg-white hover:scale-110',
                    'active:scale-95',
                    'transition-all duration-200'
                  )}
                  aria-label="Download image"
                >
                  <Download className="h-5 w-5 text-gray-900" />
                </button>
              )}

              {onShare && (
                <button
                  onClick={() => onShare(currentImage, currentIndex)}
                  className={cn(
                    'flex items-center justify-center',
                    'w-12 h-12 rounded-full',
                    'bg-white/90 backdrop-blur-glass-md',
                    'border border-white/60',
                    'shadow-glass-lg',
                    'hover:bg-white hover:scale-110',
                    'active:scale-95',
                    'transition-all duration-200'
                  )}
                  aria-label="Share image"
                >
                  <Share2 className="h-5 w-5 text-gray-900" />
                </button>
              )}
            </div>

            {/* Previous Button */}
            {currentIndex > 0 && (
              <button
                onClick={goToPrevious}
                className={cn(
                  'fixed left-6 top-1/2 -translate-y-1/2 z-10',
                  'flex items-center justify-center',
                  'w-14 h-14 rounded-full',
                  'bg-white/90 backdrop-blur-glass-md',
                  'border border-white/60',
                  'shadow-glass-xl',
                  'hover:bg-white hover:scale-110',
                  'active:scale-95',
                  'transition-all duration-200'
                )}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-7 w-7 text-gray-900" />
              </button>
            )}

            {/* Next Button */}
            {currentIndex < images.length - 1 && (
              <button
                onClick={goToNext}
                className={cn(
                  'fixed right-6 top-1/2 -translate-y-1/2 z-10',
                  'flex items-center justify-center',
                  'w-14 h-14 rounded-full',
                  'bg-white/90 backdrop-blur-glass-md',
                  'border border-white/60',
                  'shadow-glass-xl',
                  'hover:bg-white hover:scale-110',
                  'active:scale-95',
                  'transition-all duration-200'
                )}
                aria-label="Next image"
              >
                <ChevronRight className="h-7 w-7 text-gray-900" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={currentIndex}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="relative max-w-[90vw] max-h-[85vh] cursor-grab active:cursor-grabbing"
              style={{ scale: zoom }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  width={1200}
                  height={800}
                  className="object-contain max-h-[85vh] w-auto h-auto rounded-glass shadow-glass-xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Info Panel */}
            <AnimatePresence>
              {showInfo && (currentImage.caption || currentImage.uploadedBy || currentImage.uploadedDate) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className={cn(
                    'fixed bottom-6 left-1/2 -translate-x-1/2 z-10',
                    'max-w-2xl w-full mx-4',
                    'p-6 rounded-glass',
                    'bg-white/90 backdrop-blur-glass-xl',
                    'border border-white/60',
                    'shadow-glass-xl'
                  )}
                >
                  {currentImage.caption && (
                    <p className="text-lg font-medium text-gray-900 mb-3">
                      {currentImage.caption}
                    </p>
                  )}
                  {(currentImage.uploadedBy || currentImage.uploadedDate) && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      {currentImage.uploadedBy && <span>Uploaded by {currentImage.uploadedBy}</span>}
                      {currentImage.uploadedBy && currentImage.uploadedDate && <span>•</span>}
                      {currentImage.uploadedDate && <span>{currentImage.uploadedDate}</span>}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(lightboxContent, document.body);
}
