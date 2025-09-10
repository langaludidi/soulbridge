import { useState } from "react";
import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { TributeModal } from "@/components/tribute-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { Memorial, Tribute, MemorialPhoto } from "@shared/schema";

export default function MemorialPage() {
  const [, params] = useRoute("/memorial/:id");
  const [showTributeModal, setShowTributeModal] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const memorialId = params?.id;

  const { data: memorial, isLoading: memorialLoading } = useQuery<Memorial>({
    queryKey: ["/api/memorials", memorialId],
    enabled: !!memorialId,
  });

  const { data: tributes = [] } = useQuery<Tribute[]>({
    queryKey: ["/api/memorials", memorialId, "tributes"],
    enabled: !!memorialId,
  });

  const { data: photos = [] } = useQuery<MemorialPhoto[]>({
    queryKey: ["/api/memorials", memorialId, "photos"],
    enabled: !!memorialId,
  });

  if (memorialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading memorial...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Memorial Not Found</h1>
            <p className="text-muted-foreground mb-4">This memorial may have been removed or doesn't exist.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const birthDate = new Date(memorial.dateOfBirth);
  const passingDate = new Date(memorial.dateOfPassing);
  const age = passingDate.getFullYear() - birthDate.getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Memorial Hero Section */}
      <section className="relative">
        <div 
          className="h-96 bg-cover bg-center relative"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1380')"
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2" data-testid="text-memorial-name">
                {memorial.firstName} {memorial.lastName}
              </h1>
              <p className="text-xl opacity-90" data-testid="text-memorial-dates">
                {format(birthDate, "yyyy")} - {format(passingDate, "yyyy")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Memorial Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                <button 
                  onClick={() => setActiveTab("about")}
                  className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === "about" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="tab-about"
                >
                  About
                </button>
                <button 
                  onClick={() => setActiveTab("tributes")}
                  className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === "tributes" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="tab-tributes"
                >
                  Tributes ({tributes.length})
                </button>
                <button 
                  onClick={() => setActiveTab("gallery")}
                  className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === "gallery" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="tab-gallery"
                >
                  Gallery ({photos.length})
                </button>
              </nav>
            </div>

            {/* About Section */}
            {activeTab === "about" && (
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex items-start space-x-6">
                  {memorial.profilePhotoUrl ? (
                    <img 
                      src={memorial.profilePhotoUrl} 
                      alt={`${memorial.firstName} ${memorial.lastName}`}
                      className="w-32 h-36 object-cover rounded-lg shadow-md"
                      data-testid="img-memorial-profile"
                    />
                  ) : (
                    <div className="w-32 h-36 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-2xl text-muted-foreground font-serif">
                        {memorial.firstName[0]}{memorial.lastName[0]}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="space-y-2 text-sm text-muted-foreground mb-6">
                      <p data-testid="text-memorial-age">• {age} years old</p>
                      <p data-testid="text-memorial-birth">• Born on {format(birthDate, "MMMM dd, yyyy")} in {memorial.province}, South Africa</p>
                      <p data-testid="text-memorial-passing">• Passed away on {format(passingDate, "MMMM dd, yyyy")} in South Africa</p>
                    </div>
                  </div>
                </div>
                
                <hr className="my-6 border-border" />
                
                {memorial.memorialMessage && (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed" data-testid="text-memorial-message">
                      {memorial.memorialMessage}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tributes Section */}
            {activeTab === "tributes" && (
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Tributes</h3>
                  <Button
                    onClick={() => setShowTributeModal(true)}
                    size="sm"
                    data-testid="button-leave-tribute"
                  >
                    Leave a Tribute
                  </Button>
                </div>
                
                {tributes.length > 0 ? (
                  <div className="space-y-6">
                    {tributes.map((tribute) => (
                      <div key={tribute.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {tribute.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-foreground" data-testid={`text-tribute-author-${tribute.id}`}>
                                {tribute.authorName}
                              </h4>
                              {tribute.relationship && (
                                <Badge variant="secondary" className="text-xs">
                                  {tribute.relationship}
                                </Badge>
                              )}
                              <span className="text-muted-foreground text-sm">
                                • {format(new Date(tribute.createdAt!), "MMM dd, yyyy")}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`text-tribute-message-${tribute.id}`}>
                              {tribute.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No tributes yet. Be the first to share a memory.</p>
                    <Button onClick={() => setShowTributeModal(true)} data-testid="button-first-tribute">
                      Leave First Tribute
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Gallery Section */}
            {activeTab === "gallery" && (
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-6">Photo Gallery</h3>
                
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img 
                          src={photo.photoUrl} 
                          alt={photo.caption || "Memorial photo"}
                          className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                          data-testid={`img-gallery-${photo.id}`}
                        />
                        {photo.caption && (
                          <p className="text-xs text-muted-foreground mt-2 truncate">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No photos uploaded yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Memorial Actions */}
            <div className="bg-card rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-foreground mb-4">Memorial Actions</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors" data-testid="button-lay-flowers">
                  <img 
                    src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=40" 
                    alt="Lay flowers" 
                    className="w-8 h-6 object-cover rounded mb-1"
                  />
                  <span className="text-xs">Lay Flowers</span>
                </button>
                
                <button className="flex flex-col items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors" data-testid="button-light-candle">
                  <img 
                    src="https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=40" 
                    alt="Light candle" 
                    className="w-8 h-6 object-cover rounded mb-1"
                  />
                  <span className="text-xs">Light Candle</span>
                </button>
                
                <button 
                  onClick={() => setShowTributeModal(true)}
                  className="flex flex-col items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  data-testid="button-leave-note"
                >
                  <svg className="w-6 h-6 text-primary mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  <span className="text-xs">Leave Note</span>
                </button>
              </div>
              
              <hr className="border-border" />
              
              <Button className="w-full" size="sm" data-testid="button-share-memorial">
                Share Memorial
              </Button>
            </div>

            {/* Photo Gallery Preview */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Photos ({photos.length})</h3>
                <button 
                  onClick={() => setActiveTab("gallery")}
                  className="text-primary text-sm hover:underline"
                  data-testid="button-view-all-photos"
                >
                  View All
                </button>
              </div>
              
              {photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {photos.slice(0, 6).map((photo) => (
                    <img 
                      key={photo.id}
                      src={photo.photoUrl} 
                      alt={photo.caption || "Memorial photo"}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setActiveTab("gallery")}
                      data-testid={`img-photo-preview-${photo.id}`}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No photos uploaded yet.</p>
              )}
            </div>

            {/* Memorial Statistics */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Memorial Statistics</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Views</span>
                  <span className="font-medium" data-testid="text-view-count">{memorial.viewCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tributes</span>
                  <span className="font-medium" data-testid="text-tribute-count">{tributes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Photos</span>
                  <span className="font-medium" data-testid="text-photo-count">{photos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memorial Created</span>
                  <span className="font-medium" data-testid="text-created-date">
                    {format(new Date(memorial.createdAt!), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TributeModal 
        open={showTributeModal} 
        onClose={() => setShowTributeModal(false)}
        memorialId={memorialId!}
        memorialName={`${memorial.firstName} ${memorial.lastName}`}
      />
    </div>
  );
}
