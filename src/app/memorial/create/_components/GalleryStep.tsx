"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Music, Video, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface GalleryItem {
  id: string;
  type: "photo" | "video" | "audio";
  url: string;
  title: string;
}

interface GalleryStepProps {
  memorialId: string | null;
}

export default function GalleryStep({ memorialId }: GalleryStepProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (memorialId) {
      fetchGalleryItems();
    }
  }, [memorialId]);

  const fetchGalleryItems = async () => {
    if (!memorialId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("memorial_id", memorialId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setItems(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    file: File,
    type: "photo" | "video" | "audio"
  ) => {
    if (!memorialId) {
      toast.error("Please save the memorial as a draft first");
      return;
    }

    setUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${memorialId}/${Date.now()}.${fileExt}`;
      const bucketName = type === "photo" ? "memorial-photos" : type === "video" ? "memorial-videos" : "memorial-audio";

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase.from("gallery_items").insert({
        memorial_id: memorialId,
        type,
        url: publicUrl,
        title: file.name,
      } as never);

      if (dbError) throw dbError;

      toast.success("File uploaded successfully");
      fetchGalleryItems();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // TODO: Delete from storage as well
      toast.success("Item deleted");
      fetchGalleryItems();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete item");
    }
  };

  const photos = items.filter((item) => item.type === "photo");
  const videos = items.filter((item) => item.type === "video");
  const audio = items.filter((item) => item.type === "audio");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Gallery
        </h2>
        <p className="text-muted-foreground">
          Add photos, videos, and audio to celebrate their life
        </p>
      </div>

      {!memorialId && (
        <div className="bg-muted/30 border border-border rounded-token p-4">
          <p className="text-sm text-muted-foreground">
            Please save the memorial as a draft first to enable file uploads.
          </p>
        </div>
      )}

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="photos" className="flex-1">
            <Camera className="h-4 w-4 mr-2" />
            Photos ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex-1">
            <Video className="h-4 w-4 mr-2" />
            Videos ({videos.length})
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex-1">
            <Music className="h-4 w-4 mr-2" />
            Audio ({audio.length})
          </TabsTrigger>
        </TabsList>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-token p-8 text-center">
            <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <Label
              htmlFor="photo-upload"
              className="cursor-pointer text-accent hover:underline"
            >
              {uploading ? "Uploading..." : "Click to upload photos"}
            </Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              disabled={!memorialId || uploading}
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach((file) => handleFileUpload(file, "photo"));
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG or WebP. Max 10MB per file.
            </p>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full aspect-square object-cover rounded-token"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-token flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-token p-8 text-center">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <Label
              htmlFor="video-upload"
              className="cursor-pointer text-accent hover:underline"
            >
              {uploading ? "Uploading..." : "Click to upload videos"}
            </Label>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              multiple
              disabled={!memorialId || uploading}
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach((file) => handleFileUpload(file, "video"));
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              MP4, WebM. Max 100MB per file.
            </p>
          </div>

          {videos.length > 0 && (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="relative group">
                  <video
                    src={video.url}
                    controls
                    className="w-full rounded-token"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Audio Tab */}
        <TabsContent value="audio" className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-token p-8 text-center">
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <Label
              htmlFor="audio-upload"
              className="cursor-pointer text-accent hover:underline"
            >
              {uploading ? "Uploading..." : "Click to upload audio"}
            </Label>
            <Input
              id="audio-upload"
              type="file"
              accept="audio/*"
              multiple
              disabled={!memorialId || uploading}
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach((file) => handleFileUpload(file, "audio"));
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              MP3, WAV. Max 10MB per file.
            </p>
          </div>

          {audio.length > 0 && (
            <div className="space-y-4">
              {audio.map((audioItem) => (
                <div
                  key={audioItem.id}
                  className="border border-border rounded-token p-4"
                >
                  <p className="text-sm font-medium text-foreground mb-2">
                    {audioItem.title}
                  </p>
                  <audio src={audioItem.url} controls className="w-full mb-2" />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(audioItem.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
