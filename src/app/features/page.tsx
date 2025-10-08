import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Images,
  Music,
  Calendar,
  Lock,
  Share2,
  MessageSquare,
  Clock,
  Users,
  FileText,
  Gift,
  CheckCircle,
  Globe,
  Smartphone,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: FileText,
      title: "Beautiful Obituaries",
      description:
        "Create heartfelt tributes with both short and full-length obituaries. Share their life story, achievements, and what made them special.",
      benefits: [
        "Short tribute for sharing (160 characters)",
        "Full-length obituary with rich text",
        "Add meaningful quotes or verses",
        "Professional, elegant formatting",
      ],
    },
    {
      icon: Images,
      title: "Photo & Video Galleries",
      description:
        "Celebrate their life through photos and videos. Create a visual timeline of cherished memories that family and friends can revisit anytime.",
      benefits: [
        "Unlimited photo uploads",
        "Video support (MP4, WebM)",
        "Organized in beautiful galleries",
        "High-resolution image quality",
      ],
    },
    {
      icon: Music,
      title: "Background Music",
      description:
        "Add their favorite songs or meaningful music to the memorial page. Create an emotional atmosphere that honors their memory.",
      benefits: [
        "Upload audio files (MP3, WAV)",
        "Floating audio player",
        "Auto-play options",
        "Multiple songs supported",
      ],
    },
    {
      icon: Clock,
      title: "Life Timeline",
      description:
        "Chronicle important milestones from birth to their final days. Document education, career, family events, and special moments.",
      benefits: [
        "Chronological event display",
        "Add dates and descriptions",
        "Visual timeline layout",
        "Unlimited events",
      ],
    },
    {
      icon: MessageSquare,
      title: "Digital Guestbook",
      description:
        "Allow family and friends to leave condolences, share memories, and express their love. A permanent record of impact and love.",
      benefits: [
        "Public or moderated tributes",
        "Email notifications for new messages",
        "Beautiful message display",
        "Archive of all tributes",
      ],
    },
    {
      icon: Users,
      title: "Family Relationships",
      description:
        "Document family connections, relationships, and loved ones. Keep family history alive for future generations.",
      benefits: [
        "Spouse/partner information",
        "Children and grandchildren",
        "Parents and siblings",
        "Extended family members",
      ],
    },
    {
      icon: Calendar,
      title: "RSVP for Services",
      description:
        "Manage memorial service attendance with built-in RSVP functionality. Track who's coming and send updates easily.",
      benefits: [
        "Event date, time, and location",
        "Guest count tracking",
        "Email confirmations",
        "Service details and directions",
      ],
    },
    {
      icon: Gift,
      title: "Donation Integration",
      description:
        "Accept donations in lieu of flowers through Netcash Pay Now. Support charities or causes that were meaningful to them.",
      benefits: [
        "Secure Netcash integration",
        "Direct donation links",
        "Charity information",
        "Track donations received",
      ],
    },
    {
      icon: Lock,
      title: "Privacy Controls",
      description:
        "Choose who can view the memorial with flexible privacy settings. Public, unlisted, or completely private options.",
      benefits: [
        "Public - Anyone can find and view",
        "Unlisted - Only people with link",
        "Private - Only you can access",
        "Change settings anytime",
      ],
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description:
        "Share memorials instantly via WhatsApp, Facebook, email, or QR code. Make it simple for family and friends to visit.",
      benefits: [
        "One-click social media sharing",
        "QR codes for physical materials",
        "Email sharing options",
        "Custom share messages",
      ],
    },
    {
      icon: Globe,
      title: "Permanent Memorial",
      description:
        "Your memorial stays online forever. No expiration dates, no hidden fees. A lasting tribute that won't disappear.",
      benefits: [
        "Lifetime hosting included",
        "Always accessible 24/7",
        "Regular backups",
        "Never expires",
      ],
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description:
        "Beautiful on every device - desktop, tablet, or phone. Access memorials anywhere, anytime with perfect formatting.",
      benefits: [
        "Responsive design",
        "Touch-friendly navigation",
        "Fast loading times",
        "Works offline",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Everything You Need to Create a
              <span className="text-primary"> Beautiful Memorial</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              SoulBridge provides all the tools to celebrate a life well-lived.
              From photos and videos to tributes and donations, create a lasting
              digital legacy.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/memorial/create">Start Creating Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              Why Choose SoulBridge?
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Compare us to traditional memorial options
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* SoulBridge */}
              <Card className="p-8 border-2 border-accent">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
                  SoulBridge Digital Memorial
                </h3>
                <ul className="space-y-4">
                  {[
                    "Unlimited photos & videos",
                    "Interactive timeline",
                    "Digital guestbook",
                    "Instant global sharing",
                    "Mobile accessible",
                    "No expiration - forever",
                    "Edit anytime",
                    "From R49/month",
                    "RSVP & donations built-in",
                    "Privacy controls",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Traditional */}
              <Card className="p-8 opacity-70">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
                  Traditional Printed Memorial
                </h3>
                <ul className="space-y-4">
                  {[
                    "Limited photos (usually 1-2)",
                    "Static text only",
                    "No interactive elements",
                    "Limited distribution",
                    "Not mobile accessible",
                    "Physical degradation",
                    "Cannot be updated",
                    "R500 - R2,000+ printing",
                    "Separate service planning",
                    "No privacy options",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Create a Beautiful Memorial?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start for free today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/memorial/create">Create Memorial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
