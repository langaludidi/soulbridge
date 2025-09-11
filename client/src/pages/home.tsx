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
  const navigate = (path: string) => { console.log("Navigating to:", path); };
  const setIsCreateModalOpen = (isOpen: boolean) => { setShowCreateModal(isOpen); };


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-900 dark:via-slate-800 dark:to-primary/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(76,175,80,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(76,175,80,0.2),transparent_50%)]" />
        </div>
        <div className="relative section-padding-lg">
          <div className="container-content">
            <div className="text-center text-content">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 border border-primary/20">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Trusted by thousands of families worldwide
              </div>
              <h1 className="hero-text font-serif font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-8 leading-tight">
                Honouring Every Life.<br />
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Connecting Every Soul
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-muted-foreground mb-12 max-w-4xl mx-auto">
                Create beautiful, lasting tributes that celebrate the unique story of your loved ones. 
                Share memories, photos, and connect with family and friends in a meaningful digital space.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  size="lg"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 px-10 py-4 text-lg h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  data-testid="create-memorial-hero-button"
                >
                  <Plus className="mr-3 h-6 w-6" />
                  Create Memorial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/browse')}
                  className="shadow-sm hover:shadow-md transition-all duration-300 px-10 py-4 text-lg h-14 border-2 hover:bg-primary/5"
                >
                  Browse Memorials
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Free to create
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  No time limits
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Family friendly
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SoulBridge Exists */}
      <section className="section-padding-lg bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50">
        <div className="container-max">
          <div className="container-content text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 font-medium text-sm mb-6">
              Our Mission
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-8">
              Why SoulBridge Exists
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              When someone passes away, families need a simple, beautiful way to share their legacy and connect those who loved them. But traditional methods are limited, and existing platforms often feel disconnected from our culture and values.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🕯️</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Honour with dignity</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create respectful, beautiful tributes that truly reflect the person they were
                </p>
              </div>
              <div className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Bridge families and memories</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect loved ones across distances and generations through shared memories
                </p>
              </div>
              <div className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">♾️</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Preserve their legacy forever</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ensure their stories, values, and memories live on for future generations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding-lg bg-white dark:bg-slate-900">
        <div className="container-max">
          <div className="container-content text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-8">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Creating a memorial is simple and takes just a few minutes
            </p>
          </div>
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
            
            <div className="grid gap-12 md:grid-cols-3 relative">
              <div className="text-center space-y-6 relative">
                <div className="relative inline-block">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Sign Up & Choose a Package</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Get started with a plan that fits your family's needs and budget
                </p>
              </div>
              <div className="text-center space-y-6 relative">
                <div className="relative inline-block">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">2</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Add Photos, Stories & Tributes</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Share their life story with photos and meaningful memories that celebrate their journey
                </p>
              </div>
              <div className="text-center space-y-6 relative">
                <div className="relative inline-block">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">3</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Share with Family & Friends</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Invite loved ones to visit and contribute to the memorial, keeping memories alive together
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-16">
            <Link href="/create">
              <Button size="lg" className="px-10 py-4 text-lg h-14 shadow-lg hover:shadow-xl transition-all duration-300" data-testid="button-how-it-works-cta">
                <Plus className="mr-3 h-5 w-5" />
                Start Creating Now
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
      <section className="section-padding-lg bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
        <div className="container-max">
          <div className="container-content text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 font-medium text-sm mb-6">
              Memorial Gallery
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-8">
              Beautiful Memorials Created by Families
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
      <section className="section-padding-lg bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
        </div>
        <div className="relative container-content text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white font-medium text-sm mb-8 backdrop-blur-sm">
            <Heart className="w-4 h-4 mr-2" />
            Join Our Community
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-8">
            Ready to Create a Memorial?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create a beautiful memorial page to celebrate their life and keep their memory alive forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/create">
              <Button size="lg" className="px-10 py-4 text-lg h-14 bg-white text-primary hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300" data-testid="button-final-cta-create">
                <Plus className="mr-3 h-5 w-5" />
                Create a Memorial
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="px-10 py-4 text-lg h-14 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                Browse Examples
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span>Trusted by thousands</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span>Start for free</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              <span>No commitments</span>
            </div>
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