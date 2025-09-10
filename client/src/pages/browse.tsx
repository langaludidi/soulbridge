import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { MemorialCard } from "@/components/memorial-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { Memorial } from "@shared/schema";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  const { data: memorials = [], isLoading } = useQuery<Memorial[]>({
    queryKey: ["/api/memorials", { province: selectedProvince || undefined }],
  });

  const filteredMemorials = memorials.filter(memorial => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      memorial.firstName.toLowerCase().includes(query) ||
      memorial.lastName.toLowerCase().includes(query) ||
      memorial.province.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Browse Memorials
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and honor the memories of loved ones from across South Africa
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-card rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-browse"
              />
            </div>
            <div>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger data-testid="select-province-filter">
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
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm overflow-hidden">
                <div className="h-64 bg-muted animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMemorials.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground" data-testid="text-results-count">
                {filteredMemorials.length} memorial{filteredMemorials.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMemorials.map((memorial) => (
                <MemorialCard key={memorial.id} memorial={memorial} />
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
            <h3 className="text-lg font-semibold text-foreground mb-2">No memorials found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedProvince 
                ? "Try adjusting your search criteria or browse all memorials." 
                : "There are no memorials available at the moment."}
            </p>
            {(searchQuery || selectedProvince) && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedProvince("");
                }}
                className="text-primary hover:underline text-sm"
                data-testid="button-clear-filters"
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
