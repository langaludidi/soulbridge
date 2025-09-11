import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { MemorialCard } from "@/components/memorial-card";
import { CreateMemorialModal } from "@/components/create-memorial-modal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import type { Memorial } from "@shared/schema";

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  const { data: recentMemorials = [] } = useQuery<Memorial[]>({
    queryKey: ["/api/memorials"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Bridge Memories.<br />
              <span className="text-primary">Honour Legacies.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Create a beautiful online memorial to celebrate life and connect loved ones forever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="px-8 py-3" data-testid="button-home-create-memorial">
                  Create Memorial
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" size="lg" className="px-8 py-3" data-testid="button-home-browse-memorials">
                  Browse Memorials
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why SoulBridge Exists */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
              Why SoulBridge Exists
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              When someone passes away, families need a simple, beautiful way to share their legacy and connect those who loved them. But traditional methods are limited, and existing platforms often feel disconnected from our culture and values.
            </p>
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">🕯️</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Honour with dignity</h3>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Bridge families and memories</h3>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">♾️</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Preserve their legacy forever</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Sign Up & Choose a Package</h3>
              <p className="text-muted-foreground">Get started with a plan that fits your family's needs</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Add Photos, Stories & Tributes</h3>
              <p className="text-muted-foreground">Share their life story with photos and meaningful memories</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Share with Family & Friends</h3>
              <p className="text-muted-foreground">Invite loved ones to visit and contribute to the memorial</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/create">
              <Button size="lg" className="px-8 py-3" data-testid="button-how-it-works-cta">
                Create Memorial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Families Choose SoulBridge */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
              Why Families Choose SoulBridge
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              At SoulBridge, we understand that honouring a loved one's life is deeply personal. Here is how we help you create beautiful, meaningful memorials with ease and dignity.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Simple and Beautiful</h3>
              <p className="text-muted-foreground">Create stunning memorial pages easily, with no technical skills required.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🇿🇦</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Locally Rooted</h3>
              <p className="text-muted-foreground">Built for our communities, traditions, and cultures – your stories remain connected to home.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Private and Secure</h3>
              <p className="text-muted-foreground">Your family's memories and tributes are protected with the highest standards of security and privacy.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Always Accessible</h3>
              <p className="text-muted-foreground">View and update your loved one's memorial anytime, from any device, wherever you are.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Memorials */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
              Beautiful Memorials Created by Families
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Celebrating the lives and legacies of those who have touched our hearts
            </p>
          </div>
          
          {recentMemorials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentMemorials.slice(0, 6).map((memorial) => (
                <MemorialCard key={memorial.id} memorial={memorial} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No memorials available yet.</p>
              <Link href="/create">
                <Button data-testid="button-create-first-home">
                  Create the First Memorial
                </Button>
              </Link>
            </div>
          )}

          {recentMemorials.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/browse">
                <Button variant="outline" size="lg" className="px-8 py-3" data-testid="button-view-all-memorials">
                  View All Memorials
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
              Ready to Create a Memorial?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create a beautiful memorial page to celebrate their life and keep their memory alive forever.
            </p>
            <Link href="/create">
              <Button size="lg" className="px-8 py-3" data-testid="button-final-cta-create">
                Create a memorial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CreateMemorialModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
