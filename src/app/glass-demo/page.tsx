"use client";

import { useState } from "react";
import {
  GlassCard,
  GlassButton,
  GlassModal,
  GlassNavBar,
  GlassPanel,
  GlassInput,
} from "@/components/ui/glass";
import {
  Sparkles,
  Heart,
  Share2,
  Settings,
  User,
  Bell,
  Search,
  Menu,
} from "lucide-react";

export default function GlassDemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Glass Navigation Bar */}
      <GlassNavBar variant="light" blur="xl" className="mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GlassButton
                variant="glass-ghost"
                size="icon"
                onClick={() => setSidePanelOpen(!sidePanelOpen)}
              >
                <Menu className="h-5 w-5" />
              </GlassButton>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SoulBridge
              </span>
            </div>

            <div className="flex items-center gap-2">
              <GlassButton variant="glass-ghost" size="icon">
                <Search className="h-5 w-5" />
              </GlassButton>
              <GlassButton variant="glass-ghost" size="icon">
                <Bell className="h-5 w-5" />
              </GlassButton>
              <GlassButton variant="glass-ghost" size="icon">
                <User className="h-5 w-5" />
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassNavBar>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Liquid Glass Design System
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            iOS 26 inspired glass morphism components with frosted transparency,
            dynamic blur, and elegant depth
          </p>
        </div>

        {/* Glass Cards Showcase */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Glass Cards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Light Variant */}
            <GlassCard variant="light" blur="md" elevation="medium" className="p-6">
              <Sparkles className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Light Glass</h3>
              <p className="text-sm text-gray-600">
                Perfect for light backgrounds with subtle transparency
              </p>
            </GlassCard>

            {/* Interactive Card */}
            <GlassCard
              variant="light"
              blur="lg"
              elevation="high"
              interactive
              glow
              className="p-6"
            >
              <Heart className="h-8 w-8 text-pink-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Interactive + Glow</h3>
              <p className="text-sm text-gray-600">
                Hover for scale effect and glowing border
              </p>
            </GlassCard>

            {/* Shimmer Card */}
            <GlassCard
              variant="ultralight"
              blur="xl"
              elevation="medium"
              shimmer
              className="p-6"
            >
              <Share2 className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Shimmer Effect</h3>
              <p className="text-sm text-gray-600">
                Hover to see the light sweep animation
              </p>
            </GlassCard>

            {/* Ultra Light */}
            <GlassCard
              variant="ultralight"
              blur="sm"
              elevation="low"
              rounded="lg"
              className="p-6"
            >
              <Settings className="h-8 w-8 text-gray-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Ultra Light</h3>
              <p className="text-sm text-gray-600">
                Maximum transparency with minimal blur
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Glass Buttons Showcase */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Glass Buttons
          </h2>

          <div className="flex flex-wrap gap-4">
            <GlassButton variant="glass" size="md">
              Light Glass Button
            </GlassButton>

            <GlassButton variant="glass-dark" size="md">
              Dark Glass Button
            </GlassButton>

            <GlassButton variant="glass-accent" size="md">
              <Sparkles className="h-5 w-5" />
              Accent Glass
            </GlassButton>

            <GlassButton variant="glass-ghost" size="md">
              Ghost Glass
            </GlassButton>

            <GlassButton variant="glass" size="sm">
              Small
            </GlassButton>

            <GlassButton variant="glass-accent" size="lg">
              <Heart className="h-5 w-5" />
              Large Button
            </GlassButton>

            <GlassButton variant="glass" size="icon">
              <Share2 className="h-5 w-5" />
            </GlassButton>
          </div>
        </section>

        {/* Glass Input Showcase */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Glass Inputs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <GlassInput
              variant="light"
              placeholder="Light glass input..."
            />

            <GlassInput
              variant="dark"
              placeholder="Dark glass input..."
            />
          </div>
        </section>

        {/* Memorial Card Example */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Memorial Card Example
          </h2>

          <GlassCard
            variant="light"
            blur="lg"
            elevation="high"
            interactive
            glow
            className="max-w-2xl mx-auto overflow-hidden"
          >
            <div className="aspect-video bg-gradient-to-br from-purple-200 to-pink-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                  <Heart className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-3xl font-bold text-gray-800">
                    In Loving Memory
                  </h3>
                  <p className="text-gray-600 text-lg">1945 - 2024</p>
                </div>
                <div className="flex gap-2">
                  <GlassButton variant="glass-ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </GlassButton>
                  <GlassButton variant="glass-ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </GlassButton>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                A beautiful soul who touched the lives of everyone they met. Their
                kindness, wisdom, and love will forever remain in our hearts.
              </p>

              <div className="flex gap-3">
                <GlassButton variant="glass-accent" size="md">
                  <Sparkles className="h-5 w-5" />
                  Light a Candle
                </GlassButton>
                <GlassButton variant="glass" size="md">
                  Share Memory
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Modal Trigger */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            Glass Modal
          </h2>

          <GlassButton
            variant="glass-accent"
            size="lg"
            onClick={() => setModalOpen(true)}
          >
            Open Glass Modal
          </GlassButton>
        </section>
      </div>

      {/* Side Panel */}
      {sidePanelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setSidePanelOpen(false)}
        >
          <GlassPanel
            variant="light"
            blur="xl"
            side="left"
            elevation="high"
            className="w-80 h-full p-6 animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold mb-6">Menu</h3>
            <nav className="space-y-2">
              {["Dashboard", "Memorials", "Settings", "Support"].map((item) => (
                <GlassButton
                  key={item}
                  variant="glass-ghost"
                  className="w-full justify-start"
                >
                  {item}
                </GlassButton>
              ))}
            </nav>
          </GlassPanel>
        </div>
      )}

      {/* Glass Modal */}
      <GlassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant="light"
        blur="xl"
      >
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold">Glass Modal</h3>
              <p className="text-gray-600">
                Beautiful frosted glass effect with blur
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <GlassInput variant="light" placeholder="Your name..." />
            <GlassInput variant="light" placeholder="Your email..." />
          </div>

          <div className="flex gap-3">
            <GlassButton
              variant="glass-accent"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Confirm
            </GlassButton>
            <GlassButton
              variant="glass"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
