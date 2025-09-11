import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Users, Clock, Shield, Star, CheckCircle2, ArrowRight, Camera, MessageCircle, Share2 } from "lucide-react";
import { CreateMemorialForm } from "@/components/create-memorial-form";

export default function CreatePage() {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const processSteps = [
    {
      step: 1,
      title: "Share Their Story",
      description: "Tell us about your loved one - their name, dates, and where they called home",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    },
    {
      step: 2,
      title: "Craft Their Memorial",
      description: "Write a heartfelt message and choose how you'd like their memory to be shared",
      icon: MessageCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      step: 3,
      title: "Add Their Photo",
      description: "Upload a beautiful photo that captures their spirit and essence",
      icon: Camera,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      step: 4,
      title: "Share & Connect",
      description: "Choose privacy settings and invite family and friends to contribute",
      icon: Share2,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    }
  ];

  const features = [
    {
      icon: Heart,
      title: "Honour Their Legacy",
      description: "Create a beautiful, lasting tribute that celebrates their unique life story and impact on your family and community."
    },
    {
      icon: Users,
      title: "Bring Family Together",
      description: "Unite scattered family members and friends in South Africa and around the world to share memories and support each other."
    },
    {
      icon: Shield,
      title: "Safe & Respectful",
      description: "Your memorial is protected with privacy controls, ensuring a dignified space for remembrance and reflection."
    },
    {
      icon: Clock,
      title: "Available 24/7",
      description: "Access your loved one's memorial anytime, anywhere - a permanent place of comfort and connection."
    }
  ];

  const testimonials = [
    {
      name: "Nomsa M.",
      location: "Cape Town, Western Cape",
      text: "SoulBridge helped our family stay connected during such a difficult time. Having a place where we could all share memories of gogo from different provinces was a blessing.",
      rating: 5
    },
    {
      name: "Thabo S.",
      location: "Johannesburg, Gauteng",
      text: "The memorial we created for my father brought our entire extended family together. Relatives from overseas could participate and feel close to home.",
      rating: 5
    },
    {
      name: "Sarah K.",
      location: "Durban, KwaZulu-Natal",
      text: "Beautiful, respectful platform that honoured my mother's memory in a way that felt right for our family's traditions and values.",
      rating: 5
    }
  ];

  if (showForm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowForm(false)}
              className="mb-4"
              data-testid="button-back-to-info"
            >
              ← Back to Information
            </Button>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Create a Memorial
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Let's create a beautiful tribute to honour your loved one's memory
            </p>
          </div>
          <CreateMemorialForm onBack={() => setShowForm(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              Trusted by South African families nationwide
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
              Create a Memorial That
              <br />
              <span className="text-primary">Honours Their Legacy</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
              A sacred digital space for South African families to remember, celebrate, and keep the stories of their loved ones alive for generations to come.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                onClick={() => setShowForm(true)}
                data-testid="button-start-creating"
              >
                Start Creating Memorial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                onClick={() => window.scrollTo({ top: document.getElementById('process')?.offsetTop || 0, behavior: 'smooth' })}
                data-testid="button-learn-how"
              >
                Learn How It Works
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Always Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Free to Create</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">9</div>
                <div className="text-sm text-muted-foreground">SA Provinces</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Lasting Forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Simple Steps to Create Their Memorial
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Creating a beautiful memorial takes just a few minutes. Here's how we guide you through the process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.step} className="relative border-2 hover:border-primary/20 transition-colors">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto ${step.bgColor} rounded-full flex items-center justify-center mb-4`}>
                      <IconComponent className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <div className="flex items-center justify-center mb-2">
                      <Badge variant="outline" className="font-semibold">
                        Step {step.step}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => setShowForm(true)}
              data-testid="button-start-process"
            >
              Begin Creating Memorial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Why Families Choose SoulBridge
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just a memorial - it's a place where love, memories, and family connections live on.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Stories from South African Families
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how SoulBridge has helped families across our beautiful country honour their loved ones.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Ready to Honour Their Memory?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Create a lasting tribute that celebrates their life, connects your family, and preserves their legacy for future generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 h-auto bg-white text-primary hover:bg-white/90"
              onClick={() => setShowForm(true)}
              data-testid="button-create-memorial-cta"
            >
              Create Memorial Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {!isAuthenticated && (
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 h-auto border-white text-white hover:bg-white hover:text-primary"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-sign-in-cta"
              >
                Sign In to Continue
              </Button>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-white/80">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>Free to create</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>No time limits</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>Family friendly</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}