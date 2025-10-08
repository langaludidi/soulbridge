/**
 * FloatingToolbar Component
 * iOS 26 Liquid Glass Action Toolbar for Memorial Pages
 *
 * Features:
 * - Fixed bottom-right position with glass morphism
 * - Quick action buttons with tooltips
 * - Badge notifications for pending actions
 * - Smooth hover and click animations
 * - Auto-hide on scroll down (optional)
 * - Expandable/collapsible on mobile
 */

'use client';

import { Flame, MessageSquare, Share2, Download, Plus, X, LucideIcon } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Action {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  badge?: number;
  variant?: 'default' | 'primary' | 'success';
}

interface FloatingToolbarProps {
  actions?: Action[];
  autoHide?: boolean;
  expandable?: boolean;
}

const defaultActions: Action[] = [
  {
    id: 'candle',
    label: 'Light Candle',
    icon: Flame,
    onClick: () => console.log('Light candle'),
    variant: 'primary',
  },
  {
    id: 'memory',
    label: 'Add Memory',
    icon: MessageSquare,
    onClick: () => console.log('Add memory'),
    badge: 3,
  },
  {
    id: 'share',
    label: 'Share',
    icon: Share2,
    onClick: () => console.log('Share'),
  },
  {
    id: 'download',
    label: 'Download',
    icon: Download,
    onClick: () => console.log('Download'),
  },
];

export function FloatingToolbar({
  actions = defaultActions,
  autoHide = false,
  expandable = true,
}: FloatingToolbarProps) {
  const { scrollDirection, scrollY } = useScrollDirection();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Determine visibility based on scroll
  const isVisible = autoHide ? scrollDirection !== 'down' || scrollY < 100 : true;

  // Toggle expansion on mobile
  const handleToggle = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      )}
    >
      {/* Mobile Toggle Button (shown when collapsed) */}
      {expandable && !isExpanded && (
        <button
          onClick={handleToggle}
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-full',
            'bg-gradient-to-br from-purple-600 to-pink-600',
            'text-white shadow-glass-lg',
            'hover:scale-110 active:scale-95',
            'transition-all duration-200',
            'md:hidden'
          )}
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Toolbar Container */}
      <div
        className={cn(
          'flex flex-col gap-3',
          'transition-all duration-300',
          expandable && !isExpanded && 'md:flex hidden'
        )}
      >
        {/* Close Button (mobile only, when expanded) */}
        {expandable && isExpanded && (
          <button
            onClick={handleToggle}
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-full',
              'bg-white/80 backdrop-blur-glass-md',
              'border border-white/40',
              'shadow-glass-sm shadow-glass-inset',
              'hover:bg-white/90 active:scale-95',
              'transition-all duration-200',
              'md:hidden'
            )}
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Action Buttons */}
        {actions.map((action) => {
          const Icon = action.icon;
          const isHovered = showTooltip === action.id;

          return (
            <div key={action.id} className="relative group">
              {/* Tooltip */}
              <div
                className={cn(
                  'absolute right-full mr-3 top-1/2 -translate-y-1/2',
                  'px-3 py-2 rounded-glass whitespace-nowrap',
                  'bg-gray-900/90 backdrop-blur-glass-md',
                  'text-white text-sm font-medium',
                  'shadow-glass-lg',
                  'transition-all duration-200',
                  'pointer-events-none',
                  isHovered
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2'
                )}
              >
                {action.label}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900/90" />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={action.onClick}
                onMouseEnter={() => setShowTooltip(action.id)}
                onMouseLeave={() => setShowTooltip(null)}
                className={cn(
                  'relative flex items-center justify-center',
                  'w-14 h-14 rounded-full',
                  'transition-all duration-200',
                  'hover:scale-110 active:scale-95',
                  'shadow-glass-md',
                  // Variant styles
                  action.variant === 'primary' && [
                    'bg-gradient-to-br from-purple-600 to-pink-600',
                    'text-white',
                    'shadow-purple-500/30',
                  ],
                  action.variant === 'success' && [
                    'bg-gradient-to-br from-green-500 to-emerald-600',
                    'text-white',
                    'shadow-green-500/30',
                  ],
                  !action.variant && [
                    'bg-white/80 backdrop-blur-glass-md',
                    'border border-white/40',
                    'text-gray-700',
                    'shadow-glass-inset',
                    'hover:bg-white/90',
                  ]
                )}
              >
                <Icon className="h-5 w-5" />

                {/* Badge */}
                {action.badge !== undefined && action.badge > 0 && (
                  <div
                    className={cn(
                      'absolute -top-1 -right-1',
                      'min-w-[20px] h-5 px-1.5',
                      'flex items-center justify-center',
                      'bg-red-500 text-white',
                      'text-xs font-bold',
                      'rounded-full',
                      'shadow-md',
                      'animate-in zoom-in duration-200'
                    )}
                  >
                    {action.badge > 99 ? '99+' : action.badge}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
