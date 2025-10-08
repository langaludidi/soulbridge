/**
 * GlassImageCard Component
 * iOS 26 Liquid Glass Image Card
 *
 * Features:
 * - Image/Video with glass overlay on hover
 * - Caption and metadata
 * - Click to open lightbox or play video
 * - Smooth animations
 * - Lazy loading support
 * - Aspect ratio variants
 * - Video play indicator
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, Heart, Download, Share2, Calendar, User, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

type AspectRatio = 'square' | 'portrait' | 'landscape' | 'auto';
type MediaType = 'photo' | 'video';

interface GlassImageCardProps {
  src: string;
  alt: string;
  type?: MediaType;
  caption?: string;
  uploadedBy?: string;
  uploadedDate?: string;
  aspectRatio?: AspectRatio;
  priority?: boolean;
  onClick?: () => void;
  onView?: () => void;
  onLike?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  liked?: boolean;
  likeCount?: number;
  className?: string;
}

export function GlassImageCard({
  src,
  alt,
  type = 'photo',
  caption,
  uploadedBy,
  uploadedDate,
  aspectRatio = 'square',
  priority = false,
  onClick,
  onView,
  onLike,
  onDownload,
  onShare,
  liked = false,
  likeCount = 0,
  className,
}: GlassImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle click - prioritize onClick prop, fallback to onView
  const handleClick = onClick || onView;

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'landscape':
        return 'aspect-[4/3]';
      case 'auto':
        return 'aspect-auto';
      default:
        return 'aspect-square';
    }
  };

  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: i * 0.05,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'group relative rounded-glass overflow-hidden',
        'bg-white/80 backdrop-blur-glass-md',
        'border border-white/40',
        'shadow-glass-sm hover:shadow-glass-lg',
        'transition-all duration-300',
        handleClick && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div
        className={cn(
          'relative w-full overflow-hidden bg-gray-100',
          getAspectRatioClass()
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            'object-cover transition-all duration-500',
            imageLoaded ? 'blur-0' : 'blur-lg'
          )}
          priority={priority}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Video Play Icon (Static) */}
        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-glass-md flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-900 ml-1" />
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action Buttons Overlay (optional, shown on hover if callbacks provided) */}
        {(onLike || onDownload || onShare) && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate={isHovered ? 'visible' : 'hidden'}
            className={cn(
              'absolute inset-0',
              'bg-black/40 backdrop-blur-glass-sm backdrop-saturate-[150%]',
              'flex items-center justify-center'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Buttons */}
            <div className="flex items-center gap-2">{onLike && (
              <motion.button
                custom={0}
                variants={buttonVariants}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                className={cn(
                  'flex items-center justify-center',
                  'w-12 h-12 rounded-full',
                  'border border-white/60',
                  'shadow-glass-lg',
                  'hover:scale-110',
                  'active:scale-95',
                  'transition-all duration-200',
                  liked
                    ? 'bg-red-500/90 backdrop-blur-glass-md hover:bg-red-500'
                    : 'bg-white/90 backdrop-blur-glass-md hover:bg-white'
                )}
                aria-label="Like image"
              >
                <Heart
                  className={cn(
                    'h-5 w-5 transition-colors',
                    liked ? 'text-white fill-white' : 'text-gray-900'
                  )}
                />
              </motion.button>
            )}

            {onDownload && (
              <motion.button
                custom={1}
                variants={buttonVariants}
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
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
              </motion.button>
            )}

            {onShare && (
              <motion.button
                custom={2}
                variants={buttonVariants}
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
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
              </motion.button>
            )}
            </div>
          </motion.div>
        )}

        {/* Like count badge */}
        {likeCount > 0 && (
          <div
            className={cn(
              'absolute top-3 right-3',
              'px-3 py-1 rounded-full',
              'bg-black/60 backdrop-blur-glass-sm',
              'border border-white/20',
              'flex items-center gap-1.5',
              'text-white text-sm font-medium'
            )}
          >
            <Heart className={cn('h-3.5 w-3.5', liked && 'fill-red-500 text-red-500')} />
            <span>{likeCount}</span>
          </div>
        )}
      </div>

      {/* Caption and Metadata */}
      {(caption || uploadedBy || uploadedDate) && (
        <div
          className={cn(
            'p-4 space-y-2',
            'bg-white/60 backdrop-blur-glass-md',
            'border-t border-glass-subtle'
          )}
        >
          {caption && (
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {caption}
            </p>
          )}

          {(uploadedBy || uploadedDate) && (
            <div className="flex items-center gap-3 text-xs text-gray-600">
              {uploadedBy && (
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{uploadedBy}</span>
                </div>
              )}
              {uploadedBy && uploadedDate && <span>•</span>}
              {uploadedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{uploadedDate}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
