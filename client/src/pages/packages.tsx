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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Memorial Packages
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect package to honor your loved ones. From simple remembrance to comprehensive family heritage preservation.
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Trusted by South African families nationwide
            </Badge>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                pkg.popular 
                  ? "border-2 border-green-500 shadow-lg scale-105" 
                  : "border-gray-200 hover:border-green-300"
              }`}
              data-testid={`package-${pkg.id}`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-green-600 text-white px-3 py-1 text-xs font-semibold">
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
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-full ${
                    pkg.popular ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {pkg.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </CardTitle>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {pkg.price === 0 ? (
                      <span className="text-3xl font-bold text-gray-900">Free</span>
                    ) : (
                      <>
                        <span className="text-sm text-gray-500 mr-1">R</span>
                        <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                        <span className="text-sm text-gray-500 ml-1">/{pkg.interval}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
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
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          feature.included ? "text-gray-900" : "text-gray-400"
                        }`}>
                          {feature.name}
                        </p>
                        {feature.description && (
                          <p className="text-xs text-gray-500 mt-1">
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
                  className={`w-full ${
                    pkg.popular 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-gray-900 hover:bg-gray-800 text-white"
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

        {/* CTA Section */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team understands the importance of honoring your loved ones. We're here to help you find the perfect memorial solution for your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" asChild data-testid="button-contact-support">
              <Link href="/about">Contact Support</Link>
            </Button>
            <Button size="lg" asChild data-testid="button-start-memorial">
              <Link href="/create">Start Creating Memorial</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}