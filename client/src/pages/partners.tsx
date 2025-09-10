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
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners", { 
      province: selectedProvince || undefined,
      type: selectedType || undefined 
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Partner Directory
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with verified funeral service providers who understand South African traditions
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-card rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-partners"
              />
            </div>
            <div>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger data-testid="select-province-partners">
                  <SelectValue placeholder="All Provinces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Provinces</SelectItem>
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
                <SelectTrigger data-testid="select-type-partners">
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Services</SelectItem>
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
              {searchQuery || selectedProvince || selectedType
                ? "Try adjusting your search criteria." 
                : "No partners are available at the moment."}
            </p>
            {(searchQuery || selectedProvince || selectedType) && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedProvince("");
                  setSelectedType("");
                }}
                className="text-primary hover:underline text-sm"
                data-testid="button-clear-partner-filters"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
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
