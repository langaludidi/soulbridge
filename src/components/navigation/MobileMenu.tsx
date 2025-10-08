/**
 * MobileMenu Component
 * iOS 26 Liquid Glass Mobile Navigation Menu
 *
 * Features:
 * - Slide-in animation from right
 * - Full-height glass overlay
 * - Staggered menu item animations
 * - Smooth close transitions
 * - Touch-optimized spacing
 * - Body scroll lock when open
 * - Click outside to close
 */

'use client';

import { X, Plus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GlassButton } from '@/components/ui/glass';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
  showCTA?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

const defaultMenuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Browse Memorials', href: '/browse' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function MobileMenu({
  isOpen,
  onClose,
  menuItems = defaultMenuItems,
  showCTA = true,
  ctaLabel = 'Create Memorial',
  ctaHref = '/memorial/create',
}: MobileMenuProps) {
  const pathname = usePathname();

  // Lock body scroll when menu is open
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

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Check if link is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  // Animation variants
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

  const menuVariants = {
    hidden: {
      x: '100%',
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  const itemVariants = {
    hidden: {
      x: 50,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
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
              'fixed inset-0 z-50',
              'bg-black/40 backdrop-blur-glass-sm'
            )}
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed top-0 right-0 bottom-0 z-50',
              'w-full max-w-sm',
              'bg-white/90 backdrop-blur-glass-xl backdrop-saturate-[180%]',
              'border-l border-white/40',
              'shadow-glass-xl',
              'overflow-y-auto overscroll-contain'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={cn(
                'sticky top-0 z-10',
                'flex items-center justify-between',
                'p-6 pb-4',
                'bg-white/80 backdrop-blur-glass-lg',
                'border-b border-white/40'
              )}
            >
              <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Menu
              </h2>
              <button
                onClick={onClose}
                className={cn(
                  'flex items-center justify-center',
                  'w-10 h-10 rounded-full',
                  'bg-glass-ultralight backdrop-blur-glass-sm',
                  'border border-glass-subtle',
                  'hover:bg-glass-light hover:border-glass',
                  'active:scale-95',
                  'transition-all duration-200'
                )}
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-6 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative flex items-center justify-between',
                        'px-5 py-4 rounded-glass',
                        'text-base font-medium',
                        'transition-all duration-200',
                        active && [
                          'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
                          'border border-purple-300/30',
                          'shadow-glass-sm',
                          'text-purple-700',
                        ],
                        !active && [
                          'text-gray-700',
                          'hover:bg-glass-ultralight',
                          'hover:text-gray-900',
                          'active:scale-[0.98]',
                        ]
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <Icon
                            className={cn(
                              'h-5 w-5 transition-transform duration-200',
                              active && 'scale-110',
                              !active && 'group-hover:scale-110'
                            )}
                          />
                        )}
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <div className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                            {item.badge}
                          </div>
                        )}
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-all duration-200',
                            active
                              ? 'opacity-100 translate-x-0'
                              : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                          )}
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* CTA Button */}
            {showCTA && (
              <motion.div
                variants={itemVariants}
                className="p-6 pt-0 space-y-3"
              >
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                <Link href={ctaHref} className="block">
                  <GlassButton
                    variant="glass-accent"
                    size="lg"
                    className="w-full shadow-glass-lg"
                  >
                    <Plus className="h-5 w-5" />
                    {ctaLabel}
                  </GlassButton>
                </Link>
              </motion.div>
            )}

            {/* Footer Info */}
            <motion.div
              variants={itemVariants}
              className="p-6 pt-0 pb-8 text-center"
            >
              <p className="text-sm text-gray-500">
                SoulBridge &copy; {new Date().getFullYear()}
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
