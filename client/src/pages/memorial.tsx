import { useState } from "react";
import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { TributeModal } from "@/components/tribute-modal";
import { EnhancedGallery } from "@/components/enhanced-gallery";
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
  const age = passingDate.getFullYear() - birthDate.getFullYear() - 
    (passingDate.getMonth() < birthDate.getMonth() || 
     (passingDate.getMonth() === birthDate.getMonth() && passingDate.getDate() < birthDate.getDate()) ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Memorial Hero Section */}
      <section className="relative">
        <div 
          className="h-[500px] bg-cover bg-center relative"
          style={{
            backgroundImage: memorial.profilePhotoUrl 
              ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('${memorial.profilePhotoUrl}')`
              : "linear-gradient(to bottom, rgba(34, 197, 94, 0.8), rgba(21, 128, 61, 0.9))"
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <div className="mb-6">
                {!memorial.profilePhotoUrl && (
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <span className="text-4xl text-white font-serif">
                      {(memorial.firstName?.[0] || '').toUpperCase()}{(memorial.lastName?.[0] || '').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4" data-testid="text-memorial-name">
                {memorial.firstName} {memorial.lastName}
              </h1>
              <p className="text-2xl md:text-3xl opacity-90 mb-4" data-testid="text-memorial-dates">
                {format(birthDate, "MMMM dd, yyyy")} - {format(passingDate, "MMMM dd, yyyy")}
              </p>
              <p className="text-lg md:text-xl opacity-80 font-light" data-testid="text-memorial-age">
                {age} years old • {memorial.province}, South Africa
              </p>
              {memorial.memorialMessage && (
                <div className="mt-8 max-w-2xl mx-auto">
                  <p className="text-lg opacity-90 italic font-light leading-relaxed">
                    "{memorial.memorialMessage}"
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
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
                <button 
                  onClick={() => setActiveTab("lifestory")}
                  className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === "lifestory" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="tab-lifestory"
                >
                  Life Story
                </button>
              </nav>
            </div>

            {/* About Section */}
            {activeTab === "about" && (
              <div className="space-y-6">
                {/* Main About Content */}
                <div className="bg-card rounded-xl p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    {memorial.profilePhotoUrl ? (
                      <div className="md:w-48 md:flex-shrink-0">
                        <img 
                          src={memorial.profilePhotoUrl} 
                          alt={`${memorial.firstName} ${memorial.lastName}`}
                          className="w-full md:w-48 h-64 object-cover rounded-xl shadow-lg"
                          data-testid="img-memorial-profile"
                        />
                      </div>
                    ) : (
                      <div className="md:w-48 md:flex-shrink-0">
                        <div className="w-full md:w-48 h-64 bg-muted rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-4xl text-muted-foreground font-serif">
                            {(memorial.firstName?.[0] || '').toUpperCase()}{(memorial.lastName?.[0] || '').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="mb-6">
                        <h2 className="text-2xl font-serif font-bold mb-4 text-foreground">
                          {memorial.firstName} {memorial.lastName}
                        </h2>
                        <div className="space-y-3 text-base">
                          <div className="flex items-center space-x-2">
                            <span className="text-primary font-semibold">{age} years old</span>
                          </div>
                          <div className="flex items-center space-x-2" data-testid="text-memorial-birth">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span className="text-muted-foreground">Born {format(birthDate, "MMMM dd, yyyy")} in {memorial.province}, South Africa</span>
                          </div>
                          <div className="flex items-center space-x-2" data-testid="text-memorial-passing">
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            <span className="text-muted-foreground">Passed away {format(passingDate, "MMMM dd, yyyy")} in South Africa</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {memorial.memorialMessage && (
                    <>
                      <hr className="my-8 border-border" />
                      <div className="prose prose-lg max-w-none">
                        <h4 className="text-xl font-serif font-semibold mb-4 text-foreground">Memorial Message</h4>
                        <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground">
                          <p className="text-foreground leading-relaxed text-lg" data-testid="text-memorial-message">
                            "{memorial.memorialMessage}"
                          </p>
                        </blockquote>
                      </div>
                    </>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Recent Activity</span>
                  </h4>
                  
                  {tributes.length > 0 ? (
                    <div className="space-y-3">
                      {tributes.slice(0, 5).map((tribute) => (
                        <div key={tribute.id} className="flex items-center space-x-3 py-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-xs">
                              {tribute.authorName?.split(' ').map(n => n?.[0] || '').join('').slice(0, 1).toUpperCase() || 'A'}
                            </span>
                          </div>
                          <span className="text-sm">
                            <span className="font-medium">{tribute.authorName}</span>
                            <span className="text-muted-foreground"> left a tribute</span>
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {tribute.createdAt ? format(new Date(tribute.createdAt), "MMM dd") : "Recent"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No recent activity yet.</p>
                  )}
                </div>
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
                              {tribute.authorName?.split(' ').map(n => n?.[0] || '').join('').slice(0, 2).toUpperCase() || 'AN'}
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
                                • {tribute.createdAt ? format(new Date(tribute.createdAt), "MMM dd, yyyy") : "Recent"}
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
              <EnhancedGallery 
                memorialId={memorialId!} 
                photos={photos} 
                isLoading={false}
              />
            )}

            {/* Life Story Section */}
            {activeTab === "lifestory" && (
              <div className="bg-card rounded-xl p-8 shadow-sm">
                <h3 className="text-2xl font-serif font-semibold mb-8">Life Story</h3>
                
                <div className="space-y-8">
                  {/* Life Timeline */}
                  <div className="border-l-2 border-primary/20 pl-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 bg-primary rounded-full"></div>
                      <div>
                        <h4 className="text-lg font-semibold text-primary mb-1">Birth</h4>
                        <p className="text-muted-foreground mb-2">{format(birthDate, "MMMM dd, yyyy")}</p>
                        <p className="text-foreground">Born in {memorial.province}, South Africa</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 bg-muted rounded-full"></div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-1">Life & Legacy</h4>
                        <p className="text-muted-foreground mb-3">Lived {age} meaningful years</p>
                        {memorial.memorialMessage && (
                          <div className="prose prose-sm max-w-none">
                            <p className="text-foreground leading-relaxed text-base">
                              {memorial.memorialMessage}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 bg-muted-foreground rounded-full"></div>
                      <div>
                        <h4 className="text-lg font-semibold text-muted-foreground mb-1">Peaceful Passing</h4>
                        <p className="text-muted-foreground mb-2">{format(passingDate, "MMMM dd, yyyy")}</p>
                        <p className="text-muted-foreground">Passed away peacefully in South Africa</p>
                      </div>
                    </div>
                  </div>

                  {/* Memorial Stats */}
                  <div className="bg-muted/20 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Remembered By</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{tributes.length}</div>
                        <div className="text-sm text-muted-foreground">Tributes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{photos.length}</div>
                        <div className="text-sm text-muted-foreground">Photos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{memorial.viewCount || 0}</div>
                        <div className="text-sm text-muted-foreground">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{age}</div>
                        <div className="text-sm text-muted-foreground">Years Lived</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Tributes Preview */}
                  {tributes.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Recent Tributes</h4>
                      <div className="space-y-4">
                        {tributes.slice(0, 3).map((tribute) => (
                          <div key={tribute.id} className="border border-border rounded-lg p-4 bg-muted/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-semibold text-xs">
                                  {tribute.authorName?.split(' ').map(n => n?.[0] || '').join('').slice(0, 2).toUpperCase() || 'AN'}
                                </span>
                              </div>
                              <span className="font-medium text-sm">{tribute.authorName}</span>
                              <span className="text-muted-foreground text-xs">
                                • {tribute.createdAt ? format(new Date(tribute.createdAt), "MMM dd") : "Recent"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{tribute.message}</p>
                          </div>
                        ))}
                        {tributes.length > 3 && (
                          <button 
                            onClick={() => setActiveTab("tributes")}
                            className="text-primary text-sm hover:underline"
                          >
                            View all {tributes.length} tributes →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Memorial Actions */}
            <div className="bg-card rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="font-semibold text-foreground text-lg">Memorial Actions</h3>
              
              <div className="grid gap-3">
                <button className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary" data-testid="button-lay-flowers">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span className="font-medium">Lay Flowers</span>
                </button>
                
                <button className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors text-amber-700" data-testid="button-light-candle">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                  </svg>
                  <span className="font-medium">Light Candle</span>
                </button>
                
                <button 
                  onClick={() => setShowTributeModal(true)}
                  className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-blue-700"
                  data-testid="button-leave-note"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  <span className="font-medium">Leave Tribute</span>
                </button>
              </div>
              
              <hr className="border-border" />
              
              {/* Social Sharing */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Share Memorial</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `${memorial.firstName} ${memorial.lastName} Memorial`,
                          text: `Remember ${memorial.firstName} ${memorial.lastName} on Soulbridge`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="flex items-center justify-center space-x-2 p-2 text-sm rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                    data-testid="button-share-whatsapp"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                      window.open(url, '_blank', 'width=600,height=400');
                    }}
                    className="flex items-center justify-center space-x-2 p-2 text-sm rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                    data-testid="button-share-facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors"
                  data-testid="button-copy-link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  <span>Copy Memorial Link</span>
                </button>
              </div>
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
{memorial.createdAt ? format(new Date(memorial.createdAt), "MMM dd, yyyy") : "Unknown"}
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
