import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
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
  Bell,
  BellOff,
  Plus // Imported Plus icon
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
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

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

  // Subscription status query
  const { data: subscriptionStatus, isLoading: subscriptionLoading, error: subscriptionError } = useQuery({
    queryKey: ["/api/memorials", memorialId, "subscription", isAuthenticated ? "user" : (subscriptionEmail || "none")],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (!isAuthenticated && subscriptionEmail) {
        params.append('email', subscriptionEmail.trim());
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch(`/api/memorials/${memorialId}/subscription?${params}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        return response.json();
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection.');
        }
        throw error;
      }
    },
    enabled: !!memorialId && (!authLoading) && (isAuthenticated || !!subscriptionEmail.trim()), // Only fetch when auth state is resolved and we have user or email
    retry: 2, // Allow 2 retries for network issues
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
  });

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async (data: { email?: string; subscriptionType?: string }) => {
      return apiRequest("POST", `/api/memorials/${memorialId}/subscription`, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "subscription"] });
      // For guests, keep email and input visible for subscription management
      if (isAuthenticated) {
        setShowEmailInput(false);
        setSubscriptionEmail("");
      }
      // For guests, email stays visible for unsubscribe capability
      toast({
        title: "Successfully subscribed!",
        description: `You'll receive updates about ${memorial.firstName}'s memorial.`,
      });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to subscribe. Please try again.";
      let errorTitle = "Subscription failed";

      if (error?.response?.status === 409) {
        errorMessage = "You're already subscribed to this memorial with this email address.";
        errorTitle = "Already subscribed";
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "Please check your email address and try again.";
        errorTitle = "Invalid request";
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error occurred. Please try again in a few minutes.";
        errorTitle = "Server error";
      } else if (error?.message?.includes('timeout') || error?.message?.includes('network')) {
        errorMessage = "Connection timeout. Please check your internet and try again.";
        errorTitle = "Connection error";
      } else {
        errorMessage = error?.response?.data?.message || error?.message || errorMessage;
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Unsubscribe mutation
  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      const params = new URLSearchParams();
      if (!isAuthenticated && subscriptionEmail) {
        params.append('email', subscriptionEmail);
      }
      return apiRequest("DELETE", `/api/memorials/${memorialId}/subscription?${params}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "subscription"] });
      // For guests, clear email after successful unsubscribe
      if (!isAuthenticated) {
        setSubscriptionEmail("");
        setShowEmailInput(false);
      }
      toast({
        title: "Successfully unsubscribed",
        description: "You will no longer receive memorial updates.",
      });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to unsubscribe. Please try again.";
      let errorTitle = "Unsubscribe failed";

      if (error?.response?.status === 404) {
        errorMessage = "No active subscription found with this email address.";
        errorTitle = "Not subscribed";
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "Please check your email address and try again.";
        errorTitle = "Invalid request";
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error occurred. Please try again in a few minutes.";
        errorTitle = "Server error";
      } else if (error?.message?.includes('timeout') || error?.message?.includes('network')) {
        errorMessage = "Connection timeout. Please check your internet and try again.";
        errorTitle = "Connection error";
      } else {
        errorMessage = error?.response?.data?.message || error?.message || errorMessage;
      }

      toast({
        title: errorTitle,
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

  // Subscription handlers
  const handleSubscribe = () => {
    if (isAuthenticated) {
      // Authenticated user - subscribe directly
      subscribeMutation.mutate({ subscriptionType: "all_updates" });
    } else {
      // Guest user - show email input
      setShowEmailInput(true);
    }
  };

  const handleEmailSubscribe = () => {
    const email = subscriptionEmail.trim();

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address (e.g., name@example.com).",
        variant: "destructive",
      });
      return;
    }

    // Check for common email typos
    const commonTypos = /@(gmai\.com|gmial\.com|yahooo\.com|hotmial\.com)$/i;
    if (commonTypos.test(email)) {
      toast({
        title: "Please check your email",
        description: "Did you mean gmail.com or yahoo.com? Please double-check your email address.",
        variant: "destructive",
      });
      return;
    }

    subscribeMutation.mutate({
      email: email,
      subscriptionType: "all_updates"
    });
  };

  const handleUnsubscribe = () => {
    // For guests, validate email is present before unsubscribing
    if (!isAuthenticated && !subscriptionEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address to unsubscribe.",
        variant: "destructive",
      });
      setShowEmailInput(true);
      return;
    }
    unsubscribeMutation.mutate();
  };

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
            <div className="space-y-4 mb-6">
                {/* Mobile-optimized tab layout */}
                <div className="flex bg-muted rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setActiveMediaType('photo')}
                    className={`flex-1 px-2 py-3 text-xs sm:text-sm font-medium rounded-md transition-colors min-h-[44px] ${
                      activeMediaType === 'photo'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid="tab-photos"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>Photos</span>
                      {photosCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                          {photosCount}
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveMediaType('video')}
                    className={`flex-1 px-2 py-3 text-xs sm:text-sm font-medium rounded-md transition-colors min-h-[44px] ${
                      activeMediaType === 'video'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid="tab-videos"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>Videos</span>
                      {videosCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                          {videosCount}
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveMediaType('audio')}
                    className={`flex-1 px-2 py-3 text-xs sm:text-sm font-medium rounded-md transition-colors min-h-[44px] ${
                      activeMediaType === 'audio'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid="tab-audio"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>Audio</span>
                      {audiosCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                          {audiosCount}
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Mobile-optimized upload button */}
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  className="w-full min-h-[48px] text-base"
                  size="lg"
                  data-testid={`button-add-${activeMediaType}`}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Add {getMediaTypeLabel(activeMediaType)}
                </Button>
              </div>

            {/* Media Content Tabs */}
            <TabsContent value={activeMediaType} className="mt-0">
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
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
                <div className="text-center py-8 sm:py-12 px-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    {(() => {
                      const IconComponent = getMediaTypeIcon(activeMediaType);
                      return <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />;
                    })()}
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-foreground mb-2">No {activeMediaType}s yet</h4>
                  <p className="text-muted-foreground mb-6 sm:mb-8 max-w-sm mx-auto text-sm sm:text-base">
                    Share precious memories by uploading {activeMediaType}s to this memorial gallery.
                  </p>
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    size="lg"
                    className="w-full sm:w-auto min-h-[48px]"
                    data-testid={`button-upload-first-${activeMediaType}`}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload First {getMediaTypeLabel(activeMediaType)}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Gallery Sidebar */}
        <div className="lg:col-span-1 bg-muted/30 p-4 sm:p-6 space-y-4 sm:space-y-6">
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
                  className="w-full justify-start text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366]/10 min-h-[40px] text-xs sm:text-sm"
                  data-testid="button-share-whatsapp-gallery"
                >
                  <FaWhatsApp className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareFacebook}
                  className="w-full justify-start text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2]/10 min-h-[40px] text-xs sm:text-sm"
                  data-testid="button-share-facebook-gallery"
                >
                  <Facebook className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Facebook</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareEmail}
                  className="w-full justify-start text-[#EA4335] border-[#EA4335]/20 hover:bg-[#EA4335]/10 min-h-[40px] text-xs sm:text-sm"
                  data-testid="button-share-email-gallery"
                >
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Email</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="w-full justify-start min-h-[40px] text-xs sm:text-sm"
                  data-testid="button-copy-link-gallery"
                >
                  {linkCopied ? (
                    <>
                      <div className="w-4 h-4 text-green-500 mr-2 flex-shrink-0">✓</div>
                      <span className="truncate">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Copy Link</span>
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
                className="w-full min-h-[44px]"
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

          {/* Notification Preferences Section */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center space-x-2">
              <Bell className="w-4 h-4 text-primary" />
              <span>Notification Preferences</span>
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated when new photos, videos, or tributes are added to {memorial.firstName}'s memorial
              </p>

              {/* Subscription status */}
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm">
                  {subscriptionLoading ? (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">Checking subscription status...</span>
                    </>
                  ) : subscriptionStatus?.isSubscribed ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-foreground font-medium">
                        You are subscribed to memorial updates
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-muted-foreground">
                        You are not subscribed to memorial updates
                      </span>
                    </>
                  )}
                </div>
                {subscriptionStatus?.subscription && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Subscription type: {subscriptionStatus.subscription.subscriptionType?.replace('_', ' ') || 'All updates'}
                  </div>
                )}
              </div>

              {/* Email input for guest users */}
              {!isAuthenticated && showEmailInput && (
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={subscriptionEmail}
                    onChange={(e) => setSubscriptionEmail(e.target.value)}
                    className="w-full"
                    data-testid="input-subscription-email"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleEmailSubscribe}
                      disabled={subscribeMutation.isPending}
                      size="sm"
                      className="flex-1"
                      data-testid="button-confirm-email-subscribe"
                    >
                      {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowEmailInput(false);
                        // Clear email only if not subscribed
                        if (!subscriptionStatus?.isSubscribed) {
                          setSubscriptionEmail("");
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      data-testid="button-cancel-email-subscribe"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Show current subscription email for guests */}
              {!isAuthenticated && !showEmailInput && subscriptionStatus?.isSubscribed && subscriptionEmail && (
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                      <Mail className="w-4 h-4" />
                      <span>Subscribed as: <span className="font-medium">{subscriptionEmail}</span></span>
                    </div>
                    <Button
                      onClick={() => setShowEmailInput(true)}
                      variant="ghost"
                      size="sm"
                      className="text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                      data-testid="button-edit-subscription-email"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              )}

              {/* Subscribe/Unsubscribe button */}
              {!showEmailInput && (
                <Button
                  variant={subscriptionStatus?.isSubscribed ? "destructive" : "outline"}
                  className="w-full justify-start min-h-[44px]"
                  onClick={subscriptionStatus?.isSubscribed ? handleUnsubscribe : handleSubscribe}
                  disabled={subscriptionLoading || subscribeMutation.isPending || unsubscribeMutation.isPending || (!isAuthenticated && subscriptionStatus?.isSubscribed && !subscriptionEmail.trim())}
                  data-testid="button-toggle-subscription"
                >
                  {subscriptionStatus?.isSubscribed ? (
                    <>
                      <BellOff className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{unsubscribeMutation.isPending ? "Unsubscribing..." : "Unsubscribe"}</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{subscribeMutation.isPending ? "Subscribing..." :
                        (!isAuthenticated ? "Subscribe with Email" : "Subscribe to Updates")}</span>
                    </>
                  )}
                </Button>
              )}

              {/* Guest user notices */}
              {!isAuthenticated && !showEmailInput && !subscriptionStatus?.isSubscribed && (
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Note: You can subscribe as a guest using your email address</span>
                  </div>
                </div>
              )}

              {/* Guest unsubscribe notice */}
              {!isAuthenticated && !showEmailInput && subscriptionStatus?.isSubscribed && !subscriptionEmail.trim() && (
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-2 text-sm text-orange-700 dark:text-orange-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.898-.833-2.664 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>Enter your email address to manage your subscription</span>
                  </div>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 00-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>You'll be notified about:</span>
                </div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-6">
                  <li>• New photos and videos</li>
                  <li>• Heartfelt tributes</li>
                  <li>• Memorial updates</li>
                  <li>• Anniversary reminders</li>
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
                Help us improve by sharing your thoughts about {memorial.firstName}'s memorial page
              </p>

              <Button
                onClick={() => setContactModalOpen(true)}
                variant="outline"
                className="w-full justify-start min-h-[44px]"
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

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload {getMediaTypeLabel(uploadForm.mediaType)}</DialogTitle>
            <DialogDescription>
              Share a precious memory by uploading a {uploadForm.mediaType} to this memorial gallery.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="mediaUrl" className="text-sm font-medium">
                {getMediaTypeLabel(uploadForm.mediaType)} URL *
              </label>
              <Input
                id="mediaUrl"
                type="url"
                placeholder={`Enter the ${uploadForm.mediaType} URL`}
                value={uploadForm.photoUrl}
                onChange={(e) => setUploadForm(prev => ({ ...prev, photoUrl: e.target.value }))}
                required
                data-testid="input-upload-url"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="caption" className="text-sm font-medium">Caption (optional)</label>
              <Textarea
                id="caption"
                placeholder={`Add a caption for your ${uploadForm.mediaType}...`}
                value={uploadForm.caption}
                onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                className="min-h-20"
                data-testid="textarea-upload-caption"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="uploaderName" className="text-sm font-medium">Your Name (optional)</label>
              <Input
                id="uploaderName"
                type="text"
                placeholder="Your name (e.g., John Doe)"
                value={uploadForm.uploaderName}
                onChange={(e) => setUploadForm(prev => ({ ...prev, uploaderName: e.target.value }))}
                data-testid="input-upload-uploader-name"
              />
              <p className="text-xs text-muted-foreground">
                This name will be displayed with the {uploadForm.mediaType}
              </p>
            </div>

            {/* Cover Photo Option */}
            {uploadForm.mediaType === 'photo' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCoverPhoto"
                  checked={uploadForm.isCoverPhoto}
                  onCheckedChange={(checked) => setUploadForm(prev => ({ ...prev, isCoverPhoto: !!checked }))}
                />
                <label htmlFor="isCoverPhoto" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Set as Cover Photo
                </label>
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUploadModalOpen(false);
                  // Reset form state when closing
                  setUploadForm({
                    photoUrl: "",
                    caption: "",
                    mediaType: 'photo',
                    isCoverPhoto: false,
                    uploaderName: "",
                  });
                }}
                className="flex-1"
                data-testid="button-cancel-upload"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!uploadForm.photoUrl.trim() || uploadPhotoMutation.isPending}
                className="flex-1"
                data-testid="button-submit-upload"
              >
                {uploadPhotoMutation.isPending ? `Uploading ${uploadForm.mediaType}...` : `Upload ${getMediaTypeLabel(uploadForm.mediaType)}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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