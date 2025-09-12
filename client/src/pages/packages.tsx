import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Heart, Crown, Shield, Users, Star } from "lucide-react";
import { Link } from "wouter";

interface PackageFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  popular?: boolean;
  features: PackageFeature[];
}

const packages: Package[] = [
  {
    id: "remember",
    name: "Remember",
    price: 0,
    interval: "Free Forever",
    description: "Perfect for commemorating a single loved one with dignity and respect.",
    icon: <Heart className="w-8 h-8" />,
    badge: "Free",
    features: [
      { name: "1 memorial", included: true, description: "Create one beautiful memorial" },
      { name: "Basic memorial page", included: true, description: "Essential information and tribute space" },
      { name: "1 profile photo", included: true, description: "Upload one memorial photo" },
      { name: "PDF memorial card", included: true, description: "Download and print memorial cards" },
      { name: "Public viewing", included: true, description: "Anyone can view and pay respects" },
      { name: "Photo gallery", included: false, description: "Multiple photos and media" },
      { name: "Audio & video tributes", included: false, description: "Share voice messages and videos" },
      { name: "Private memorial links", included: false, description: "Control who can access" },
      { name: "Event announcements", included: false, description: "Share funeral and memorial services" },
      { name: "Family tree integration", included: false, description: "Connect family relationships" }
    ]
  },
  {
    id: "honour",
    name: "Honour",
    price: 49,
    interval: "monthly",
    description: "Honor multiple family members with enhanced memorial features and media galleries.",
    icon: <Crown className="w-8 h-8" />,
    popular: true,
    features: [
      { name: "3 memorials", included: true, description: "Create up to 3 memorials" },
      { name: "Enhanced memorial pages", included: true, description: "Rich layouts with advanced features" },
      { name: "10 photos per memorial", included: true, description: "Share more memories with photo galleries" },
      { name: "Photo gallery", included: true, description: "Beautiful photo collections" },
      { name: "Audio & video tributes", included: true, description: "Record and share voice messages, videos" },
      { name: "Private memorial links", included: true, description: "Share privately with family and friends" },
      { name: "PDF memorial cards", included: true, description: "Professional memorial cards" },
      { name: "Priority support", included: true, description: "Faster response to questions and issues" },
      { name: "Event announcements", included: false, description: "Funeral and memorial service details" },
      { name: "Family tree integration", included: false, description: "Connect family relationships" }
    ]
  },
  {
    id: "legacy",
    name: "Legacy",
    price: 99,
    interval: "monthly",
    description: "Comprehensive memorial platform with unlimited memorials and advanced family features.",
    icon: <Shield className="w-8 h-8" />,
    features: [
      { name: "Unlimited memorials", included: true, description: "Create as many memorials as needed" },
      { name: "Premium memorial pages", included: true, description: "Advanced layouts and customization" },
      { name: "Unlimited photos", included: true, description: "Share all your precious memories" },
      { name: "Full media galleries", included: true, description: "Photos, audio, and video collections" },
      { name: "Private memorial links", included: true, description: "Complete privacy control" },
      { name: "Event announcements", included: true, description: "Share funeral and memorial services" },
      { name: "Family tree integration", included: true, description: "Connect and visualize family relationships" },
      { name: "PDF memorial cards", included: true, description: "Professional memorial cards and programs" },
      { name: "Advanced sharing options", included: true, description: "Social media and email sharing tools" },
      { name: "Priority support", included: true, description: "Dedicated customer support" }
    ]
  },
  {
    id: "family_vault",
    name: "Family Vault",
    price: 199,
    interval: "monthly",
    description: "Complete family heritage preservation with collaborative tools and priority support.",
    icon: <Users className="w-8 h-8" />,
    badge: "Premium",
    features: [
      { name: "Unlimited memorials", included: true, description: "Preserve your entire family heritage" },
      { name: "Premium memorial pages", included: true, description: "Highest quality memorial presentations" },
      { name: "Unlimited photos & media", included: true, description: "Complete multimedia memorial experiences" },
      { name: "Collaborative editing", included: true, description: "Multiple family members can contribute" },
      { name: "Family tree integration", included: true, description: "Comprehensive family genealogy" },
      { name: "Event announcements", included: true, description: "Coordinate all family events and services" },
      { name: "Private memorial links", included: true, description: "Full privacy and access control" },
      { name: "Advanced sharing tools", included: true, description: "Professional sharing and distribution" },
      { name: "Priority support", included: true, description: "Dedicated family heritage specialist" },
      { name: "Custom memorial domains", included: true, description: "Personalized web addresses for memorials" }
    ]
  }
];

export default function PackagesPage() {
  return (
    <div className="min-h-screen section-bg-primary">
      {/* Header Section */}
      <section className="section-padding section-bg-secondary">
        <div className="container-max">
          <div className="container-content text-center">
            <h1 className="mb-6">
              Memorial Packages
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Choose the perfect package to honor your loved ones. From simple remembrance to comprehensive family heritage preservation.
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                Trusted by South African families nationwide
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-padding section-bg-primary">
        <div className="container-max">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative overflow-hidden smooth-hover group ${
                  pkg.popular 
                    ? "border-2 border-primary shadow-lg scale-105 section-elevated" 
                    : "section-elevated hover:border-primary/30"
                }`}
                data-testid={`package-${pkg.id}`}
              >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Package Badge */}
              {pkg.badge && !pkg.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {pkg.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-xl transition-colors duration-300 ${
                    pkg.popular 
                      ? "bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:bg-primary/20" 
                      : "bg-muted/10 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                    {pkg.icon}
                  </div>
                </div>
                <CardTitle className="h2 mb-4">
                  {pkg.name}
                </CardTitle>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    {pkg.price === 0 ? (
                      <span className="text-3xl font-bold text-primary">Free</span>
                    ) : (
                      <>
                        <span className="text-sm text-muted-foreground mr-1">R</span>
                        <span className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{pkg.price}</span>
                        <span className="text-sm text-muted-foreground ml-1">/{pkg.interval}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pkg.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          feature.included ? "text-foreground" : "text-gray-400"
                        }`}>
                          {feature.name}
                        </p>
                        {feature.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="mb-6" />

                <Button 
                  asChild
                  className={`w-full transition-all duration-300 ${
                    pkg.popular 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl" 
                      : "bg-foreground hover:bg-primary text-background hover:text-primary-foreground"
                  }`}
                  data-testid={`button-select-${pkg.id}`}
                >
                  <Link href="/pricing">
                    {pkg.price === 0 ? "Get Started Free" : "Choose Plan"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding section-bg-tertiary">
        <div className="container-content text-center">
          <h3 className="h2 mb-6">
            Need Help Choosing?
          </h3>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Our team understands the importance of honoring your loved ones. We're here to help you find the perfect memorial solution for your family.
          </p>
          <div className="button-group justify-center">
            <Button variant="outline" size="lg" asChild data-testid="button-contact-support">
              <Link href="/about">Contact Support</Link>
            </Button>
            <Button size="lg" asChild data-testid="button-start-memorial">
              <Link href="/create">Start Creating Memorial</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}