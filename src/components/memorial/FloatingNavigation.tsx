/**
 * FloatingNavigation Component
 * Modern floating glass-style navigation with auto-hide on scroll
 * Includes haptic feedback and smooth animations
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Edit,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  Users,
  Heart,
  Palette
} from 'lucide-react';

interface FloatingNavigationProps {
  onThemeClick?: () => void;
}

const navItems = [
  { id: 'obituary', label: 'Obituary', icon: BookOpen },
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'memories', label: 'Memories', icon: MessageSquare },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'family', label: 'Family', icon: Users },
];

export function FloatingNavigation({ onThemeClick }: FloatingNavigationProps) {
  const [activeTab, setActiveTab] = useState('obituary');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const slug = pathname?.split('/').pop();

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setIsVisible(false);
      } else {
        // Scrolling up - show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px' }
    );

    navItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setActiveTab(sectionId);

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="relative">
            {/* Glass container */}
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-full shadow-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                {/* Theme button */}
                <motion.button
                  onClick={() => {
                    onThemeClick?.();
                    if (navigator.vibrate) navigator.vibrate(10);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg"
                >
                  <Palette className="w-5 h-5" />
                </motion.button>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-300" />

                {/* Nav items */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`
                        relative w-10 h-10 rounded-full flex items-center justify-center transition-colors
                        ${isActive
                          ? 'text-white'
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 bg-primary rounded-full"
                          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        />
                      )}

                      <Icon className="w-5 h-5 relative z-10" />

                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                          {item.label}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}

                {/* Divider */}
                <div className="w-px h-8 bg-gray-300" />

                {/* Edit button */}
                <Link
                  href={`/memorial/edit/${slug}`}
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(10);
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl -z-10" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
