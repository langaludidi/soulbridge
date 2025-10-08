import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Shield,
  Zap,
  Users,
  Globe,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Lock,
  Cloud,
} from "lucide-react";

export default function ProductPage() {
  const productFeatures = [
    {
      icon: Heart,
      title: "Beautiful Memorial Pages",
      description:
        "Create stunning, personalized memorial pages that honor your loved one's unique life and legacy. Choose from elegant themes and customize every detail.",
    },
    {
      icon: Globe,
      title: "Accessible Anywhere",
      description:
        "Share memorial pages with family and friends around the world. Access memories from any device, anytime, anywhere with a simple link.",
    },
    {
      icon: Shield,
      title: "Privacy Controls",
      description:
        "Choose who can view the memorial with public, private, or unlisted options. You have complete control over privacy and access.",
    },
    {
      icon: Cloud,
      title: "Secure Cloud Storage",
      description:
        "Your precious memories are safely stored in the cloud with enterprise-grade security. Photos, videos, and tributes are protected and backed up.",
    },
    {
      icon: Zap,
      title: "Easy to Use",
      description:
        "Create a complete memorial in minutes with our intuitive step-by-step process. No technical skills required - if you can use social media, you can use SoulBridge.",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description:
        "Every memorial page looks beautiful on phones, tablets, and desktops. Fully responsive design ensures a perfect experience on any device.",
    },
  ];

  const capabilities = [
    "Unlimited photo and video uploads",
    "Background music and audio tributes",
    "Interactive life timeline",
    "Digital guestbook for condolences",
    "Family tree and relationships",
    "Memorial service RSVP management",
    "Donation link integration",
    "QR code for easy sharing",
    "Custom themes and backgrounds",
    "Permanent online memorial",
  ];

  const useCases = [
    {
      title: "For Families",
      description:
        "Create a lasting tribute where relatives near and far can share memories, view photos, and stay connected through grief.",
      icon: Users,
    },
    {
      title: "For Funeral Homes",
      description:
        "Provide modern digital memorial services to your clients. Enhance your offerings with professional, shareable memorial pages.",
      icon: Shield,
    },
    {
      title: "For Communities",
      description:
        "Honor community members, teachers, mentors, or colleagues with a dedicated space for collective remembrance and celebration.",
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Honoring Lives, Preserving Legacies
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              The Modern Way to
              <span className="block text-primary mt-2">Remember & Celebrate</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              SoulBridge is a comprehensive digital memorial platform that helps you
              create beautiful, permanent online tributes for your loved ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/sign-up">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Built for Remembrance
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create a meaningful digital memorial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {productFeatures.map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                Powerful Capabilities
              </h2>
              <p className="text-xl text-muted-foreground">
                All the features you need, included
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-foreground font-medium">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Who Uses SoulBridge
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by families, funeral homes, and communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {useCases.map((useCase) => (
              <Card key={useCase.title} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                  <useCase.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Start Creating a Lasting Tribute
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of families who trust SoulBridge to honor their loved ones
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
