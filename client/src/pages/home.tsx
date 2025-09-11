import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { MemorialCard } from "@/components/memorial-card";
import { CreateMemorialModal } from "@/components/create-memorial-modal";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import type { Memorial } from "@shared/schema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Plus, ArrowRight, Star } from "lucide-react"; // Assuming Plus, ArrowRight, and Star are needed and imported

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  const { data: recentMemorials = [] } = useQuery<Memorial[]>({
    queryKey: ["/api/memorials"],
  });

  // Dummy data for features and testimonials if not provided elsewhere
  const features = [
    { icon: Plus, name: "Simple and Beautiful", description: "Create stunning memorial pages easily, with no technical skills required." },
    { icon: Plus, name: "Locally Rooted", description: "Built for our communities, traditions, and cultures – your stories remain connected to home." },
    { icon: Plus, name: "Private and Secure", description: "Your family's memories and tributes are protected with the highest standards of security and privacy." },
    { icon: Plus, name: "Always Accessible", description: "View and update your loved one's memorial anytime, from any device, wherever you are." }
  ];

  const testimonials = [
    { content: "SoulBridge made it so easy to create a beautiful tribute for my grandmother. The platform is intuitive and the final memorial was exactly what I envisioned.", author: "Sarah J.", role: "Family Member" },
    { content: "The ability to share stories and photos with family and friends was invaluable. It truly helped us connect and remember our loved one together.", author: "Mark T.", role: "Friend" },
    { content: "I was looking for a way to preserve my father's legacy, and SoulBridge provided the perfect solution. It's a dignified and lasting way to honour his memory.", author: "Emily R.", role: "Daughter" }
  ];

  // Dummy functions for navigation and modal state if not provided elsewhere
  const navigate = (path: string) => { window.location.href = path; };
  const setIsCreateModalOpen = (isOpen: boolean) => { setShowCreateModal(isOpen); };


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding-lg">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        </div>
        <div className="relative container-content">
          <div className="text-center text-content">
            <h1 className="hero-text font-serif font-bold tracking-tight text-foreground sm:text-5xl mb-8">
              Honouring Every Life.<br />
              <span className="text-primary">Connecting Every Soul</span>
            </h1>
            <p className="text-lg leading-8 text-muted-foreground mb-10 max-w-3xl mx-auto">
              Create beautiful, lasting tributes that celebrate the unique story of your loved ones. 
              Share memories, photos, and connect with family and friends in a meaningful digital space.
            </p>
            <div className="button-group justify-center">
              <Button
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
                data-testid="create-memorial-hero-button"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Memorial
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/browse')}
                className="shadow-sm hover:shadow-md transition-all duration-300 px-8 py-4"
              >
                Browse Memorials
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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

      {/* Features Section */}
      <section className="section-padding section-elevated">
        <div className="container-max">
          <div className="container-content text-center mb-16">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl mb-6">
              Why Choose SoulBridge
            </h2>
            <p className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              Our platform offers everything you need to create meaningful, lasting tributes
            </p>
          </div>
          <div className="container-max">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 card-spacing-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <dt>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white mb-6">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="text-lg font-semibold leading-7 text-foreground mb-3">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding section-contrast">
        <div className="container-max">
          <div className="container-content text-center mb-16">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl mb-6">
              Trusted by Families Worldwide
            </h2>
            <p className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              See how SoulBridge has helped families create lasting tributes
            </p>
          </div>
          <div className="container-max">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="rounded-2xl bg-white dark:bg-slate-800 card-spacing shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding section-elevated">
        <div className="container-content text-center text-content">
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground sm:text-4xl mb-6">
            Ready to Create a Beautiful Memorial?
          </h2>
          <p className="text-lg leading-8 text-muted-foreground mb-10 max-w-3xl mx-auto">
            Join thousands of families who have chosen SoulBridge to honour their loved ones
          </p>
          <div className="button-group justify-center">
            <Button
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
              className="shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
              data-testid="create-memorial-cta-button"
            >
              Get Started Today
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/pricing')}
              className="shadow-sm hover:shadow-md transition-all duration-300 px-8 py-4"
            >
              View Pricing
            </Button>
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
            <div className="space-y-16">
              {/* Published Memorials (Premium Features) */}
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

              {/* Draft/Basic Memorials (Free Version) */}
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