/**
 * Obituary Component
 * iOS 26 Liquid Glass Obituary Section
 *
 * Features:
 * - Rich text content with glass card
 * - Expandable/collapsible for long content
 * - Reading Mode for distraction-free viewing
 * - Smooth animations
 * - Print-friendly layout
 * - Share obituary functionality
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassButton } from '@/components/ui/glass';
import { FileText, ChevronDown, ChevronUp, Share2, Printer, BookOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ObituaryProps {
  content: string;
  author?: string;
  publishedDate?: string;
  maxHeight?: number;
  onShare?: () => void;
  onPrint?: () => void;
  className?: string;
}

export function Obituary({
  content,
  author,
  publishedDate,
  maxHeight = 400,
  onShare,
  onPrint,
  className,
}: ObituaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);

  // Check if content is long enough to need expansion
  const checkOverflow = (element: HTMLDivElement | null) => {
    if (element) {
      setIsOverflowing(element.scrollHeight > maxHeight);
    }
  };

  const contentVariants = {
    collapsed: {
      height: maxHeight,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    expanded: {
      height: 'auto',
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter((p) => p.trim());

  // Reading Mode View
  if (isReadingMode) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white overflow-auto"
        >
          <div className="max-w-3xl mx-auto py-20 px-8">
            {/* Exit Button */}
            <button
              onClick={() => setIsReadingMode(false)}
              className={cn(
                'mb-8 flex items-center gap-2',
                'text-gray-600 hover:text-gray-900',
                'transition-colors duration-200'
              )}
            >
              <X className="h-5 w-5" />
              Exit Reading Mode
            </button>

            {/* Reading Mode Content */}
            <article className="prose prose-lg max-w-none">
              <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">
                Life Story
              </h1>

              {author && (
                <p className="text-gray-600 mb-8">
                  Written by {author}
                  {publishedDate && ` • Published ${publishedDate}`}
                </p>
              )}

              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="mb-6 text-lg leading-relaxed text-gray-700 font-serif"
                >
                  {para}
                </p>
              ))}
            </article>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <section id="obituary" className={cn('scroll-mt-32', className)}>
      <GlassCard
        variant="light"
        blur="xl"
        elevation="high"
        className="max-w-4xl mx-auto p-8 md:p-12"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Obituary
              </h2>
              <p className="text-gray-600 mt-1">Life story and legacy</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <GlassButton
              variant="glass"
              size="sm"
              onClick={() => setIsReadingMode(true)}
              className="shadow-glass-md"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Reading Mode</span>
            </GlassButton>

            {onShare && (
              <GlassButton
                variant="glass"
                size="sm"
                onClick={onShare}
                className="shadow-glass-md"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </GlassButton>
            )}
            <GlassButton
              variant="glass"
              size="sm"
              onClick={handlePrint}
              className="shadow-glass-md"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </GlassButton>
          </div>
        </div>

        {/* Metadata */}
        {(author || publishedDate) && (
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
            {author && <span>Written by {author}</span>}
            {author && publishedDate && <span>•</span>}
            {publishedDate && <span>Published {publishedDate}</span>}
          </div>
        )}

        {/* Content */}
        <div className="relative">
          <motion.div
            ref={checkOverflow}
            variants={contentVariants}
            initial={false}
            animate={isExpanded ? 'expanded' : 'collapsed'}
            className={cn(
              'prose prose-lg max-w-none',
              'prose-headings:font-serif prose-headings:font-bold',
              'prose-p:text-gray-700 prose-p:leading-relaxed',
              'prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline',
              !isExpanded && 'overflow-hidden'
            )}
          >
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="whitespace-pre-wrap"
            />
          </motion.div>

          {/* Fade overlay when collapsed */}
          <AnimatePresence>
            {!isExpanded && isOverflowing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Expand/Collapse Button */}
        {isOverflowing && (
          <div className="flex justify-center mt-6">
            <GlassButton
              variant="glass"
              size="md"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shadow-glass-md"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-5 w-5" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-5 w-5" />
                  Read More
                </>
              )}
            </GlassButton>
          </div>
        )}

        {/* Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Footer Quote */}
        <div className="mt-8 text-center">
          <p className="font-serif text-lg italic text-gray-600">
            &ldquo;Those we love don&rsquo;t go away, they walk beside us every day.&rdquo;
          </p>
        </div>
      </GlassCard>
    </section>
  );
}
