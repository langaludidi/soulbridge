import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Camera, X, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  memorialId?: string;
  onPhotoUploaded?: (imageUrl: string) => void;
  onPhotoRemoved?: () => void;
  currentPhoto?: string | null;
  label?: string;
  description?: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export function PhotoUpload({ 
  memorialId,
  onPhotoUploaded,
  onPhotoRemoved,
  currentPhoto,
  label = "Photo",
  description = "Upload a photo",
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  className = ""
}: PhotoUploadProps) {
  const [photoPreview, setPhotoPreview] = useState<string>(currentPhoto || "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      if (memorialId) {
        formData.append('memorialId', memorialId);
      }

      const response = await fetch('/api/upload/memorial-photo', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setPhotoPreview(data.imageUrl);
      onPhotoUploaded?.(data.imageUrl);
      toast({
        title: "Photo Uploaded",
        description: "Your photo has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (filename: string) => {
      const response = await apiRequest("DELETE", `/api/upload/memorial-photo/${filename}`);
      return response.json();
    },
    onSuccess: () => {
      setPhotoPreview("");
      onPhotoRemoved?.();
      toast({
        title: "Photo Removed",
        description: "The photo has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: "Failed to remove photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: `Please select a valid image file. Supported formats: ${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}.`,
        variant: "destructive",
      });
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: "File Too Large",
        description: `Please select an image smaller than ${maxSizeMB}MB.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    uploadPhotoMutation.mutate(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemovePhoto = () => {
    if (currentPhoto) {
      // Extract filename from URL for deletion
      const filename = currentPhoto.split('/').pop();
      if (filename) {
        deletePhotoMutation.mutate(filename);
      }
    } else {
      setPhotoPreview("");
      onPhotoRemoved?.();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const isUploading = uploadPhotoMutation.isPending;
  const isDeleting = deletePhotoMutation.isPending;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label className="text-base font-medium">{label}</Label>
        
        <div className="text-center">
          <div 
            className={`mx-auto w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isDragging 
                ? 'border-primary bg-primary/10' 
                : photoPreview 
                ? 'border-muted-foreground/30 bg-muted/30' 
                : 'border-muted-foreground/30 bg-muted/30 hover:border-primary hover:bg-primary/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={!photoPreview ? openFileDialog : undefined}
          >
            {photoPreview ? (
              <div className="relative w-full h-full">
                <img
                  src={photoPreview}
                  alt="Photo preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {(isUploading || isDeleting) && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
                {!isUploading && !isDeleting && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto();
                    }}
                    disabled={isDeleting}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Camera className="h-8 w-8 text-muted-foreground" />
                {isUploading && (
                  <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                )}
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex justify-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              
              {!photoPreview ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={openFileDialog}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={openFileDialog}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Maximum file size: {maxSizeMB}MB</p>
              <p>• Supported formats: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}</p>
              <p>• You can also drag and drop files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}