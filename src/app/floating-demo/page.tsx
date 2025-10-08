"use client";

import { AdaptiveHeader } from "@/components/navigation/AdaptiveHeader";
import { FloatingTabBar } from "@/components/navigation/FloatingTabBar";
import { FloatingToolbar } from "@/components/navigation/FloatingToolbar";
import { GlassCard } from "@/components/ui/glass";
import { FileText, Images, Heart, Clock, Sparkles, User, MapPin, Calendar } from "lucide-react";

export default function FloatingDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Adaptive Header */}
      <AdaptiveHeader />

      {/* Floating Tab Bar - appears after scrolling 400px */}
      <FloatingTabBar />

      {/* Floating Toolbar - fixed bottom-right */}
      <FloatingToolbar autoHide={false} expandable={true} />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-40 pb-20">
        <div className="text-center space-y-6 mb-20">
          <h1 className="font-serif text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Floating Navigation Demo
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Experience iOS 26 Liquid Glass floating navigation components with
            smooth scrolling, auto-detection, and beautiful animations
          </p>
        </div>

        {/* Instructions Card */}
        <GlassCard
          variant="light"
          blur="xl"
          elevation="high"
          className="max-w-4xl mx-auto p-12 mb-20"
        >
          <h2 className="font-serif text-3xl font-bold mb-6 text-center">
            How to Test
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">📍 Floating Tab Bar</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Appears after scrolling 400px down</li>
                <li>• Hides when scrolling down</li>
                <li>• Reveals when scrolling up</li>
                <li>• Click tabs to jump to sections</li>
                <li>• Active tab auto-detects based on scroll</li>
                <li>• Sliding indicator shows active tab</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">🛠️ Floating Toolbar</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Fixed to bottom-right corner</li>
                <li>• Hover for action tooltips</li>
                <li>• Badge notifications on icons</li>
                <li>• Expandable/collapsible on mobile</li>
                <li>• Smooth hover animations</li>
                <li>• Multiple action variants</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Memorial Content Sections */}
      <div className="container mx-auto px-4 space-y-20 pb-20">
        {/* Obituary Section */}
        <section id="obituary" className="scroll-mt-32">
          <GlassCard
            variant="light"
            blur="lg"
            elevation="medium"
            className="max-w-4xl mx-auto p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-4xl font-bold">Obituary</h2>
                <p className="text-gray-600">Life story and legacy</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="mb-6">
                <h3 className="font-serif text-3xl font-bold mb-2">
                  In Loving Memory
                </h3>
                <div className="flex items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>1945 - 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Cape Town, South Africa</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque
                ipsa quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="scroll-mt-32">
          <GlassCard
            variant="light"
            blur="lg"
            elevation="medium"
            className="max-w-4xl mx-auto p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                <Images className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-4xl font-bold">Gallery</h2>
                <p className="text-gray-600">Cherished moments in photos</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-glass bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center"
                >
                  <Sparkles className="h-12 w-12 text-white opacity-50" />
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Memories Section */}
        <section id="memories" className="scroll-mt-32">
          <GlassCard
            variant="light"
            blur="lg"
            elevation="medium"
            className="max-w-4xl mx-auto p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-4xl font-bold">Memories</h2>
                <p className="text-gray-600">Stories from loved ones</p>
              </div>
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <GlassCard
                  key={i}
                  variant="ultralight"
                  blur="sm"
                  className="p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Family Member {i}</h3>
                      <p className="text-sm text-gray-600 mb-2">2 days ago</p>
                      <p className="text-gray-700">
                        A beautiful memory shared by a loved one. They will
                        always be remembered for their kindness and warm smile.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="scroll-mt-32">
          <GlassCard
            variant="light"
            blur="lg"
            elevation="medium"
            className="max-w-4xl mx-auto p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-4xl font-bold">Timeline</h2>
                <p className="text-gray-600">Life milestones and events</p>
              </div>
            </div>

            <div className="space-y-8">
              {[
                { year: "1945", event: "Born in Cape Town" },
                { year: "1968", event: "Graduated University" },
                { year: "1972", event: "Started Career" },
                { year: "1980", event: "Family Milestone" },
                { year: "2024", event: "Peacefully Passed" },
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                      {item.year}
                    </div>
                    {index < 4 && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-purple-300 to-pink-300" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-semibold text-lg mb-1">{item.event}</h3>
                    <p className="text-gray-600">
                      Important life milestone and memorable moment.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Spacer for testing scroll */}
        <div className="h-96" />
      </div>
    </div>
  );
}
