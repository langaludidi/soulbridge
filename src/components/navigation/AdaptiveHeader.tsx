/**
 * AdaptiveHeader Component
 * iOS 26 Liquid Glass Navigation with Adaptive States
 *
 * States:
 * - EXPANDED: Full height (h-32), all elements visible
 * - COMPACT: Reduced height (h-16), condensed layout
 * - HIDDEN: Slides up when scrolling down, reappears on scroll up or hover
 *
 * Features:
 * - Liquid glass material with frosted transparency
 * - Smooth state transitions (0.4s cubic-bezier)
 * - Scroll direction detection
 * - Hover near top detection
 * - Responsive mobile menu
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { GlassButton } from '@/components/ui/glass';
import { Menu, X, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type HeaderState = 'expanded' | 'compact' | 'hidden';

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Browse', href: '/browse' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function AdaptiveHeader() {
  const pathname = usePathname();
  const { scrollDirection, scrollY, isAtTop, isNearTop } = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerState, setHeaderState] = useState<HeaderState>('expanded');
  const [isHoveringTop, setIsHoveringTop] = useState(false);

  // Determine header state based on scroll position and direction
  useEffect(() => {
    if (isAtTop) {
      setHeaderState('expanded');
    } else if (scrollDirection === 'down' && scrollY > 200 && !isHoveringTop) {
      setHeaderState('hidden');
    } else if (scrollDirection === 'up' || isHoveringTop) {
      setHeaderState(isNearTop ? 'expanded' : 'compact');
    } else if (scrollY > 100 && scrollY < 200) {
      setHeaderState('compact');
    }
  }, [scrollDirection, scrollY, isAtTop, isNearTop, isHoveringTop]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Hover Detection Area - Shows header when cursor near top */}
      <div
        className="fixed top-0 left-0 right-0 h-24 z-40 pointer-events-auto"
        onMouseEnter={() => setIsHoveringTop(true)}
        onMouseLeave={() => setIsHoveringTop(false)}
      />

      {/* Adaptive Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full',
          'transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          // Liquid Glass Styling
          'bg-white/80 backdrop-blur-[40px] backdrop-saturate-[180%]',
          'border-b border-white/40',
          'shadow-glass-sm',
          // Height based on state
          headerState === 'expanded' && 'h-32',
          headerState === 'compact' && 'h-16',
          headerState === 'hidden' && 'h-0 opacity-0 -translate-y-full'
        )}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href="/"
              className={cn(
                'flex items-center gap-3 transition-all duration-[400ms]',
                headerState === 'compact' && 'scale-90'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg transition-all duration-[400ms]',
                  headerState === 'expanded' && 'w-12 h-12',
                  headerState === 'compact' && 'w-10 h-10'
                )}
              >
                <Sparkles
                  className={cn(
                    'text-white transition-all duration-[400ms]',
                    headerState === 'expanded' && 'h-6 w-6',
                    headerState === 'compact' && 'h-5 w-5'
                  )}
                />
              </div>
              <span
                className={cn(
                  'font-serif font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-[400ms]',
                  headerState === 'expanded' && 'text-3xl',
                  headerState === 'compact' && 'text-xl'
                )}
              >
                SoulBridge
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-glass text-sm font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-glass-light text-foreground shadow-glass-inset'
                      : 'text-muted-foreground hover:text-foreground hover:bg-glass-ultralight'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="flex items-center gap-2">
              <Link href="/memorial/create" className="hidden sm:block">
                <GlassButton
                  variant="glass-accent"
                  size={headerState === 'compact' ? 'sm' : 'md'}
                  className={cn(
                    'transition-all duration-[400ms]',
                    headerState === 'compact' && 'px-3'
                  )}
                >
                  {headerState === 'expanded' ? (
                    <>
                      <Plus className="h-5 w-5" />
                      Create Memorial
                    </>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </GlassButton>
              </Link>

              {/* Mobile Menu Button */}
              <GlassButton
                variant="glass-ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </GlassButton>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Glass Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-glass-xl animate-in fade-in duration-300" />

          {/* Slide-out Menu */}
          <div
            className={cn(
              'absolute top-32 left-0 right-0 bottom-0',
              'bg-white/90 backdrop-blur-glass-xl',
              'border-t border-white/40',
              'shadow-glass-lg',
              'animate-in slide-in-from-top duration-300',
              'overflow-y-auto'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="container mx-auto px-4 py-8 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center px-6 py-4 rounded-glass text-lg font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-glass-light text-foreground shadow-glass-md shadow-glass-inset'
                      : 'text-muted-foreground hover:bg-glass-ultralight hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile CTA */}
              <div className="pt-6">
                <Link href="/memorial/create" className="block">
                  <GlassButton
                    variant="glass-accent"
                    size="lg"
                    className="w-full"
                  >
                    <Plus className="h-5 w-5" />
                    Create Memorial
                  </GlassButton>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
