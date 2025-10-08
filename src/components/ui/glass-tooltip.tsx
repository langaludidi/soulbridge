/**
 * GlassTooltip Component
 * iOS 26 Liquid Glass Tooltip with Framer Motion
 *
 * Features:
 * - Smooth fade and scale animations
 * - Multiple positioning options (top, bottom, left, right)
 * - Glass morphism styling with blur
 * - Arrow indicator pointing to trigger element
 * - Delay on show/hide for better UX
 * - Hover and focus support
 * - Portal rendering for z-index management
 */

'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipVariant = 'light' | 'dark';

interface GlassTooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  delay?: number;
  offset?: number;
  disabled?: boolean;
  className?: string;
}

export function GlassTooltip({
  children,
  content,
  position = 'top',
  variant = 'dark',
  delay = 200,
  offset = 8,
  disabled = false,
  className,
}: GlassTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Update tooltip position
  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = rect.left + rect.width / 2;
        y = rect.top - offset;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2;
        y = rect.bottom + offset;
        break;
      case 'left':
        x = rect.left - offset;
        y = rect.top + rect.height / 2;
        break;
      case 'right':
        x = rect.right + offset;
        y = rect.top + rect.height / 2;
        break;
    }

    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    if (disabled) return;

    updatePosition();
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    if (disabled) return;
    updatePosition();
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  // Animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.15,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  // Position-based transform origin
  const getTransformOrigin = () => {
    switch (position) {
      case 'top':
        return 'bottom';
      case 'bottom':
        return 'top';
      case 'left':
        return 'right';
      case 'right':
        return 'left';
      default:
        return 'center';
    }
  };

  // Position-based alignment
  const getAlignment = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return { left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%)' };
    }
  };

  // Arrow position
  const getArrowStyles = () => {
    const arrowSize = 6;

    switch (position) {
      case 'top':
        return {
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid ${
            variant === 'dark' ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'
          }`,
        };
      case 'bottom':
        return {
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid ${
            variant === 'dark' ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'
          }`,
        };
      case 'left':
        return {
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid ${
            variant === 'dark' ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'
          }`,
        };
      case 'right':
        return {
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid ${
            variant === 'dark' ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'
          }`,
        };
    }
  };

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed',
            top: position === 'top' ? coords.y : position === 'bottom' ? coords.y : coords.y,
            left: position === 'left' ? coords.x : position === 'right' ? coords.x : coords.x,
            zIndex: 9999,
            pointerEvents: 'none',
            transformOrigin: getTransformOrigin(),
            ...getAlignment(),
          }}
        >
          <div
            className={cn(
              'relative px-3 py-2 rounded-glass text-sm font-medium shadow-glass-lg',
              'backdrop-blur-glass-md',
              'whitespace-nowrap',
              variant === 'dark' && [
                'bg-gray-900/90',
                'text-white',
                'border border-white/10',
              ],
              variant === 'light' && [
                'bg-white/90',
                'text-gray-900',
                'border border-gray-900/10',
              ],
              className
            )}
          >
            {content}

            {/* Arrow */}
            <div
              className="absolute"
              style={getArrowStyles()}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="inline-flex"
      >
        {children}
      </div>

      {mounted && createPortal(tooltipContent, document.body)}
    </>
  );
}

// Convenience wrapper components
export function GlassTooltipTop(props: Omit<GlassTooltipProps, 'position'>) {
  return <GlassTooltip {...props} position="top" />;
}

export function GlassTooltipBottom(props: Omit<GlassTooltipProps, 'position'>) {
  return <GlassTooltip {...props} position="bottom" />;
}

export function GlassTooltipLeft(props: Omit<GlassTooltipProps, 'position'>) {
  return <GlassTooltip {...props} position="left" />;
}

export function GlassTooltipRight(props: Omit<GlassTooltipProps, 'position'>) {
  return <GlassTooltip {...props} position="right" />;
}
