import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Clock, MessageSquare, QrCode, Heart, Shield } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Camera,
      title: "Photo & Video Gallery",
      description: "Preserve precious moments with unlimited photo and video uploads.",
    },
    {
      icon: Clock,
      title: "Life Timeline",
      description: "Chronicle important milestones and memories throughout their life.",
    },
    {
      icon: MessageSquare,
      title: "Digital Guestbook",
      description: "Friends and family can share tributes, condolences, and memories.",
    },
    {
      icon: QrCode,
      title: "QR Code Sharing",
      description: "Easily share memorials at services with scannable QR codes.",
    },
  ];

  const testimonials = [
    {
      quote: "SoulBridge helped us create a beautiful tribute to my mother. The timeline feature was perfect for celebrating her life.",
      author: "Sarah M.",
      location: "Cape Town",
    },
    {
      quote: "Being able to share the memorial via QR code at the service made it so easy for everyone to contribute their memories.",
      author: "David K.",
      location: "Johannesburg",
    },
    {
      quote: "The ability to upload videos and audio made the memorial feel so personal and alive. Thank you SoulBridge.",
      author: "Lindiwe N.",
      location: "Durban",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-28 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-serif text-h1 md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Celebrate Life.
              <br />
              <span className="text-primary">Cherish Memories.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Create beautiful, lasting tributes to honor and celebrate the lives
              of your loved ones. Share memories, photos, and stories that endure
              forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/memorial/create">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  Create a Memorial
                </Button>
              </Link>
              <Link href="/examples">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Examples
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-h2 md:text-5xl font-bold text-foreground mb-4">
              Everything You Need to Honor Their Memory
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to create meaningful, lasting digital memorials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-token bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-h2 md:text-4xl font-bold text-foreground mb-6">
                More Than Just an Obituary
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                SoulBridge goes beyond traditional obituaries. Create a living,
                breathing tribute that captures the essence of your loved one's
                life story.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Unlimited photos, videos, and audio memories
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Privacy controls to keep memorials public or private
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <QrCode className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Easy sharing via social media, email, or QR codes
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-token p-8 shadow-md">
              <blockquote className="text-lg italic text-foreground/90 mb-4">
                "A memorial is not just a marker of death, but a celebration of a
                life well-lived."
              </blockquote>
              <div className="text-sm text-muted-foreground">— SoulBridge</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-h2 md:text-4xl font-bold text-foreground mb-4">
              Trusted by Families Across South Africa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <p className="text-muted-foreground italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-muted-foreground">{testimonial.location}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-h2 md:text-4xl font-bold mb-4">
            Start Creating a Lasting Tribute Today
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of families who have chosen SoulBridge to honor their
            loved ones.
          </p>
          <Link href="/memorial/create">
            <Button variant="accent" size="lg">
              Create Your First Memorial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
