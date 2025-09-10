import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InvitationModal } from "@/components/invitation-modal";
import { sharingUtils } from "@/lib/sharingUtils";
import type { MemorialPhoto, Memorial } from "@shared/schema";
import {
  Upload,
  Play,
  Pause,
  Square,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Image as ImageIcon,
  Heart,
  Eye,
  Video,
  Music,
  Star,
  Clock,
  TrendingUp,
  Users,
  Share2,
  UserPlus,
  Copy,
  Facebook,
  Mail,
  SkipForward,
  SkipBack,
  Shield,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface EnhancedGalleryProps {
  memorialId: string;
  photos: MemorialPhoto[];
  memorial: Memorial;
  isLoading?: boolean;
}

type MediaType = 'photo' | 'video' | 'audio';

export function EnhancedGallery({ memorialId, photos: allPhotos, memorial, isLoading }: EnhancedGalleryProps) {
  // Don't render if memorial is not loaded yet
  if (!memorial) {
    return null;
  }
  const [activeMediaType, setActiveMediaType] = useState<MediaType>('photo');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState(3000); // 3 seconds
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [invitationModalOpen, setInvitationModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: "general_inquiry",
    message: "",
    email: "",
  });
  const [uploadForm, setUploadForm] = useState({
    photoUrl: "",
    caption: "",
    mediaType: 'photo' as MediaType,
    isCoverPhoto: false,
    uploaderName: "",
  });
  const [dragActive, setDragActive] = useState(false);
  // Track viewed photos in current session to prevent double-counting
  const [viewedPhotosInSession, setViewedPhotosInSession] = useState<Set<string>>(new Set());

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filter photos locally based on active media type (no redundant API calls)
  const photos = allPhotos?.filter(p => p.mediaType === activeMediaType || (!p.mediaType && activeMediaType === 'photo')) || [];

  // Calculate media type counts
  const photosCount = allPhotos?.filter(p => p.mediaType === 'photo').length || 0;
  const videosCount = allPhotos?.filter(p => p.mediaType === 'video').length || 0;
  const audiosCount = allPhotos?.filter(p => p.mediaType === 'audio').length || 0;
  const totalCount = photosCount + videosCount + audiosCount;

  // Get recent activity (last 5 uploads)
  const recentActivity = allPhotos?.slice(0, 5) || [];
  const coverPhoto = allPhotos?.find(p => p.isCoverPhoto);

  const uploadPhotoMutation = useMutation({
    mutationFn: async (data: { photoUrl: string; caption?: string; mediaType: MediaType; uploaderName?: string }) => {
      return apiRequest("POST", `/api/memorials/${memorialId}/photos`, data);
    },
    onSuccess: async (newPhoto: any) => {
      // If this is a cover photo, set it as cover
      if (uploadForm.isCoverPhoto && newPhoto?.id) {
        try {
          await apiRequest('PATCH', `/api/memorials/${memorialId}/photos/${newPhoto.id}/cover`, {});
        } catch (error) {
          console.warn('Could not set cover photo:', error);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "photos"] });
      setUploadModalOpen(false);
      setUploadForm({ 
        photoUrl: "", 
        caption: "", 
        mediaType: 'photo', 
        isCoverPhoto: false, 
        uploaderName: "" 
      });
      toast({
        title: `${uploadForm.mediaType.charAt(0).toUpperCase() + uploadForm.mediaType.slice(1)} uploaded successfully`,
        description: `Your ${uploadForm.mediaType} has been added to the memorial gallery.`,
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: `There was an error uploading your ${uploadForm.mediaType}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const setCoverPhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      return apiRequest('PATCH', `/api/memorials/${memorialId}/photos/${photoId}/cover`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "photos"] });
      toast({
        title: "Cover photo updated",
        description: "The cover photo has been updated successfully.",
      });
    },
  });

  const incrementPhotoViewMutation = useMutation({
    mutationFn: async (photoId: string) => {
      return apiRequest('PATCH', `/api/photos/${photoId}/view`, {});
    },
    retry: false, // Don't retry view increments to prevent accidental double counting
    onSuccess: (data, photoId) => {
      // Optimistic update: increment view count locally instead of full refetch
      queryClient.setQueryData<MemorialPhoto[]>(['/api/memorials', memorialId, 'photos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(photo => 
          photo.id === photoId 
            ? { ...photo, viewCount: (photo.viewCount || 0) + 1 }
            : photo
        );
      });
    },
    onError: (error) => {
      console.warn('Failed to increment photo view:', error);
      // Don't show error toast as this shouldn't interrupt user experience
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: { subject: string; message: string; email?: string; memorialId?: string }) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: (response) => {
      setContactModalOpen(false);
      setContactForm({ 
        subject: "general_inquiry", 
        message: "", 
        email: "" 
      });
      toast({
        title: "Thank you for your feedback!",
        description: response.message || "We'll review your message and get back to you if needed.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to submit your message. Please try again.";
      toast({
        title: "Submission failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Helper function to track photo view with session-based deduplication
  const trackPhotoView = (photoId: string) => {
    if (!photoId || viewedPhotosInSession.has(photoId)) {
      return; // Already viewed in this session, don't increment again
    }
    
    // Mark as viewed in current session
    setViewedPhotosInSession(prev => new Set(prev).add(photoId));
    
    // Increment view count on server
    incrementPhotoViewMutation.mutate(photoId);
  };

  // Slideshow timer cleanup
  const clearSlideshowTimer = useCallback(() => {
    if (slideshowTimerRef.current) {
      clearInterval(slideshowTimerRef.current);
      slideshowTimerRef.current = null;
    }
  }, []);

  // Auto-advance slideshow
  const startSlideshowTimer = useCallback(() => {
    clearSlideshowTimer();
    if (slideshowActive && slideshowPlaying && photos.length > 1) {
      slideshowTimerRef.current = setInterval(() => {
        setCurrentPhotoIndex(prev => {
          const newIndex = (prev + 1) % photos.length;
          // Track photo view when auto-advancing
          if (photos[newIndex]?.id) {
            trackPhotoView(photos[newIndex].id);
          }
          return newIndex;
        });
      }, slideshowInterval);
    }
  }, [slideshowActive, slideshowPlaying, photos.length, slideshowInterval, clearSlideshowTimer, trackPhotoView]);

  // Slideshow navigation with auto-advance reset
  const nextPhotoSlideshow = () => {
    const newIndex = (currentPhotoIndex + 1) % photos.length;
    setCurrentPhotoIndex(newIndex);
    
    // Track photo view when navigating
    if (photos[newIndex]?.id) {
      trackPhotoView(photos[newIndex].id);
    }
    
    // Reset timer if playing
    if (slideshowPlaying) {
      startSlideshowTimer();
    }
  };

  const prevPhotoSlideshow = () => {
    const newIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    setCurrentPhotoIndex(newIndex);
    
    // Track photo view when navigating
    if (photos[newIndex]?.id) {
      trackPhotoView(photos[newIndex].id);
    }
    
    // Reset timer if playing
    if (slideshowPlaying) {
      startSlideshowTimer();
    }
  };

  const nextPhoto = () => {
    if (slideshowActive) {
      nextPhotoSlideshow();
    } else {
      const newIndex = (currentPhotoIndex + 1) % photos.length;
      setCurrentPhotoIndex(newIndex);
      
      // Track photo view when navigating to new photo (with session deduplication)
      if (photos[newIndex]?.id) {
        trackPhotoView(photos[newIndex].id);
      }
    }
  };

  const prevPhoto = () => {
    if (slideshowActive) {
      prevPhotoSlideshow();
    } else {
      const newIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
      setCurrentPhotoIndex(newIndex);
      
      // Track photo view when navigating to new photo (with session deduplication)
      if (photos[newIndex]?.id) {
        trackPhotoView(photos[newIndex].id);
      }
    }
  };

  // Slideshow controls
  const startSlideshow = () => {
    if (photos.length > 0) {
      setCurrentPhotoIndex(0);
      setSlideshowActive(true);
      setSlideshowPlaying(true);
      setLightboxOpen(true);
    }
  };

  const pauseSlideshow = () => {
    setSlideshowPlaying(false);
    clearSlideshowTimer();
  };

  const resumeSlideshow = () => {
    setSlideshowPlaying(true);
  };

  const stopSlideshow = () => {
    setSlideshowActive(false);
    setSlideshowPlaying(false);
    clearSlideshowTimer();
    setLightboxOpen(false);
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
    
    // Track photo view when lightbox opens (with session deduplication)
    if (photos[index]?.id) {
      trackPhotoView(photos[index].id);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.photoUrl.trim()) return;
    
    uploadPhotoMutation.mutate({
      photoUrl: uploadForm.photoUrl.trim(),
      caption: uploadForm.caption.trim() || undefined,
      mediaType: uploadForm.mediaType,
      uploaderName: uploadForm.uploaderName.trim() || undefined,
    });
  };

  const handleSetCoverPhoto = (photoId: string) => {
    setCoverPhotoMutation.mutate(photoId);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.message.trim() || !contactForm.subject) return;
    
    submitContactMutation.mutate({
      subject: contactForm.subject,
      message: contactForm.message.trim(),
      email: contactForm.email.trim() || undefined,
      memorialId: memorialId,
    });
  };

  // Sharing utility functions
  const memorialUrl = `${window.location.origin}/memorial/${memorial.id}`;
  const shareData = {
    memorial,
    currentUrl: memorialUrl
  };

  const handleCopyLink = async () => {
    const success = await sharingUtils.copyLink(shareData);
    if (success) {
      setLinkCopied(true);
      toast({
        title: "Link copied",
        description: "Memorial link has been copied to your clipboard.",
      });
      setTimeout(() => setLinkCopied(false), 3000);
    } else {
      toast({
        title: "Failed to copy link",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleShareFacebook = () => {
    sharingUtils.shareOnFacebook(shareData);
  };

  const handleShareWhatsApp = () => {
    sharingUtils.shareOnWhatsApp(shareData);
  };

  const handleShareEmail = () => {
    sharingUtils.shareViaEmail(shareData);
  };

  const getMediaTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      default: return ImageIcon;
    }
  };

  const getMediaTypeLabel = (type: MediaType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    // Note: In a real implementation, you'd handle file uploads here
    // For now, we'll just show the upload modal
    setUploadModalOpen(true);
    toast({
      title: "File upload",
      description: `For this demo, please paste the ${uploadForm.mediaType} URL in the upload form.`,
    });
  };

  // Effect to manage slideshow timer
  useEffect(() => {
    if (slideshowActive && slideshowPlaying) {
      startSlideshowTimer();
    } else {
      clearSlideshowTimer();
    }
    
    return () => {
      clearSlideshowTimer();
    };
  }, [slideshowActive, slideshowPlaying, startSlideshowTimer, clearSlideshowTimer]);

  // Keyboard event handlers for slideshow
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (event.code) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          nextPhoto();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          prevPhoto();
          break;
        case 'Space':
          event.preventDefault();
          if (slideshowActive) {
            if (slideshowPlaying) {
              pauseSlideshow();
            } else {
              resumeSlideshow();
            }
          }
          break;
        case 'Escape':
          event.preventDefault();
          if (slideshowActive) {
            stopSlideshow();
          } else {
            setLightboxOpen(false);
          }
          break;
      }
    };

    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxOpen, slideshowActive, slideshowPlaying, nextPhoto, prevPhoto, pauseSlideshow, resumeSlideshow, stopSlideshow]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearSlideshowTimer();
    };
  }, [clearSlideshowTimer]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Gallery Content */}
        <div className="lg:col-span-3 p-6">
          {/* Media Type Tabs */}
          <Tabs value={activeMediaType} onValueChange={(value) => setActiveMediaType(value as MediaType)} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold flex items-center space-x-2">
                  {(() => {
                    const IconComponent = getMediaTypeIcon(activeMediaType);
                    return <IconComponent className="w-5 h-5 text-primary" />;
                  })()}
                  <span>{getMediaTypeLabel(activeMediaType)} Gallery</span>
                </h3>
                <Badge variant="secondary" className="text-sm">
                  {photos.length} {photos.length === 1 ? getMediaTypeLabel(activeMediaType) : `${getMediaTypeLabel(activeMediaType)}s`}
                </Badge>
              </div>
              
              <TabsList className="grid w-auto grid-cols-3">
                <TabsTrigger 
                  value="photo" 
                  className="flex items-center space-x-1" 
                  data-testid="tab-photos"
                  onClick={() => setActiveMediaType('photo')}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Photos</span>
                  {photosCount > 0 && <Badge variant="secondary" className="ml-1 text-xs">{photosCount}</Badge>}
                </TabsTrigger>
                <TabsTrigger 
                  value="video" 
                  className="flex items-center space-x-1" 
                  data-testid="tab-videos"
                  onClick={() => setActiveMediaType('video')}
                >
                  <Video className="w-4 h-4" />
                  <span>Videos</span>
                  {videosCount > 0 && <Badge variant="secondary" className="ml-1 text-xs">{videosCount}</Badge>}
                </TabsTrigger>
                <TabsTrigger 
                  value="audio" 
                  className="flex items-center space-x-1" 
                  data-testid="tab-audio"
                  onClick={() => setActiveMediaType('audio')}
                >
                  <Music className="w-4 h-4" />
                  <span>Audio</span>
                  {audiosCount > 0 && <Badge variant="secondary" className="ml-1 text-xs">{audiosCount}</Badge>}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {photos.length > 0 && activeMediaType === 'photo' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startSlideshow}
                    className="flex items-center space-x-2"
                    data-testid="button-start-slideshow"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Slideshow</span>
                  </Button>
                )}
              </div>
              
              <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center space-x-2"
                    data-testid={`button-add-${activeMediaType}`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Add {getMediaTypeLabel(activeMediaType)}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload {getMediaTypeLabel(activeMediaType)}</DialogTitle>
                    <DialogDescription>
                      Add a meaningful {activeMediaType} to this memorial gallery. Share precious memories with family and friends.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    {/* Media Type Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Media Type</label>
                      <div className="flex space-x-2">
                        {(['photo', 'video', 'audio'] as const).map((type) => {
                          const IconComponent = getMediaTypeIcon(type);
                          return (
                            <Button
                              key={type}
                              type="button"
                              variant={uploadForm.mediaType === type ? "default" : "outline"}
                              size="sm"
                              onClick={() => setUploadForm(prev => ({ ...prev, mediaType: type as MediaType }))}
                              className="flex items-center space-x-1"
                              data-testid={`button-media-type-${type}`}
                            >
                              <IconComponent className="w-4 h-4" />
                              <span>{getMediaTypeLabel(type)}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Drag and Drop Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive 
                          ? "border-primary bg-primary/5" 
                          : "border-muted-foreground/25 hover:border-muted-foreground/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      data-testid={`dropzone-${activeMediaType}`}
                    >
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop {uploadForm.mediaType}s here, or paste URL below
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {uploadForm.mediaType === 'photo' && 'Supports JPG, PNG, GIF up to 10MB'}
                        {uploadForm.mediaType === 'video' && 'Supports MP4, AVI, MOV up to 100MB'}
                        {uploadForm.mediaType === 'audio' && 'Supports MP3, WAV, M4A up to 25MB'}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">{getMediaTypeLabel(uploadForm.mediaType)} URL</label>
                        <Input
                          type="url"
                          placeholder={`https://example.com/${uploadForm.mediaType === 'photo' ? 'photo.jpg' : uploadForm.mediaType === 'video' ? 'video.mp4' : 'audio.mp3'}`}
                          value={uploadForm.photoUrl}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, photoUrl: e.target.value }))}
                          required
                          data-testid={`input-${uploadForm.mediaType}-url`}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Caption (optional)</label>
                        <Textarea
                          placeholder={`Add a caption for this ${uploadForm.mediaType}...`}
                          value={uploadForm.caption}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                          rows={2}
                          data-testid={`input-${uploadForm.mediaType}-caption`}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Your Name (optional)</label>
                        <Input
                          type="text"
                          placeholder="Who is uploading this?"
                          value={uploadForm.uploaderName}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, uploaderName: e.target.value }))}
                          data-testid="input-uploader-name"
                        />
                      </div>

                      {uploadForm.mediaType === 'photo' && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="cover-photo"
                            checked={uploadForm.isCoverPhoto}
                            onCheckedChange={(checked) => setUploadForm(prev => ({ ...prev, isCoverPhoto: !!checked }))}
                            data-testid="checkbox-cover-photo"
                          />
                          <label htmlFor="cover-photo" className="text-sm font-medium cursor-pointer">
                            Set as cover photo
                          </label>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setUploadModalOpen(false)}
                        data-testid="button-cancel-upload"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={uploadPhotoMutation.isPending || !uploadForm.photoUrl.trim()}
                        data-testid="button-submit-upload"
                      >
                        {uploadPhotoMutation.isPending ? "Uploading..." : `Upload ${getMediaTypeLabel(uploadForm.mediaType)}`}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Gallery Content Tabs */}
            <TabsContent value={activeMediaType} className="mt-0">
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted"
                      onClick={() => openLightbox(index)}
                      data-testid={`${activeMediaType}-thumbnail-${photo.id}`}
                    >
                      {activeMediaType === 'photo' && (
                        <img
                          src={photo.photoUrl}
                          alt={photo.caption || "Memorial photo"}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                      
                      {activeMediaType === 'video' && (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                          <Video className="w-12 h-12 text-white/80" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white bg-black/50 rounded-full p-2" />
                          </div>
                        </div>
                      )}
                      
                      {activeMediaType === 'audio' && (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Music className="w-12 h-12 text-white" />
                        </div>
                      )}
                      
                      {/* Cover Photo Badge */}
                      {photo.isCoverPhoto && activeMediaType === 'photo' && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>Cover</span>
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex space-x-2">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <Eye className="w-4 h-4 text-gray-900" />
                            </div>
                            {activeMediaType === 'photo' && !photo.isCoverPhoto && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetCoverPhoto(photo.id);
                                }}
                                className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white"
                                data-testid={`button-set-cover-${photo.id}`}
                              >
                                <Star className="w-4 h-4 text-gray-900" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Media Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-xs space-y-1">
                          {photo.caption && (
                            <p className="truncate font-medium">{photo.caption}</p>
                          )}
                          <div className="flex items-center justify-between text-white/80">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{photo.createdAt ? format(new Date(photo.createdAt), "MMM dd") : "Recent"}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{photo.uploaderName || photo.uploadedBy || "Family"}</span>
                            </span>
                          </div>
                          {photo.viewCount && photo.viewCount > 0 && (
                            <div className="flex items-center space-x-1 text-white/60">
                              <Eye className="w-3 h-3" />
                              <span>{photo.viewCount} views</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    {(() => {
                      const IconComponent = getMediaTypeIcon(activeMediaType);
                      return <IconComponent className="w-8 h-8 text-muted-foreground" />;
                    })()}
                  </div>
                  <h4 className="text-lg font-medium mb-2">No {activeMediaType}s yet</h4>
                  <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                    Share precious memories by uploading {activeMediaType}s to this memorial gallery.
                  </p>
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    className="flex items-center space-x-2"
                    data-testid={`button-upload-first-${activeMediaType}`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload First {getMediaTypeLabel(activeMediaType)}</span>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Gallery Sidebar */}
        <div className="lg:col-span-1 bg-muted/30 p-6 space-y-6">
          {/* Memorial Views Section - Prominent display inspired by ForeverMissed */}
          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-foreground">
                <Eye className="w-6 h-6 text-primary" />
                <span data-testid="text-memorial-views">
                  {(memorial.viewCount || 0).toLocaleString()} Views
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span data-testid="text-memorial-access">
                  {memorial.privacy === 'private' ? 'Private access' : 'Open access'}
                </span>
              </div>
            </div>
          </div>

          {/* Memorial Administrator Section */}
          <div className="bg-background/80 rounded-lg p-4 border border-border/50">
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Memorial Administrator</span>
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This memorial is administered by:
              </p>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-primary" />
                <span 
                  className="font-medium text-foreground"
                  data-testid="text-administrator-name"
                >
                  {(() => {
                    // Administrator Resolution Priority (in order):
                    // 1. memorial.administratorName (from joined user data)
                    // 2. memorial.submittedBy if it's a display name (not UUID)
                    // 3. Most active contributor (person with most uploads)
                    // 4. Default to "Family Administrator" as last resort
                    
                    // Priority 1: Use proper administrator name from backend join
                    const memorialWithAdmin = memorial as any;
                    if (memorialWithAdmin.administratorName?.trim()) {
                      return memorialWithAdmin.administratorName.trim();
                    }
                    
                    // Priority 2: Check if submittedBy contains actual display name (not just UUID)
                    if (memorial.submittedBy) {
                      // If submittedBy looks like a display name (contains spaces/chars), use it
                      // Otherwise it's likely just a UUID, so continue to fallback logic
                      if (memorial.submittedBy.includes(' ') || memorial.submittedBy.length < 20) {
                        return memorial.submittedBy;
                      }
                    }
                    
                    // Priority 3: Find most active contributor (person with most uploads)
                    if (allPhotos?.length > 0) {
                      const uploaderCounts = new Map<string, number>();
                      
                      // Count uploads per person
                      allPhotos
                        .filter(photo => photo.uploaderName?.trim())
                        .forEach(photo => {
                          const name = photo.uploaderName!.trim();
                          uploaderCounts.set(name, (uploaderCounts.get(name) || 0) + 1);
                        });
                      
                      // Find the person with most uploads (most active contributor)
                      if (uploaderCounts.size > 0) {
                        let mostActiveContributor = '';
                        let maxUploads = 0;
                        
                        uploaderCounts.forEach((count, name) => {
                          if (count > maxUploads) {
                            maxUploads = count;
                            mostActiveContributor = name;
                          }
                        });
                        
                        if (mostActiveContributor) {
                          return mostActiveContributor;
                        }
                      }
                    }
                    
                    // Priority 4: Final fallback - use a default administrator name
                    return "Family Administrator";
                  })()}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span data-testid="text-administrator-status">
                  Active memorial steward
                </span>
              </div>
            </div>
          </div>

          {/* Gallery Statistics */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Gallery Statistics</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  <span>Photos</span>
                </span>
                <span className="font-medium">{photosCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-muted-foreground" />
                  <span>Videos</span>
                </span>
                <span className="font-medium">{videosCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <Music className="w-4 h-4 text-muted-foreground" />
                  <span>Audio</span>
                </span>
                <span className="font-medium">{audiosCount}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>Total Media</span>
                </span>
                <span className="text-primary">{totalCount}</span>
              </div>
            </div>
          </div>

          {/* Cover Photo Display */}
          {coverPhoto && (
            <div>
              <h4 className="font-semibold mb-4 flex items-center space-x-2">
                <Star className="w-4 h-4 text-primary" />
                <span>Cover Photo</span>
              </h4>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={coverPhoto.photoUrl}
                  alt="Cover photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs font-medium truncate">
                    {coverPhoto.caption || "Cover Photo"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Share Memorial Section */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-primary" />
              <span>Share Memorial</span>
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Share {memorial.firstName}'s memorial with family and friends
              </p>
              
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareWhatsApp}
                  className="w-full justify-start text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366]/10"
                  data-testid="button-share-whatsapp-gallery"
                >
                  <FaWhatsapp className="w-4 h-4 mr-2" />
                  Share on WhatsApp
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareFacebook}
                  className="w-full justify-start text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2]/10"
                  data-testid="button-share-facebook-gallery"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Share on Facebook
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareEmail}
                  className="w-full justify-start text-[#EA4335] border-[#EA4335]/20 hover:bg-[#EA4335]/10"
                  data-testid="button-share-email-gallery"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Share via Email
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="w-full justify-start"
                  data-testid="button-copy-link-gallery"
                >
                  {linkCopied ? (
                    <>
                      <div className="w-4 h-4 text-green-500 mr-2">✓</div>
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      <span>Copy Link</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Invite Family & Friends Section */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-primary" />
              <span>Invite Family & Friends</span>
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Invite others to view and contribute to {memorial.firstName}'s memorial
              </p>
              
              <Button
                onClick={() => setInvitationModalOpen(true)}
                className="w-full"
                data-testid="button-open-invitation-modal"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Now
              </Button>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>Help family and friends:</span>
                </div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-6">
                  <li>• Share precious memories</li>
                  <li>• Upload photos and videos</li>
                  <li>• Leave heartfelt tributes</li>
                  <li>• Support the family</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support Section */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Have a suggestion?</span>
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Help us improve by sharing your thoughts about this memorial page
              </p>
              
              <Button
                onClick={() => setContactModalOpen(true)}
                variant="outline"
                className="w-full justify-start"
                data-testid="button-contact-support"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>We value your feedback</span>
                </div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-6">
                  <li>• General suggestions</li>
                  <li>• Technical issues</li>
                  <li>• Content concerns</li>
                  <li>• Feature requests</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Recent Activity</span>
            </h4>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((item) => {
                  const mediaType = (item.mediaType === 'video' || item.mediaType === 'audio') ? item.mediaType as MediaType : 'photo' as MediaType;
                  const IconComponent = getMediaTypeIcon(mediaType);
                  return (
                    <div key={item.id} className="flex items-center space-x-3 text-sm">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate">
                          <span className="font-medium">{item.uploaderName || "Someone"}</span>
                          <span className="text-muted-foreground"> uploaded a {item.mediaType || 'photo'}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.createdAt ? format(new Date(item.createdAt), "MMM dd, h:mm a") : "Recently"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>

          {/* Gallery Summary */}
          {totalCount > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>
                  {totalCount} memories • Last updated{" "}
                  {allPhotos?.[0]?.createdAt 
                    ? format(new Date(allPhotos[0].createdAt), "MMM dd, yyyy")
                    : "recently"
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95" aria-describedby="lightbox-description">
          <DialogHeader className="absolute -top-10 left-0 opacity-0 pointer-events-none">
            <DialogTitle id="lightbox-title">{getMediaTypeLabel(activeMediaType)} Gallery Lightbox</DialogTitle>
            <DialogDescription id="lightbox-description">
              Viewing {activeMediaType} {currentPhotoIndex + 1} of {photos.length} in full-size view
            </DialogDescription>
          </DialogHeader>
          {photos.length > 0 && photos[currentPhotoIndex] && (
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  if (slideshowActive) {
                    stopSlideshow();
                  } else {
                    setLightboxOpen(false);
                  }
                }}
                className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full backdrop-blur-sm"
                data-testid="button-close-lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Slideshow Controls */}
              {slideshowActive && (
                <div className="absolute top-4 left-4 z-50 flex items-center space-x-2">
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => {
                      if (slideshowPlaying) {
                        pauseSlideshow();
                      } else {
                        resumeSlideshow();
                      }
                    }}
                    className="text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full backdrop-blur-sm"
                    data-testid="button-slideshow-toggle"
                  >
                    {slideshowPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Stop Slideshow Button */}
                  <button
                    onClick={stopSlideshow}
                    className="text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full backdrop-blur-sm"
                    data-testid="button-slideshow-stop"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                  
                  {/* Skip Controls */}
                  <button
                    onClick={prevPhotoSlideshow}
                    className="text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full backdrop-blur-sm"
                    data-testid="button-slideshow-prev"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={nextPhotoSlideshow}
                    className="text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full backdrop-blur-sm"
                    data-testid="button-slideshow-next"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Slideshow Progress Indicator */}
              {slideshowActive && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Slideshow</span>
                    <span className="opacity-75">({currentPhotoIndex + 1}/{photos.length})</span>
                    {slideshowPlaying && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-2 w-64 bg-white/20 rounded-full h-1 overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-300 ease-out"
                      style={{ width: `${((currentPhotoIndex + 1) / photos.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full backdrop-blur-sm"
                    data-testid={`button-prev-${activeMediaType}`}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full backdrop-blur-sm"
                    data-testid={`button-next-${activeMediaType}`}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              
              {/* Main Media */}
              <div className="flex items-center justify-center min-h-[60vh] p-4">
                {activeMediaType === 'photo' && (
                  <img
                    src={photos[currentPhotoIndex].photoUrl}
                    alt={photos[currentPhotoIndex].caption || "Memorial photo"}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                    data-testid="lightbox-photo"
                  />
                )}
                {activeMediaType === 'video' && (
                  <video
                    src={photos[currentPhotoIndex].photoUrl}
                    controls
                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                    data-testid="lightbox-video"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                {activeMediaType === 'audio' && (
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-lg shadow-2xl">
                    <div className="text-center mb-4">
                      <Music className="w-16 h-16 text-white mx-auto mb-4" />
                      <h3 className="text-white text-lg font-medium">
                        {photos[currentPhotoIndex].caption || "Audio Memory"}
                      </h3>
                    </div>
                    <audio
                      src={photos[currentPhotoIndex].photoUrl}
                      controls
                      className="w-full"
                      data-testid="lightbox-audio"
                    >
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                )}
              </div>
              
              {/* Media Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {photos[currentPhotoIndex].caption || `Memorial ${getMediaTypeLabel(activeMediaType)}`}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {photos[currentPhotoIndex].isCoverPhoto && activeMediaType === 'photo' && (
                        <Badge variant="secondary" className="bg-yellow-500/80 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Cover
                        </Badge>
                      )}
                      <span className="text-sm opacity-75">
                        {currentPhotoIndex + 1} of {photos.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm opacity-75">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {photos[currentPhotoIndex].createdAt 
                          ? format(new Date(photos[currentPhotoIndex].createdAt), "MMMM dd, yyyy")
                          : "Recently added"
                        }
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{photos[currentPhotoIndex].uploaderName || photos[currentPhotoIndex].uploadedBy || "Family"}</span>
                    </span>
                    {photos[currentPhotoIndex].viewCount && photos[currentPhotoIndex].viewCount > 0 && (
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{photos[currentPhotoIndex].viewCount} views</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invitation Modal */}
      <InvitationModal
        open={invitationModalOpen}
        onOpenChange={setInvitationModalOpen}
        memorial={memorial}
      />

      {/* Contact Support Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              We value your feedback! Share your thoughts about {memorial.firstName}'s memorial page or suggest improvements.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What can we help you with?</label>
              <select
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                data-testid="select-contact-subject"
              >
                <option value="general_inquiry">General Inquiry</option>
                <option value="suggestion">Suggestion for Improvement</option>
                <option value="technical_issue">Technical Issue</option>
                <option value="content_concern">Content Concern</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message *</label>
              <Textarea
                placeholder="Please share your feedback, suggestion, or concern with us..."
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                required
                className="min-h-24"
                data-testid="textarea-contact-message"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Email (optional)</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                data-testid="input-contact-email"
              />
              <p className="text-xs text-muted-foreground">
                Leave your email if you'd like us to respond to your message
              </p>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setContactModalOpen(false)}
                className="flex-1"
                data-testid="button-contact-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!contactForm.message.trim() || submitContactMutation.isPending}
                className="flex-1"
                data-testid="button-contact-submit"
              >
                {submitContactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}