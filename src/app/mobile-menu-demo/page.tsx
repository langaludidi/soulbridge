"use client";

import { useState } from "react";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { GlassCard, GlassButton } from "@/components/ui/glass";
import {
  Menu,
  Home,
  Search,
  Heart,
  Settings,
  User,
  MessageSquare,
  Bell,
} from "lucide-react";

export default function MobileMenuDemoPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [customMenuOpen, setCustomMenuOpen] = useState(false);

  const customMenuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Browse', href: '/browse', icon: Search },
    { label: 'Favorites', href: '/favorites', icon: Heart, badge: 5 },
    { label: 'Messages', href: '/messages', icon: MessageSquare, badge: 3 },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: '12+' },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Fixed Mobile Menu Trigger */}
      <div className="fixed top-6 right-6 z-40">
        <GlassButton
          variant="glass-accent"
          size="icon"
          onClick={() => setMenuOpen(true)}
          className="shadow-glass-lg"
        >
          <Menu className="h-5 w-5" />
        </GlassButton>
      </div>

      {/* Default Mobile Menu */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="font-serif text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Mobile Menu Demo
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            iOS 26 Liquid Glass mobile navigation with smooth slide animations,
            staggered items, and beautiful glass morphism
          </p>

          <div className="flex items-center justify-center gap-4">
            <GlassButton
              variant="glass-accent"
              size="lg"
              onClick={() => setMenuOpen(true)}
              className="shadow-glass-lg"
            >
              <Menu className="h-5 w-5" />
              Open Default Menu
            </GlassButton>

            <GlassButton
              variant="glass"
              size="lg"
              onClick={() => setCustomMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              Open Custom Menu
            </GlassButton>
          </div>
        </section>

        {/* Features */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    ✓
                  </div>
                  Smooth Animations
                </h3>
                <p className="text-sm text-gray-600 ml-10">
                  Slide-in from right with 400ms cubic-bezier easing. Staggered
                  menu items create a cascading effect.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                    ✓
                  </div>
                  Glass Morphism
                </h3>
                <p className="text-sm text-gray-600 ml-10">
                  Frosted glass background with 60px blur, 180% saturation, and
                  semi-transparent white overlay.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    ✓
                  </div>
                  Body Scroll Lock
                </h3>
                <p className="text-sm text-gray-600 ml-10">
                  Prevents background scrolling when menu is open. Automatically
                  restores on close.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    ✓
                  </div>
                  Active Detection
                </h3>
                <p className="text-sm text-gray-600 ml-10">
                  Highlights current page with gradient background and purple
                  accent styling.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    ✓
                  </div>
                  Badge Support
                </h3>
                <p className="text-sm text-gray-600 ml-10">
                  Display notification counts or status badges on menu items.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    ✓
                  </div>
                  Icon Support
                </h3>
                <p className="text-sm text-gray-600 ml-10">
                  Optional icons for each menu item with scale animations on
                  hover and active states.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                    ✓
                  </div>
                  Click Outside Close
                </h3>
                <p className="text-sm text-gray-600 ml-10">
                  Tap the backdrop to close menu. Also closes on route
                  navigation.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    ✓
                  </div>
                  CTA Button
                </h3>
                <p className="text-sm text-gray-600 ml-10">
                  Optional call-to-action button at bottom with customizable
                  label and href.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Usage Examples */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Usage Examples
            </h2>

            <div className="space-y-8">
              {/* Basic Usage */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Basic Usage</h3>
                <pre className="bg-gray-100 p-4 rounded-glass text-sm overflow-x-auto">
{`import { MobileMenu } from '@/components/navigation/MobileMenu';

const [menuOpen, setMenuOpen] = useState(false);

<MobileMenu
  isOpen={menuOpen}
  onClose={() => setMenuOpen(false)}
/>`}
                </pre>
              </div>

              {/* Custom Menu Items */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Custom Menu Items with Icons & Badges
                </h3>
                <pre className="bg-gray-100 p-4 rounded-glass text-sm overflow-x-auto">
{`<MobileMenu
  isOpen={menuOpen}
  onClose={() => setMenuOpen(false)}
  menuItems={[
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Messages', href: '/messages', icon: MessageSquare, badge: 3 },
    { label: 'Settings', href: '/settings', icon: Settings }
  ]}
/>`}
                </pre>
              </div>

              {/* Custom CTA */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Custom CTA Button</h3>
                <pre className="bg-gray-100 p-4 rounded-glass text-sm overflow-x-auto">
{`<MobileMenu
  isOpen={menuOpen}
  onClose={() => setMenuOpen(false)}
  showCTA={true}
  ctaLabel="Get Started"
  ctaHref="/signup"
/>`}
                </pre>
              </div>

              {/* No CTA */}
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Without CTA Button
                </h3>
                <pre className="bg-gray-100 p-4 rounded-glass text-sm overflow-x-auto">
{`<MobileMenu
  isOpen={menuOpen}
  onClose={() => setMenuOpen(false)}
  showCTA={false}
/>`}
                </pre>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Animation Details */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Animation Timeline
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-20 font-mono text-sm text-purple-600 flex-shrink-0">
                  0ms
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Menu Opens</div>
                  <div className="text-sm text-gray-600">
                    Backdrop fades in (300ms), Menu slides from right (400ms)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 font-mono text-sm text-purple-600 flex-shrink-0">
                  100ms
                </div>
                <div className="flex-1">
                  <div className="font-semibold">First Item Appears</div>
                  <div className="text-sm text-gray-600">
                    Stagger delay + item animation (300ms slide + fade)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 font-mono text-sm text-purple-600 flex-shrink-0">
                  150ms
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Second Item</div>
                  <div className="text-sm text-gray-600">50ms stagger</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 font-mono text-sm text-purple-600 flex-shrink-0">
                  200ms
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Third Item</div>
                  <div className="text-sm text-gray-600">50ms stagger</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 font-mono text-sm text-purple-600 flex-shrink-0">
                  ~500ms
                </div>
                <div className="flex-1">
                  <div className="font-semibold">All Items Visible</div>
                  <div className="text-sm text-gray-600">
                    Complete animation with CTA button
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Spacer */}
        <div className="h-32" />
      </div>

      {/* Custom Mobile Menu */}
      <MobileMenu
        isOpen={customMenuOpen}
        onClose={() => setCustomMenuOpen(false)}
        menuItems={customMenuItems}
        showCTA={true}
        ctaLabel="Upgrade to Pro"
        ctaHref="/upgrade"
      />
    </div>
  );
}
