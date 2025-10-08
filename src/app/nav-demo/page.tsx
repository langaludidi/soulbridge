"use client";

import { AdaptiveHeader } from "@/components/navigation/AdaptiveHeader";
import { GlassCard } from "@/components/ui/glass";
import { ArrowDown, MousePointer2, Scroll, Eye } from "lucide-react";

export default function NavigationDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Adaptive Header */}
      <AdaptiveHeader />

      {/* Content */}
      <div className="container mx-auto px-4 py-40 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-20">
          <h1 className="font-serif text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Adaptive Navigation Demo
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Scroll down to see the iOS 26 Liquid Glass header adapt to your
            scrolling behavior
          </p>

          <div className="flex items-center justify-center gap-2 text-muted-foreground animate-bounce">
            <ArrowDown className="h-5 w-5" />
            <span>Scroll to see the magic</span>
            <ArrowDown className="h-5 w-5" />
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard
            variant="light"
            blur="lg"
            elevation="medium"
            className="p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Scroll className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold">Scroll Detection</h3>
            <p className="text-gray-600">
              Header automatically expands when at top, compacts when scrolling,
              and hides when scrolling down quickly.
            </p>
          </GlassCard>

          <GlassCard
            variant="light"
            blur="lg"
            elevation="medium"
            className="p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <MousePointer2 className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold">Hover Detection</h3>
            <p className="text-gray-600">
              Move your cursor to the top of the screen to reveal the header,
              even when it's hidden from scrolling.
            </p>
          </GlassCard>

          <GlassCard
            variant="light"
            blur="lg"
            elevation="medium"
            className="p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold">State Transitions</h3>
            <p className="text-gray-600">
              Smooth 400ms cubic-bezier transitions between expanded, compact,
              and hidden states with glass morphism effects.
            </p>
          </GlassCard>
        </section>

        {/* Testing Instructions */}
        <section className="max-w-4xl mx-auto">
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="p-12 space-y-8"
          >
            <h2 className="font-serif text-4xl font-bold text-center">
              Test the Adaptive Header
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                    1
                  </span>
                  Expanded State
                </h3>
                <p className="text-gray-600 ml-10">
                  At the top of the page, the header is fully expanded (h-32)
                  showing the full logo, all navigation items, and the "Create
                  Memorial" button with text.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold text-sm">
                    2
                  </span>
                  Compact State
                </h3>
                <p className="text-gray-600 ml-10">
                  Scroll down slowly. When you reach about 100-200px, the header
                  compacts to h-16 with a smaller logo and condensed layout.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                    3
                  </span>
                  Hidden State
                </h3>
                <p className="text-gray-600 ml-10">
                  Continue scrolling down past 200px. The header will slide up
                  and disappear to give you more viewing space.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold text-sm">
                    4
                  </span>
                  Scroll Up to Reveal
                </h3>
                <p className="text-gray-600 ml-10">
                  Scroll up at any time to bring back the header in compact mode.
                  Scroll all the way to the top to see it expand again.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                    5
                  </span>
                  Hover at Top
                </h3>
                <p className="text-gray-600 ml-10">
                  When the header is hidden, move your cursor to the very top of
                  the screen. The header will reveal itself instantly!
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                    6
                  </span>
                  Mobile Menu
                </h3>
                <p className="text-gray-600 ml-10">
                  On mobile (&lt; 768px), tap the hamburger menu to see the slide-
                  out glass navigation panel.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Spacer Content for Scrolling */}
        {[1, 2, 3, 4, 5].map((section) => (
          <section key={section} className="py-20">
            <GlassCard
              variant="light"
              blur="md"
              elevation="medium"
              className="p-12 text-center"
            >
              <h3 className="font-serif text-3xl font-bold mb-4">
                Section {section}
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Keep scrolling to test the adaptive header behavior. Notice how
                it smoothly transitions between states, hides when you scroll
                down, and reappears when you scroll up or hover near the top.
              </p>
            </GlassCard>
          </section>
        ))}

        {/* Glass Material Details */}
        <section className="max-w-4xl mx-auto">
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="p-12 space-y-6"
          >
            <h2 className="font-serif text-4xl font-bold text-center">
              Liquid Glass Material
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-2">
                <h4 className="font-semibold">Background</h4>
                <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                  rgba(255, 255, 255, 0.8)
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Backdrop Filter</h4>
                <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                  blur(40px) saturate(180%)
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Border</h4>
                <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                  1px solid rgba(255, 255, 255, 0.4)
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Shadow</h4>
                <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                  0 8px 32px rgba(0, 0, 0, 0.12)
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Transition</h4>
                <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                  400ms cubic-bezier(0.4, 0, 0.2, 1)
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Height Transitions</h4>
                <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                  h-32 → h-16 → h-0
                </code>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Footer Spacer */}
        <div className="h-96" />
      </div>
    </div>
  );
}
