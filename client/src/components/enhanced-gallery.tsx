import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MemorialPhoto } from "@shared/schema";
import {
  Upload,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Image as ImageIcon,
  Heart,
  Eye,
} from "lucide-react";

interface EnhancedGalleryProps {
  memorialId: string;
  photos: MemorialPhoto[];
  isLoading?: boolean;
}

export function EnhancedGallery({ memorialId, photos, isLoading }: EnhancedGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    photoUrl: "",
    caption: "",
  });
  const [dragActive, setDragActive] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadPhotoMutation = useMutation({
    mutationFn: async (data: { photoUrl: string; caption?: string }) => {
      return apiRequest("POST", `/api/memorials/${memorialId}/photos`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "photos"] });
      setUploadModalOpen(false);
      setUploadForm({ photoUrl: "", caption: "" });
      toast({
        title: "Photo uploaded successfully",
        description: "Your photo has been added to the memorial gallery.",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const startSlideshow = () => {
    if (photos.length > 0) {
      setCurrentPhotoIndex(0);
      setSlideshowActive(true);
      setLightboxOpen(true);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.photoUrl.trim()) return;
    
    uploadPhotoMutation.mutate({
      photoUrl: uploadForm.photoUrl.trim(),
      caption: uploadForm.caption.trim() || undefined,
    });
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
      description: "For this demo, please paste the image URL in the upload form.",
    });
  };

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
    <div className="bg-card rounded-xl p-6 shadow-sm">
      {/* Gallery Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span>Photo Gallery</span>
          </h3>
          <Badge variant="secondary" className="text-sm">
            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          {photos.length > 0 && (
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
          
          <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="flex items-center space-x-2"
                data-testid="button-add-photos"
              >
                <Upload className="w-4 h-4" />
                <span>Add Photos</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Photo</DialogTitle>
                <DialogDescription>
                  Add a meaningful photo to this memorial gallery. You can upload images by URL or drag and drop files.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleUploadSubmit} className="space-y-4">
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
                  data-testid="dropzone-photos"
                >
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop photos here, or paste URL below
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Photo URL</label>
                    <Input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={uploadForm.photoUrl}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, photoUrl: e.target.value }))}
                      required
                      data-testid="input-photo-url"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Caption (optional)</label>
                    <Textarea
                      placeholder="Add a caption for this photo..."
                      value={uploadForm.caption}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                      rows={2}
                      data-testid="input-photo-caption"
                    />
                  </div>
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
                    {uploadPhotoMutation.isPending ? "Uploading..." : "Upload Photo"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Gallery Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted"
              onClick={() => openLightbox(index)}
              data-testid={`photo-thumbnail-${photo.id}`}
            >
              <img
                src={photo.photoUrl}
                alt={photo.caption || "Memorial photo"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Eye className="w-4 h-4 text-gray-900" />
                  </div>
                </div>
              </div>
              
              {/* Photo Info Overlay */}
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
                    {/* Note: In a real app, you'd fetch uploader info */}
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>Family</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium mb-2">No photos yet</h4>
          <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
            Share precious memories by uploading photos to this memorial gallery.
          </p>
          <Button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center space-x-2"
            data-testid="button-upload-first-photo"
          >
            <Upload className="w-4 h-4" />
            <span>Upload First Photo</span>
          </Button>
        </div>
      )}

      {/* Gallery Statistics */}
      {photos.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <ImageIcon className="w-4 h-4" />
                <span>{photos.length} photos shared</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>Cherished memories</span>
              </span>
            </div>
            <span>
              Last updated {photos[0]?.createdAt ? format(new Date(photos[0].createdAt), "MMM dd, yyyy") : "recently"}
            </span>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95" aria-describedby="lightbox-description">
          <DialogHeader className="absolute -top-10 left-0 opacity-0 pointer-events-none">
            <DialogTitle id="lightbox-title">Photo Gallery Lightbox</DialogTitle>
            <DialogDescription id="lightbox-description">
              Viewing photo {currentPhotoIndex + 1} of {photos.length} in full-size view
            </DialogDescription>
          </DialogHeader>
          {photos.length > 0 && photos[currentPhotoIndex] && (
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                data-testid="button-close-lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation Buttons */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    data-testid="button-prev-photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    data-testid="button-next-photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Main Image */}
              <div className="relative">
                <img
                  src={photos[currentPhotoIndex].photoUrl}
                  alt={photos[currentPhotoIndex].caption || "Memorial photo"}
                  className="w-full h-auto max-h-[80vh] object-contain"
                  data-testid="lightbox-image"
                />
                
                {/* Photo Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-white">
                    {photos[currentPhotoIndex].caption && (
                      <h4 className="text-lg font-medium mb-2" data-testid="lightbox-caption">
                        {photos[currentPhotoIndex].caption}
                      </h4>
                    )}
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {photos[currentPhotoIndex].createdAt 
                              ? format(new Date(photos[currentPhotoIndex].createdAt), "MMMM dd, yyyy")
                              : "Recently uploaded"
                            }
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Shared by family</span>
                        </span>
                      </div>
                      {photos.length > 1 && (
                        <span>{currentPhotoIndex + 1} of {photos.length}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}