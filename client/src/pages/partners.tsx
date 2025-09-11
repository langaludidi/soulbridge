import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Partner } from "@shared/schema";

export default function Partners() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners", { 
      province: selectedProvince === "all" ? undefined : selectedProvince,
      type: selectedType === "all" ? undefined : selectedType 
    }],
  });

  const filteredPartners = partners.filter(partner => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      partner.name.toLowerCase().includes(query) ||
      partner.description?.toLowerCase().includes(query) ||
      partner.province.toLowerCase().includes(query)
    );
  });

  const getPartnerTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      funeral_home: "Funeral Home",
      florist: "Florist",
      caterer: "Caterer",
      musician: "Musician",
      photographer: "Photographer",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Partner with SoulBridge
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Families want dignified online memorials. We make it simple for you to offer them seamlessly.
          </p>
        </div>

        {/* Why This Matters */}
        <section className="mb-16 bg-muted/50 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6 text-center">
              Why This Matters
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              Families today want to share their loved ones' legacies online with dignity and ease. Yet, many funeral homes still lack local, culturally relevant digital memorial solutions. Using overseas platforms feels disconnected and does not integrate seamlessly with your services, missing an opportunity to support families better and grow your brand.
            </p>
          </div>
        </section>

        {/* How SoulBridge Helps */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              How SoulBridge Helps You Serve Better
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Seamless Integration</h3>
              <p className="text-muted-foreground">Add online memorials easily to your packages with minimal setup.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Grow Your Brand</h3>
              <p className="text-muted-foreground">Offer innovative services that position your brand as modern and compassionate.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Support Families Fully</h3>
              <p className="text-muted-foreground">Help families share stories and memories with dignity, wherever they are.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Contact Us</h3>
              <p className="text-muted-foreground">Sign up & choose a package that fits your business needs</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Onboard Seamlessly</h3>
              <p className="text-muted-foreground">Get your branded partner dashboard set up quickly</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Offer Families More</h3>
              <p className="text-muted-foreground">Create beautiful memorials easily as part of your services</p>
            </div>
          </div>
        </section>

        {/* Partner Packages */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              Partner Packages
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">Partner Basic</h3>
                <div className="text-3xl font-bold text-primary">R2,000</div>
                <div className="text-muted-foreground">/ month</div>
                <ul className="text-left space-y-2 text-sm">
                  <li>• Up to 20 memorials per month</li>
                  <li>• White-label branding with your logo</li>
                  <li>• Partner dashboard access</li>
                  <li>• Basic analytics</li>
                </ul>
                <button className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90 transition-colors" data-testid="button-choose-basic">
                  Choose Plan
                </button>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">Partner Standard</h3>
                <div className="text-3xl font-bold text-primary">R5,000</div>
                <div className="text-muted-foreground">/ month</div>
                <ul className="text-left space-y-2 text-sm">
                  <li>• Up to 50 memorials per month</li>
                  <li>• All Partner Basic features</li>
                  <li>• Advanced analytics and reporting</li>
                  <li>• Priority partner support</li>
                  <li>• Featured partner listing</li>
                </ul>
                <button className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90 transition-colors" data-testid="button-choose-standard">
                  Choose Plan
                </button>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">Partner Premium</h3>
                <div className="text-3xl font-bold text-primary">R10,000</div>
                <div className="text-muted-foreground">/ month</div>
                <ul className="text-left space-y-2 text-sm">
                  <li>• All Partner Standard features</li>
                  <li>• Unlimited memorials per month</li>
                  <li>• Dedicated account manager</li>
                  <li>• Early access to new features</li>
                  <li>• API integration options</li>
                </ul>
                <button className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90 transition-colors" data-testid="button-choose-premium">
                  Choose Plan
                </button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Partner Directory Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
            Current Partner Directory
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with verified funeral service providers who understand South African traditions
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-card rounded-xl shadow-sm p-8 mb-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 px-4 py-3 text-base"
                data-testid="input-search-partners"
              />
            </div>
            <div>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className="h-12 px-4 py-3" data-testid="select-province-partners">
                  <SelectValue placeholder="All Provinces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                  <SelectItem value="Free State">Free State</SelectItem>
                  <SelectItem value="Gauteng">Gauteng</SelectItem>
                  <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                  <SelectItem value="Limpopo">Limpopo</SelectItem>
                  <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                  <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                  <SelectItem value="North West">North West</SelectItem>
                  <SelectItem value="Western Cape">Western Cape</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-12 px-4 py-3" data-testid="select-type-partners">
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="funeral_home">Funeral Homes</SelectItem>
                  <SelectItem value="florist">Florists</SelectItem>
                  <SelectItem value="caterer">Caterers</SelectItem>
                  <SelectItem value="musician">Musicians</SelectItem>
                  <SelectItem value="photographer">Photographers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                    <div className="h-16 bg-muted rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPartners.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground" data-testid="text-partners-count">
                {filteredPartners.length} partner{filteredPartners.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {partner.logoUrl ? (
                        <img 
                          src={partner.logoUrl} 
                          alt={`${partner.name} logo`}
                          className="w-12 h-12 object-cover rounded-lg"
                          data-testid={`img-partner-logo-${partner.id}`}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {partner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-foreground truncate" data-testid={`text-partner-name-${partner.id}`}>
                            {partner.name}
                          </h3>
                          <Badge variant="secondary" className="ml-2">
                            {getPartnerTypeDisplay(partner.type)}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mt-1" data-testid={`text-partner-location-${partner.id}`}>
                          {partner.province}
                        </p>
                        
                        {partner.description && (
                          <p className="text-muted-foreground text-sm mt-3 line-clamp-3" data-testid={`text-partner-description-${partner.id}`}>
                            {partner.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-4">
                          {partner.website && (
                            <a 
                              href={partner.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                              data-testid={`link-partner-website-${partner.id}`}
                            >
                              Website
                            </a>
                          )}
                          {partner.phone && (
                            <a 
                              href={`tel:${partner.phone}`}
                              className="text-primary hover:underline text-sm"
                              data-testid={`link-partner-phone-${partner.id}`}
                            >
                              {partner.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No partners found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || (selectedProvince !== "all") || (selectedType !== "all")
                ? "Try adjusting your search criteria." 
                : "No partners are available at the moment."}
            </p>
            {(searchQuery || (selectedProvince !== "all") || (selectedType !== "all")) && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedProvince("all");
                  setSelectedType("all");
                }}
                className="text-primary hover:underline text-sm"
                data-testid="button-clear-partner-filters"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Final CTA */}
        <section className="mt-16 bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">
              Ready to Offer Families More?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join other leading funeral homes and partners who trust SoulBridge to provide families with dignified, modern memorial experiences.
            </p>
            <button className="bg-primary text-primary-foreground rounded-lg px-8 py-3 text-lg font-semibold hover:bg-primary/90 transition-colors" data-testid="button-contact-us-today">
              Contact Us Today
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function getPartnerTypeDisplay(type: string) {
  const types: Record<string, string> = {
    funeral_home: "Funeral Home",
    florist: "Florist",
    caterer: "Caterer",
    musician: "Musician",
    photographer: "Photographer",
  };
  return types[type] || type;
}
