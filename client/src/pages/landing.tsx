import { useState } from "react";
import { MemorialCard } from "@/components/memorial-card";
import { CreateMemorialModal } from "@/components/create-memorial-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Memorial } from "@shared/schema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: recentMemorials = [] } = useQuery<Memorial[]>({
    queryKey: ["/api/memorials"],
  });

  const featuredMemorials = recentMemorials.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1380')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="hero-text text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
              Bridge Memories.<br />
              <span className="text-accent">Honour Legacies.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
              Create a beautiful online memorial to celebrate life and connect loved ones forever.
            </p>

            {/* Search and Create Section */}
            <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground text-center md:text-left">Search Memorials</h3>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Enter name or location"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 px-4 py-3 text-base w-full"
                      data-testid="input-search-memorials"
                    />
                    <Link href={`/browse${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}>
                      <Button className="w-full h-12 text-base" data-testid="button-search-memorials">
                        Search Memorials
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground text-center md:text-left">Create Memorial</h3>
                  <div className="space-y-4">
                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                      <SelectTrigger className="h-12 px-4 py-3 text-base w-full" data-testid="select-province">
                        <SelectValue placeholder="Select Province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                        <SelectItem value="free-state">Free State</SelectItem>
                        <SelectItem value="gauteng">Gauteng</SelectItem>
                        <SelectItem value="kwazulu-natal">KwaZulu-Natal</SelectItem>
                        <SelectItem value="limpopo">Limpopo</SelectItem>
                        <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                        <SelectItem value="northern-cape">Northern Cape</SelectItem>
                        <SelectItem value="north-west">North West</SelectItem>
                        <SelectItem value="western-cape">Western Cape</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      className="w-full h-12 text-base"
                      onClick={() => setShowCreateModal(true)}
                      data-testid="button-create-memorial"
                    >
                      Create Memorial
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SoulBridge Exists */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
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
              <div className="w-16 h-16 mx-auto bg-chart-4/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Simple and Beautiful</h3>
              <p className="text-muted-foreground">Create stunning memorial pages easily, with no technical skills required.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🇿🇦</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Locally Rooted</h3>
              <p className="text-muted-foreground">Built for our communities, traditions, and cultures – your stories remain connected to home.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Private and Secure</h3>
              <p className="text-muted-foreground">Your family's memories and tributes are protected with the highest standards of security and privacy.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-chart-5/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Always Accessible</h3>
              <p className="text-muted-foreground">View and update your loved one's memorial anytime, from any device, wherever you are.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Memorials Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Beautiful Memorials Created by Families</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Celebrating the lives and legacies of those who have touched our hearts
            </p>
          </div>

          {recentMemorials.length > 0 ? (
            <div className="space-y-16">
              {/* Featured Memorial Stories Carousel */}
              {recentMemorials.filter(m => m.status === 'published').length > 0 && (
                <div>
                  <div className="text-center mb-8">
                    <h3 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-2">
                      Featured Memorial Stories
                    </h3>
                    <p className="text-muted-foreground">
                      Complete memorial experiences with photos, stories, and family contributions
                    </p>
                  </div>
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto"
                  >
                    <CarouselContent>
                      {recentMemorials
                        .filter(m => m.status === 'published')
                        .slice(0, 8)
                        .map((memorial) => (
                        <CarouselItem key={memorial.id} className="sm:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <MemorialCard memorial={memorial} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              )}

              {/* Recent Memorials Carousel */}
              {recentMemorials.filter(m => m.status !== 'published').length > 0 && (
                <div>
                  <div className="text-center mb-8">
                    <h3 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-2">
                      Recent Memorials
                    </h3>
                    <p className="text-muted-foreground">
                      Simple tributes created with love and care
                    </p>
                  </div>
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto"
                  >
                    <CarouselContent>
                      {recentMemorials
                        .filter(m => m.status !== 'published')
                        .slice(0, 6)
                        .map((memorial) => (
                        <CarouselItem key={memorial.id} className="sm:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <MemorialCard memorial={memorial} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No memorials available yet.</p>
              <Button 
                className="mt-4"
                onClick={() => setShowCreateModal(true)}
                data-testid="button-create-first-memorial"
              >
                Create the First Memorial
              </Button>
            </div>
          )}

          {recentMemorials.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/browse">
                <Button variant="secondary" data-testid="button-view-all-memorials">
                  View All Memorials
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 px-2">How We Help You Honor Their Life</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center p-4 sm:p-6 bg-card rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Digital Memorials</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Create lasting online tributes with photos, stories, and memories</p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-card rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Funeral Programs</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Design, upload, and print beautiful funeral programs easily</p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-card rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Partner Directory</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Connect with trusted funeral homes, florists, and caterers</p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-card rounded-xl shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Digital Guestbook</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Share memories and tributes from anywhere in the world</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Directory Preview */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Trusted Partners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with verified funeral service providers who understand South African traditions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0h6"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Ubuntu Funeral Services</h3>
              <p className="text-muted-foreground text-sm mb-2">Cape Town, Western Cape</p>
              <p className="text-muted-foreground text-xs">Traditional and modern funeral services</p>
            </div>

            <div className="bg-card rounded-xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18.5l-8.5-8.5 1.5-1.5L12 15.5l7-7 1.5 1.5L12 18.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Protea Flowers</h3>
              <p className="text-muted-foreground text-sm mb-2">Johannesburg, Gauteng</p>
              <p className="text-muted-foreground text-xs">Traditional funeral flower arrangements</p>
            </div>

            <div className="bg-card rounded-xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Heritage Catering</h3>
              <p className="text-muted-foreground text-sm mb-2">Durban, KwaZulu-Natal</p>
              <p className="text-muted-foreground text-xs">Traditional and contemporary catering</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/partners">
              <Button variant="secondary" data-testid="button-view-all-partners">
                View All Partners
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Every life deserves to be remembered well</h2>
          <p className="text-xl opacity-90 mb-8">
            Whether someone lived 9 days or 90 years, their memory deserves a bridge between this life and the legacy they leave.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary"
              onClick={() => setShowCreateModal(true)}
              data-testid="button-cta-create-memorial"
            >
              Create a Memorial
            </Button>
            <Link href="/browse">
              <Button 
                variant="outline" 
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                data-testid="button-cta-browse-memorials"
              >
                Browse Memorials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4">Soulbridge</h3>
              <p className="text-background/80 text-sm">
                A digital home for the living to honour the departed. Helping South African families celebrate life with dignity, design, and deep humanity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Create & Share</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li><button onClick={() => setShowCreateModal(true)} className="hover:text-background transition-colors">Create Memorial</button></li>
                <li><a href="#" className="hover:text-background transition-colors">Funeral Programs</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Share Tributes</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Upload Photos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Find & Connect</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li><Link href="/browse"><span className="hover:text-background transition-colors cursor-pointer">Browse Memorials</span></Link></li>
                <li><Link href="/partners"><span className="hover:text-background transition-colors cursor-pointer">Partner Directory</span></Link></li>
                <li><a href="#" className="hover:text-background transition-colors">Search by Province</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Community Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <hr className="border-background/20 my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-background/80">
            <p>&copy; 2024 Soulbridge. All rights reserved.</p>
            <p>Made with ❤️ for South African families</p>
          </div>
        </div>
      </footer>

      <CreateMemorialModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}