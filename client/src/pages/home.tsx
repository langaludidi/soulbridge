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
import { Plus, ArrowRight, Star, Heart, Shield, Clock, Users, Sparkles, Feather, MapPin } from "lucide-react";

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  const { data: recentMemorials = [] } = useQuery<Memorial[]>({
    queryKey: ["/api/memorials"],
  });

  const features = [
    { 
      icon: Feather, 
      name: "Simple and Beautiful", 
      description: "Create stunning memorial pages easily, with no technical skills required.",
      gradient: "from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20"
    },
    { 
      icon: MapPin, 
      name: "Locally Rooted", 
      description: "Built for our communities, traditions, and cultures – your stories remain connected to home.",
      gradient: "from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20"
    },
    { 
      icon: Shield, 
      name: "Private and Secure", 
      description: "Your family's memories and tributes are protected with the highest standards of security and privacy.",
      gradient: "from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20"
    },
    { 
      icon: Clock, 
      name: "Always Accessible", 
      description: "View and update your loved one's memorial anytime, from any device, wherever you are.",
      gradient: "from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"
    }
  ];

  const testimonials = [
    { 
      content: "SoulBridge made it so easy to create a beautiful tribute for my grandmother. The platform is intuitive and the final memorial was exactly what I envisioned.", 
      author: "Sarah J.", 
      role: "Granddaughter",
      location: "Cape Town"
    },
    { 
      content: "The ability to share stories and photos with family and friends was invaluable. It truly helped us connect and remember our loved one together.", 
      author: "Mark T.", 
      role: "Family Friend",
      location: "Johannesburg"
    },
    { 
      content: "I was looking for a way to preserve my father's legacy, and SoulBridge provided the perfect solution. It's a dignified and lasting way to honour his memory.", 
      author: "Emily R.", 
      role: "Daughter",
      location: "Durban"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Navigation />

      {/* Hero Section - Refined and Calming */}
      <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
        {/* Gentle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/15 to-pink-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <Heart className="h-4 w-4 text-rose-500 mr-2" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Trusted by families across South Africa</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-slate-800 dark:text-slate-100 leading-tight tracking-tight">
                <span className="block">Honouring Every Life,</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">
                  Connecting Every Soul
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
                Create beautiful, everlasting tributes that celebrate the unique journey of your loved ones. 
                A gentle space for memories, stories, and eternal connections.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Memorial
              </Button>
              <Link href="/browse">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-medium bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                >
                  Browse Memorials
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 border-2 border-white dark:border-slate-800"></div>
                  ))}
                </div>
                <span className="text-sm font-medium">1,200+ families served</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-sm font-medium">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Warm and Inviting */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium text-sm mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Our Sacred Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-800 dark:text-slate-100 mb-6">
              Why SoulBridge Exists
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              When someone passes away, families need a gentle, beautiful way to share their legacy 
              and connect those who loved them. We create sacred digital spaces that honor life's journey.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: "🕯️",
                title: "Honour with Dignity",
                description: "Create respectful, beautiful tributes that truly reflect the person they were and the love they shared."
              },
              {
                icon: "🤝",
                title: "Bridge Hearts & Memories",
                description: "Connect loved ones across distances and generations through shared stories and cherished moments."
              },
              {
                icon: "♾️",
                title: "Preserve Their Legacy",
                description: "Ensure their stories, wisdom, and memories live on as an eternal source of comfort and inspiration."
              }
            ].map((item, index) => (
              <div key={index} className="group bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-500 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Clean and Structured */}
      <section className="py-20 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-800 dark:text-slate-100 mb-6">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Creating a memorial is simple, gentle, and takes just a few minutes
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 relative">
            {/* Connection Lines */}
            <div className="hidden md:flex absolute top-20 left-1/2 transform -translate-x-1/2 w-3/4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
            </div>

            {[
              { step: "1", title: "Begin Your Journey", description: "Choose a plan that honors your loved one's memory with the care they deserve" },
              { step: "2", title: "Share Their Story", description: "Add photos, memories, and stories that capture their beautiful life and lasting impact" },
              { step: "3", title: "Connect Hearts", description: "Invite family and friends to visit, contribute, and find comfort in shared memories" }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-6 relative">
                <div className="relative inline-block">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">{item.step}</span>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-32 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Elegant Cards */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium text-sm mb-8">
              Why Choose SoulBridge
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-800 dark:text-slate-100 mb-6">
              Built with Love and Care
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Every feature is thoughtfully designed to provide comfort, connection, and lasting remembrance
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl bg-gradient-to-br ${feature.gradient} border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-500 hover:-translate-y-1`}
              >
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                      <feature.icon className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{feature.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Warm and Personal */}
      <section className="py-20 bg-gradient-to-b from-slate-50/30 to-blue-50/20 dark:from-slate-800/30 dark:to-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-800 dark:text-slate-100 mb-6">
              Stories of Comfort & Connection
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Hear from families who found peace and connection through SoulBridge
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{testimonial.author}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role} • {testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Memorials */}
      {recentMemorials.length > 0 && (
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-800 dark:text-slate-100 mb-6">
                Recent Memorials
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Honoring lives, celebrating legacies, and keeping memories alive
              </p>
            </div>

            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent>
                {recentMemorials.slice(0, 6).map((memorial) => (
                  <CarouselItem key={memorial.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <MemorialCard memorial={memorial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div className="text-center mt-12">
              <Link href="/browse">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  View All Memorials
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA - Gentle and Inspiring */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white font-medium text-sm backdrop-blur-sm">
              <Heart className="w-4 h-4 mr-2" />
              Begin Their Eternal Story
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
              Ready to Create a Memorial?
            </h2>

            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Create a beautiful, lasting tribute that celebrates their life and brings comfort to all who loved them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="px-10 py-4 text-lg bg-white text-blue-600 hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="mr-3 h-5 w-5" />
                Create a Memorial
              </Button>
              <Link href="/browse">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-10 py-4 text-lg border-white/50 text-white bg-transparent hover:bg-white/10 backdrop-blur-sm"
                >
                  Explore Examples
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="pt-8 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
              {["Trusted by thousands", "Start for free", "No commitments"].map((text, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
                  <span>{text}</span>
                </div>
              ))}
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