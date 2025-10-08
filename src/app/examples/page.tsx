import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Images,
  MessageSquare,
  Clock,
  ArrowRight,
  Heart,
} from "lucide-react";

export default function ExamplesPage() {
  const examples = [
    {
      name: "Thabo Mbeki",
      dates: "1942 - 2024",
      category: "Community Leader",
      description:
        "A tribute celebrating 82 years of service to the Soweto community. Features extensive photo gallery from the 1960s liberation movement to modern community development.",
      features: [
        "120+ photos spanning 6 decades",
        "Video tributes from family",
        "Timeline of activism",
        "500+ guestbook messages",
      ],
      stats: {
        photos: 120,
        tributes: 500,
        timeline: 45,
        views: "12.5K",
      },
      preview:
        "Known for his unwavering dedication to education and community upliftment...",
    },
    {
      name: "Dr. Nomsa Dlamini",
      dates: "1955 - 2024",
      category: "Healthcare Hero",
      description:
        "Honoring a pioneering surgeon who dedicated 40 years to rural healthcare in KwaZulu-Natal. Features her medical journey and countless lives touched.",
      features: [
        "Career timeline with milestones",
        "Patient testimonials",
        "Awards and honors gallery",
        "Background music of her favorites",
      ],
      stats: {
        photos: 85,
        tributes: 320,
        timeline: 38,
        views: "8.2K",
      },
      preview:
        "Dr. Dlamini's compassion knew no bounds. She treated every patient like family...",
    },
    {
      name: "Pieter van der Merwe",
      dates: "1950 - 2023",
      category: "Family Man",
      description:
        "A loving husband, father of 4, and grandfather of 9. Simple yet beautiful memorial showcasing a life rich in family love and outdoor adventures.",
      features: [
        "Family photo collection",
        "Fishing trip videos",
        "Grandchildren's messages",
        "RSVP for memorial service",
      ],
      stats: {
        photos: 45,
        tributes: 125,
        timeline: 20,
        views: "3.1K",
      },
      preview:
        "Pieter loved nothing more than Sunday braais with the whole family...",
    },
    {
      name: "Fatima Ahmed",
      dates: "1965 - 2024",
      category: "Educator",
      description:
        "30 years of inspiring young minds in Cape Town. Memorial includes student tributes, teaching philosophy, and her legacy in education reform.",
      features: [
        "Student video messages",
        "Teaching awards showcase",
        "Classroom memories",
        "Scholarship fund donations",
      ],
      stats: {
        photos: 95,
        tributes: 450,
        timeline: 32,
        views: "15.8K",
      },
      preview:
        "Mrs. Ahmed believed every child could succeed with the right encouragement...",
    },
    {
      name: "James Wilson",
      dates: "1938 - 2024",
      category: "War Veteran",
      description:
        "Honoring 86 years of service, sacrifice, and unwavering courage. Memorial features military service, family life, and community contributions.",
      features: [
        "Military service timeline",
        "Medal and honors display",
        "Letters from comrades",
        "Family history archive",
      ],
      stats: {
        photos: 110,
        tributes: 280,
        timeline: 52,
        views: "9.7K",
      },
      preview:
        "Sergeant Wilson served with distinction, earning the respect of all who knew him...",
    },
    {
      name: "Zanele Khumalo",
      dates: "1990 - 2024",
      category: "Young Artist",
      description:
        "Celebrating a vibrant life cut short. Memorial showcases her artwork, music, and the joy she brought to everyone around her.",
      features: [
        "Art gallery with her paintings",
        "Music performances (videos)",
        "Friend tributes and stories",
        "Forever 34 - beautiful tribute",
      ],
      stats: {
        photos: 200,
        tributes: 680,
        timeline: 25,
        views: "22.4K",
      },
      preview:
        "Zanele's art reflected her spirit - colorful, bold, and full of life...",
    },
  ];

  const templates = [
    {
      title: "Simple & Elegant",
      description: "Perfect for those who prefer minimalism",
      includes: [
        "Profile with photo",
        "Short obituary",
        "10-15 photos",
        "Basic timeline",
      ],
    },
    {
      title: "Complete Memorial",
      description: "Most popular option with all features",
      includes: [
        "Full obituary",
        "Photo & video gallery",
        "Detailed timeline",
        "Guestbook tributes",
        "Music integration",
      ],
    },
    {
      title: "Legacy Archive",
      description: "Comprehensive family history",
      includes: [
        "Extensive media library",
        "Multi-generation timeline",
        "Family tree",
        "Document uploads",
        "Donation integration",
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
              See Beautiful Memorials
              <span className="text-primary"> Created by Families Like Yours</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get inspired by real memorials that celebrate lives well-lived.
              Each one is unique, heartfelt, and honors a special person.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/memorial/create">Create Your Memorial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
              Featured Memorials
            </h2>
            <p className="text-muted-foreground">
              These are example templates. All names and details are fictional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header with placeholder image */}
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="h-16 w-16 text-accent/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Sample Memorial
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <Badge className="mb-3">{example.category}</Badge>

                  <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                    {example.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {example.dates}
                  </p>

                  <p className="text-sm text-foreground mb-4">
                    {example.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-foreground mb-2">
                      Features:
                    </p>
                    <ul className="space-y-1">
                      {example.features.map((feature, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="text-accent">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Images className="h-4 w-4 text-accent" />
                      <span className="text-xs text-muted-foreground">
                        {example.stats.photos} photos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-accent" />
                      <span className="text-xs text-muted-foreground">
                        {example.stats.tributes} tributes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span className="text-xs text-muted-foreground">
                        {example.stats.timeline} events
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-accent" />
                      <span className="text-xs text-muted-foreground">
                        {example.stats.views} views
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-token p-3 mb-4">
                    <p className="text-xs italic text-muted-foreground">
                      &ldquo;{example.preview}&rdquo;
                    </p>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/memorial/create">
                      Use This Style
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              Choose Your Memorial Style
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Start with a template and customize to make it uniquely theirs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {templates.map((template, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    {template.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-xs font-semibold text-foreground mb-2">
                      Includes:
                    </p>
                    <ul className="space-y-2">
                      {template.includes.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-accent">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/memorial/create">Start with This</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-12">
              Join Thousands of Families
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  10K+
                </div>
                <p className="text-sm text-muted-foreground">
                  Memorials Created
                </p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  50K+
                </div>
                <p className="text-sm text-muted-foreground">
                  Tributes Shared
                </p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  2M+
                </div>
                <p className="text-sm text-muted-foreground">
                  Photos Preserved
                </p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  100K+
                </div>
                <p className="text-sm text-muted-foreground">
                  Monthly Visitors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your Own Beautiful Memorial
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start with a template or build from scratch. It's free to create
              and you only pay when you're ready to publish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/memorial/create">
                  Start Creating Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
