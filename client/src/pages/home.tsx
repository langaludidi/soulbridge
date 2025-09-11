
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
import { Plus, ArrowRight, Star, Heart, Shield, Clock, Users, Sparkles, Feather, MapPin, CheckCircle, Award, Zap } from "lucide-react";

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
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10"
    },
    { 
      icon: MapPin, 
      name: "Locally Rooted", 
      description: "Built for our communities, traditions, and cultures – your stories remain connected to home.",
      color: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10"
    },
    { 
      icon: Shield, 
      name: "Private and Secure", 
      description: "Your family's memories and tributes are protected with the highest standards of security and privacy.",
      color: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10"
    },
    { 
      icon: Clock, 
      name: "Always Accessible", 
      description: "View and update your loved one's memorial anytime, from any device, wherever you are.",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10"
    }
  ];

  const testimonials = [
    { 
      content: "SoulBridge made it so easy to create a beautiful tribute for my grandmother. The platform is intuitive and the final memorial was exactly what I envisioned.", 
      author: "Sarah J.", 
      role: "Granddaughter",
      location: "Cape Town",
      rating: 5
    },
    { 
      content: "The ability to share stories and photos with family and friends was invaluable. It truly helped us connect and remember our loved one together.", 
      author: "Mark T.", 
      role: "Family Friend",
      location: "Johannesburg",
      rating: 5
    },
    { 
      content: "I was looking for a way to preserve my father's legacy, and SoulBridge provided the perfect solution. It's a dignified and lasting way to honour his memory.", 
      author: "Emily R.", 
      role: "Daughter",
      location: "Durban",
      rating: 5
    }
  ];

  const stats = [
    { number: "1,200+", label: "Families Served", icon: Users },
    { number: "4.9", label: "Average Rating", icon: Star },
    { number: "99.9%", label: "Uptime", icon: CheckCircle },
    { number: "24/7", label: "Support", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Navigation />

      {/* Hero Section - Enhanced with Floating Elements */}
      <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/6 w-64 h-64 bg-gradient-to-r from-emerald-300/10 to-teal-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-gentle-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-12">
            {/* Enhanced Trust Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-rose-500 animate-soft-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Trusted by families across South Africa</span>
                <div className="flex -space-x-1 ml-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 border-2 border-white dark:border-slate-800"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Main Headline */}
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-slate-800 dark:text-slate-100 leading-tight tracking-tight">
                <span className="block mb-4 animate-fade-in-up">Honouring Every Life,</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Connecting Every Soul
                </span>
              </h1>

              <div className="relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 max-w-5xl mx-auto leading-relaxed font-light">
                  Create beautiful, everlasting tributes that celebrate the unique journey of your loved ones. 
                  <span className="block mt-2 text-lg sm:text-xl lg:text-2xl opacity-80">
                    A gentle space for memories, stories, and eternal connections.
                  </span>
                </p>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Button
                size="lg"
                className="group px-10 py-5 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 rounded-2xl"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="mr-3 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                Create Memorial
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
              </Button>
              <Link href="/browse">
                <Button
                  variant="outline"
                  size="lg"
                  className="group px-10 py-5 text-lg font-medium bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 rounded-2xl hover:shadow-lg"
                >
                  Browse Memorials
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>

            {/* Enhanced Stats Section */}
            <div className="pt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="group text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 mb-3 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100">{stat.number}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission Section */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-400 font-medium text-sm mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2 animate-soft-pulse" />
              Our Sacred Mission
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-slate-800 dark:text-slate-100 mb-8">
              Why SoulBridge Exists
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              When someone passes away, families need a gentle, beautiful way to share their legacy 
              and connect those who loved them. We create sacred digital spaces that honor life's journey.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                icon: "🕯️",
                title: "Honour with Dignity",
                description: "Create respectful, beautiful tributes that truly reflect the person they were and the love they shared.",
                gradient: "from-blue-500/10 to-indigo-500/10"
              },
              {
                icon: "🤝",
                title: "Bridge Hearts & Memories",
                description: "Connect loved ones across distances and generations through shared stories and cherished moments.",
                gradient: "from-emerald-500/10 to-teal-500/10"
              },
              {
                icon: "♾️",
                title: "Preserve Their Legacy",
                description: "Ensure their stories, wisdom, and memories live on as an eternal source of comfort and inspiration.",
                gradient: "from-purple-500/10 to-pink-500/10"
              }
            ].map((item, index) => (
              <div key={index} className={`group relative bg-gradient-to-br ${item.gradient} p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 backdrop-blur-sm hover:-translate-y-2`}>
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{item.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50/30 to-blue-50/20 dark:from-slate-800/30 dark:to-slate-900/50 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-slate-800 dark:text-slate-100 mb-8">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Creating a memorial is simple, gentle, and takes just a few minutes
            </p>
          </div>

          <div className="grid gap-16 md:grid-cols-3 relative max-w-6xl mx-auto">
            {/* Enhanced Connection Lines */}
            <div className="hidden md:flex absolute top-24 left-1/2 transform -translate-x-1/2 w-5/6 h-px">
              <div className="flex-1 bg-gradient-to-r from-transparent via-blue-300 to-blue-300 dark:via-blue-600 dark:to-blue-600 h-px"></div>
              <div className="flex-1 bg-gradient-to-r from-blue-300 to-transparent dark:from-blue-600 dark:to-transparent h-px"></div>
            </div>

            {[
              { 
                step: "1", 
                title: "Begin Your Journey", 
                description: "Choose a plan that honors your loved one's memory with the care they deserve",
                color: "from-blue-500 to-indigo-600"
              },
              { 
                step: "2", 
                title: "Share Their Story", 
                description: "Add photos, memories, and stories that capture their beautiful life and lasting impact",
                color: "from-emerald-500 to-teal-600"
              },
              { 
                step: "3", 
                title: "Connect Hearts", 
                description: "Invite family and friends to visit, contribute, and find comfort in shared memories",
                color: "from-purple-500 to-pink-600"
              }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-8 relative group">
                <div className="relative inline-block">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg max-w-sm mx-auto">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 font-medium text-sm mb-8 shadow-sm">
              <Award className="w-4 h-4 mr-2" />
              Why Choose SoulBridge
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-slate-800 dark:text-slate-100 mb-8">
              Built with Love and Care
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">
              Every feature is thoughtfully designed to provide comfort, connection, and lasting remembrance
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-10 rounded-3xl bg-gradient-to-br ${feature.bgGradient} border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-3 backdrop-blur-sm`}
              >
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-20 h-20 mx-auto bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{feature.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50/50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-900/70 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-32 right-20 w-56 h-56 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-20 w-64 h-64 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-serif font-light text-slate-800 dark:text-slate-100 mb-8">
              Stories of Comfort & Connection
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">
              Hear from families who found peace and connection through SoulBridge
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-sm font-bold text-white">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <blockquote className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">{testimonial.author}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role} • {testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Memorials - Enhanced */}
      {recentMemorials.length > 0 && (
        <section className="py-24 bg-white dark:bg-slate-900 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-serif font-light text-slate-800 dark:text-slate-100 mb-8">
                Recent Memorials
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">
                Honoring lives, celebrating legacies, and keeping memories alive
              </p>
            </div>

            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent className="-ml-6">
                {recentMemorials.slice(0, 6).map((memorial) => (
                  <CarouselItem key={memorial.id} className="md:basis-1/2 lg:basis-1/3 pl-6">
                    <div className="group">
                      <div className="transform transition-all duration-300 group-hover:scale-105">
                        <MemorialCard memorial={memorial} />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white dark:bg-slate-800 shadow-lg border-2 hover:shadow-xl transition-all duration-300" />
              <CarouselNext className="bg-white dark:bg-slate-800 shadow-lg border-2 hover:shadow-xl transition-all duration-300" />
            </Carousel>

            <div className="text-center mt-16">
              <Link href="/browse">
                <Button variant="outline" size="lg" className="px-10 py-4 text-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  View All Memorials
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-gentle-float"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + i}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-12">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 text-white font-medium text-sm backdrop-blur-md shadow-lg">
              <Heart className="w-4 h-4 mr-2 animate-soft-pulse" />
              Begin Their Eternal Story
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-white leading-tight">
              Ready to Create a Memorial?
            </h2>

            <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light">
              Create a beautiful, lasting tribute that celebrates their life and brings comfort to all who loved them.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button
                size="lg"
                className="group px-12 py-6 text-xl bg-white text-blue-600 hover:bg-white/95 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-2xl font-medium"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="mr-3 h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                Create a Memorial
                <Zap className="ml-3 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              <Link href="/browse">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group px-12 py-6 text-xl border-2 border-white/50 text-white bg-transparent hover:bg-white/10 backdrop-blur-md rounded-2xl font-medium"
                >
                  Explore Examples
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>

            <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white/80 text-lg">
              {[
                { icon: CheckCircle, text: "Trusted by thousands" },
                { icon: Zap, text: "Start for free" },
                { icon: Heart, text: "No commitments" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center space-x-3">
                  <item.icon className="w-5 h-5 text-white/60" />
                  <span className="font-medium">{item.text}</span>
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
