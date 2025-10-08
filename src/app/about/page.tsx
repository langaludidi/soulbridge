import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Users,
  Shield,
  Zap,
  Globe,
  Target,
  CheckCircle,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description:
        "We understand the pain of loss. Every feature is designed with empathy and respect for those grieving.",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description:
        "Your memories are precious. We use bank-level encryption and never share your data with third parties.",
    },
    {
      icon: Zap,
      title: "Simple & Accessible",
      description:
        "Technology should help, not hinder. We've built an intuitive platform anyone can use, regardless of tech skills.",
    },
    {
      icon: Globe,
      title: "Forever Accessible",
      description:
        "Memorials never expire. We're committed to preserving your loved one's legacy for generations to come.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Memorials Created" },
    { number: "50,000+", label: "Families Served" },
    { number: "2M+", label: "Memories Preserved" },
    { number: "99.9%", label: "Uptime Guarantee" },
  ];

  const team = [
    {
      name: "Thabo Khumalo",
      role: "Founder & CEO",
      bio: "After losing his grandmother, Thabo created SoulBridge to help families honor their loved ones digitally.",
    },
    {
      name: "Dr. Sarah van Rensburg",
      role: "Head of Product",
      bio: "Former grief counselor with 15 years of experience helping families through the mourning process.",
    },
    {
      name: "Jabu Ndlovu",
      role: "Lead Engineer",
      bio: "Technology expert passionate about creating meaningful digital experiences for African families.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "The Beginning",
      description: "SoulBridge was founded with a mission to democratize digital memorials for South African families.",
    },
    {
      year: "2021",
      title: "First 1,000 Memorials",
      description: "Reached milestone of 1,000 memorials created, serving families across all 9 provinces.",
    },
    {
      year: "2022",
      title: "Mobile App Launch",
      description: "Launched mobile-optimized platform, making memorials accessible from any device.",
    },
    {
      year: "2023",
      title: "10,000 Families",
      description: "Grew to serve over 10,000 families, becoming South Africa's leading digital memorial platform.",
    },
    {
      year: "2024",
      title: "New Features",
      description: "Launched timeline, video support, and integrated donations to help families create richer tributes.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Honoring Lives,
              <span className="text-primary"> Preserving Legacies</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're on a mission to help every South African family create
              beautiful, lasting digital memorials for their loved ones.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    SoulBridge was born from personal loss. When our founder Thabo
                    lost his grandmother in 2020, he struggled to find an
                    affordable, respectful way to share her life story online.
                  </p>
                  <p>
                    Traditional printed obituaries were expensive and limited.
                    Social media felt impersonal and temporary. He knew there had
                    to be a better way.
                  </p>
                  <p>
                    That's when SoulBridge was created - a platform designed
                    specifically for South African families to celebrate their
                    loved ones with dignity, beauty, and permanence.
                  </p>
                  <p>
                    Today, we're honored to serve thousands of families across the
                    country, helping them create lasting tributes that preserve
                    memories for future generations.
                  </p>
                </div>
              </div>

              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <blockquote className="space-y-4">
                  <p className="font-serif text-xl text-foreground italic">
                    &ldquo;Every life deserves to be remembered with love,
                    dignity, and beauty. Technology should make this accessible to
                    everyone, not just the privileged few.&rdquo;
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    - Thabo Khumalo, Founder
                  </footer>
                </blockquote>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Core Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-accent" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                          {value.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Impact
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                    {stat.number}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Dedicated professionals passionate about honoring life
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-accent mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Our Journey
            </h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-accent/30 hidden md:block" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative md:pl-20">
                    {/* Year badge */}
                    <div className="absolute left-0 hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground font-bold">
                      {milestone.year.slice(2)}
                    </div>

                    {/* Content */}
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-xl font-bold text-foreground">
                          {milestone.title}
                        </h3>
                        <span className="md:hidden text-sm font-bold text-accent">
                          {milestone.year}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {milestone.description}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                To empower every South African family with the tools to create
                beautiful, lasting digital memorials that honor their loved ones
                and preserve their legacies for future generations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/memorial/create">Create a Memorial</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
              Our Commitment to You
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Memorials never expire - lifetime hosting",
                "99.9% uptime guarantee",
                "Bank-level security & encryption",
                "No ads on memorial pages",
                "24/7 customer support",
                "Regular backups of all content",
                "Mobile-optimized experience",
                "Affordable pricing for all families",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
