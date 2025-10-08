/**
 * FloatingTabBar Component
 * iOS 26 Liquid Glass Tab Navigation for Memorial Pages
 *
 * Features:
 * - Sticky positioning with glass morphism
 * - Auto-hide on scroll down, reveal on scroll up
 * - Active tab indicator with smooth sliding animation
 * - Smooth scroll to sections
 * - Intersection observer for active tab detection
 * - Touch-optimized spacing
 */

'use client';

import { FileText, Images, Heart, Clock, LucideIcon } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

const tabs: Tab[] = [
  { id: 'obituary', label: 'Obituary', icon: FileText, href: '#obituary' },
  { id: 'gallery', label: 'Gallery', icon: Images, href: '#gallery' },
  { id: 'memories', label: 'Memories', icon: Heart, href: '#memories' },
  { id: 'timeline', label: 'Timeline', icon: Clock, href: '#timeline' },
];

export function FloatingTabBar() {
  const { scrollDirection, scrollY } = useScrollDirection();
  const [activeTab, setActiveTab] = useState('obituary');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Update active indicator position
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  // Setup intersection observer for auto-detecting active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -66%',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (tabs.some((tab) => tab.id === id)) {
            setActiveTab(id);
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    tabs.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Smooth scroll to section
  const handleTabClick = (href: string, id: string) => {
    setActiveTab(id);

    const element = document.querySelector(href);
    if (element) {
      const yOffset = -100; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  };

  // Determine visibility
  const isVisible = scrollY > 400 && scrollDirection !== 'down';

  return (
    <div
      className={cn(
        'fixed top-20 left-1/2 -translate-x-1/2 z-40',
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
      )}
    >
      <nav
        className={cn(
          'relative flex items-center gap-1 p-2',
          // Liquid Glass Styling
          'bg-white/80 backdrop-blur-glass-xl backdrop-saturate-[180%]',
          'border border-white/40',
          'rounded-glass-lg',
          'shadow-glass-lg shadow-glass-inset'
        )}
      >
        {/* Sliding Active Indicator */}
        <div
          className={cn(
            'absolute top-2 h-[calc(100%-16px)] rounded-glass',
            'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
            'border border-purple-300/50',
            'shadow-glass-sm',
            'transition-all duration-300 ease-out',
            'pointer-events-none'
          )}
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />

        {/* Tab Buttons */}
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              onClick={() => handleTabClick(tab.href, tab.id)}
              className={cn(
                'relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-glass',
                'text-sm font-medium whitespace-nowrap',
                'transition-all duration-200',
                'hover:bg-white/40',
                'active:scale-95',
                isActive
                  ? 'text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-all duration-200',
                  isActive && 'scale-110'
                )}
              />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
