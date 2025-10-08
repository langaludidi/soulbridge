"use client";

import { AdaptiveHeader } from "@/components/navigation/AdaptiveHeader";
import { GlassCard, GlassButton } from "@/components/ui/glass";
import {
  GlassTooltip,
  GlassTooltipTop,
  GlassTooltipBottom,
  GlassTooltipLeft,
  GlassTooltipRight,
} from "@/components/ui/glass-tooltip";
import {
  Heart,
  Share2,
  Download,
  Info,
  Settings,
  User,
  Bell,
  Sparkles,
  Flame,
  MessageSquare,
} from "lucide-react";

export default function TooltipDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <AdaptiveHeader />

      <div className="container mx-auto px-4 py-40 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="font-serif text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Glass Tooltip Demo
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            iOS 26 Liquid Glass tooltips with Framer Motion animations, multiple
            positions, and beautiful blur effects
          </p>
        </section>

        {/* Position Demo */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Tooltip Positions
            </h2>

            <div className="flex items-center justify-center min-h-[400px]">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                {/* Center reference point */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                  Hover
                </div>

                {/* Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                  <GlassTooltipTop content="Tooltip on Top" variant="dark">
                    <GlassButton variant="glass" size="sm">
                      Top
                    </GlassButton>
                  </GlassTooltipTop>
                </div>

                {/* Bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <GlassTooltipBottom content="Tooltip on Bottom" variant="dark">
                    <GlassButton variant="glass" size="sm">
                      Bottom
                    </GlassButton>
                  </GlassTooltipBottom>
                </div>

                {/* Left */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <GlassTooltipLeft content="Tooltip on Left" variant="dark">
                    <GlassButton variant="glass" size="sm">
                      Left
                    </GlassButton>
                  </GlassTooltipLeft>
                </div>

                {/* Right */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <GlassTooltipRight content="Tooltip on Right" variant="dark">
                    <GlassButton variant="glass" size="sm">
                      Right
                    </GlassButton>
                  </GlassTooltipRight>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Variant Demo */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Dark vs Light Variants
            </h2>

            <div className="flex items-center justify-center gap-12">
              <GlassTooltip content="Dark glass tooltip" variant="dark">
                <GlassButton variant="glass-dark" size="lg">
                  Dark Tooltip
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Light glass tooltip" variant="light">
                <GlassButton variant="glass" size="lg">
                  Light Tooltip
                </GlassButton>
              </GlassTooltip>
            </div>
          </GlassCard>
        </section>

        {/* Icon Buttons with Tooltips */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Icon Buttons with Tooltips
            </h2>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <GlassTooltip content="Light a candle" position="top">
                <GlassButton variant="glass-accent" size="icon">
                  <Flame className="h-5 w-5" />
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Add a memory" position="top">
                <GlassButton variant="glass" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Share memorial" position="top">
                <GlassButton variant="glass" size="icon">
                  <Share2 className="h-5 w-5" />
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Download photos" position="top">
                <GlassButton variant="glass" size="icon">
                  <Download className="h-5 w-5" />
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Information" position="top">
                <GlassButton variant="glass" size="icon">
                  <Info className="h-5 w-5" />
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Settings" position="top">
                <GlassButton variant="glass" size="icon">
                  <Settings className="h-5 w-5" />
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Profile" position="top">
                <GlassButton variant="glass" size="icon">
                  <User className="h-5 w-5" />
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Notifications" position="top">
                <GlassButton variant="glass" size="icon">
                  <Bell className="h-5 w-5" />
                </GlassButton>
              </GlassTooltip>
            </div>
          </GlassCard>
        </section>

        {/* Complex Content Tooltips */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Rich Content Tooltips
            </h2>

            <div className="flex items-center justify-center gap-8">
              <GlassTooltip
                content={
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-400" />
                    <span>Click to favorite</span>
                  </div>
                }
                position="top"
              >
                <GlassButton variant="glass" size="lg">
                  <Heart className="h-5 w-5" />
                  Favorite
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip
                content={
                  <div className="space-y-1">
                    <div className="font-semibold">Premium Feature</div>
                    <div className="text-xs opacity-80">Upgrade to access</div>
                  </div>
                }
                position="top"
              >
                <GlassButton variant="glass-accent" size="lg">
                  <Sparkles className="h-5 w-5" />
                  Premium
                </GlassButton>
              </GlassTooltip>
            </div>
          </GlassCard>
        </section>

        {/* Delay Demo */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Custom Delay
            </h2>

            <div className="flex items-center justify-center gap-8">
              <GlassTooltip content="No delay (instant)" delay={0}>
                <GlassButton variant="glass" size="md">
                  No Delay
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Default 200ms delay" delay={200}>
                <GlassButton variant="glass" size="md">
                  Default (200ms)
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="Long 500ms delay" delay={500}>
                <GlassButton variant="glass" size="md">
                  Long Delay (500ms)
                </GlassButton>
              </GlassTooltip>
            </div>
          </GlassCard>
        </section>

        {/* Disabled State */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Disabled Tooltip
            </h2>

            <div className="flex items-center justify-center gap-8">
              <GlassTooltip content="This tooltip is enabled">
                <GlassButton variant="glass" size="md">
                  Enabled Tooltip
                </GlassButton>
              </GlassTooltip>

              <GlassTooltip content="You won't see this" disabled>
                <GlassButton variant="glass" size="md" disabled>
                  Disabled Tooltip
                </GlassButton>
              </GlassTooltip>
            </div>
          </GlassCard>
        </section>

        {/* Features List */}
        <section>
          <GlassCard
            variant="light"
            blur="xl"
            elevation="high"
            className="max-w-4xl mx-auto p-12"
          >
            <h2 className="font-serif text-3xl font-bold mb-6 text-center">
              Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>Framer Motion animations with scale + fade</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>4 position options (top, bottom, left, right)</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>Light and dark variants</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>Customizable delay timing</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>Portal rendering for proper z-index</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>Arrow indicator pointing to trigger</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>Supports rich content (not just strings)</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>Hover and focus support</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>Glass morphism with backdrop blur</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <span>Smooth cubic-bezier transitions</span>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Spacer */}
        <div className="h-32" />
      </div>
    </div>
  );
}
