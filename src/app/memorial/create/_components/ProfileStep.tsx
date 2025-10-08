"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { BACKGROUND_THEMES, getThemesByCategory } from "@/lib/themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileStepProps {
  data: {
    full_name: string;
    date_of_birth: string;
    date_of_death: string;
    age_at_death: number | null;
    profile_photo_url: string;
    verse: string;
    background_theme?: string;
    custom_background_url?: string;
    funeral_date?: string;
    funeral_time?: string;
    funeral_location?: string;
  };
  updateData: (data: any) => void;
}

export default function ProfileStep({ data, updateData }: ProfileStepProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to upload photos");
        return;
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `profile-${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("memorial-photos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("memorial-photos")
        .getPublicUrl(fileName);

      updateData({ profile_photo_url: publicUrl });
      toast.success("Profile photo uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB max for backgrounds)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadingBg(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to upload photos");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `background-${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("memorial-photos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("memorial-photos")
        .getPublicUrl(fileName);

      updateData({ custom_background_url: publicUrl });
      toast.success("Background image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload background");
    } finally {
      setUploadingBg(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
          Profile Information
        </h2>
        <p className="text-muted-foreground text-lg">
          Tell us about the person you're honoring
        </p>
      </div>

      {/* Profile Photo */}
      <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/5">
        <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/10 shadow-lg">
          {data.profile_photo_url ? (
            <img
              src={data.profile_photo_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="h-16 w-16 text-primary/40" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-white"></div>
            </div>
          )}
        </div>
        <div className="text-center">
          <Label htmlFor="photo" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            <Camera className="h-4 w-4" />
            {uploading ? "Uploading..." : data.profile_photo_url ? "Change Photo" : "Upload Photo"}
          </Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handlePhotoUpload}
          />
          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG or WebP. Max 5MB.
          </p>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <Label htmlFor="full_name" className="required">
          Full Name *
        </Label>
        <Input
          id="full_name"
          placeholder="John Doe"
          value={data.full_name}
          onChange={(e) => updateData({ full_name: e.target.value })}
          required
          className="mt-1"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={data.date_of_birth}
            onChange={(e) => updateData({ date_of_birth: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="date_of_death">Date of Death</Label>
          <Input
            id="date_of_death"
            type="date"
            value={data.date_of_death}
            onChange={(e) => updateData({ date_of_death: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="age_at_death">Age at Passing</Label>
          <Input
            id="age_at_death"
            type="number"
            value={data.age_at_death || ""}
            readOnly
            disabled
            className="mt-1 bg-muted"
            placeholder="Auto-calculated"
          />
        </div>
      </div>

      {/* Background Theme */}
      <div className="space-y-3 p-5 bg-accent/5 rounded-xl border border-accent/10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <ImageIcon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <Label htmlFor="background_theme" className="text-base font-semibold">Background Theme</Label>
            <p className="text-xs text-muted-foreground">Choose a visual theme for the memorial page</p>
          </div>
        </div>
        <Select
          value={data.background_theme || "nature-roses"}
          onValueChange={(value) => updateData({ background_theme: value, custom_background_url: "" })}
        >
          <SelectTrigger className="mt-2 h-11 bg-background hover:border-accent transition-colors">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Nature</div>
            <SelectItem value="nature-roses">🌹 Roses</SelectItem>
            <SelectItem value="nature-lilies">🌸 Lilies</SelectItem>
            <SelectItem value="nature-mountains">⛰️ Mountains</SelectItem>
            <SelectItem value="nature-beach">🏖️ Beach</SelectItem>
            <SelectItem value="nature-sunset">🌅 Sunset</SelectItem>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Sky</div>
            <SelectItem value="sky-clouds">☁️ Clouds</SelectItem>
            <SelectItem value="sky-stars">✨ Starry Night</SelectItem>
            <SelectItem value="sky-moon">🌙 Moonlight</SelectItem>
            <SelectItem value="sky-aurora">🌌 Aurora</SelectItem>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Abstract</div>
            <SelectItem value="abstract-marble">🪨 Marble</SelectItem>
            <SelectItem value="abstract-bokeh">💫 Bokeh</SelectItem>
            <SelectItem value="abstract-gradient">🎨 Soft Gradient</SelectItem>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Symbolic</div>
            <SelectItem value="symbolic-candles">🕯️ Candles</SelectItem>
            <SelectItem value="symbolic-doves">🕊️ Doves</SelectItem>
            <SelectItem value="symbolic-hands">🤝 Holding Hands</SelectItem>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Solid</div>
            <SelectItem value="solid-white">⚪ Pure White</SelectItem>
            <SelectItem value="solid-grey">⚫ Soft Grey</SelectItem>
            <SelectItem value="solid-beige">🤎 Warm Beige</SelectItem>
            <SelectItem value="solid-navy">🔵 Deep Navy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Background Upload */}
      <div className="space-y-3 p-5 bg-primary/5 rounded-xl border border-dashed border-primary/20">
        <div className="flex items-center gap-2">
          <Label htmlFor="custom_background" className="text-base font-semibold">Or Upload Custom Background</Label>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label
              htmlFor="custom_background"
              className="cursor-pointer flex items-center justify-center gap-3 w-full h-24 bg-background border border-primary/10 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
            >
              {uploadingBg ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              ) : data.custom_background_url ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-accent rounded-full">
                    <ImageIcon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <span className="text-sm font-medium text-accent">Custom background uploaded ✓</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-muted rounded-full">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Click to upload custom background</span>
                </div>
              )}
            </Label>
            <Input
              id="custom_background"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingBg}
              onChange={handleBackgroundUpload}
            />
          </div>
          {data.custom_background_url && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => updateData({ custom_background_url: "" })}
              className="shrink-0"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG or WebP. Max 10MB. Custom background overrides theme selection.
        </p>
      </div>

      {/* Optional Verse */}
      <div>
        <Label htmlFor="verse">Optional Verse or Quote</Label>
        <Textarea
          id="verse"
          placeholder="A meaningful quote, verse, or saying..."
          value={data.verse}
          onChange={(e) => updateData({ verse: e.target.value })}
          rows={3}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This will appear on the memorial page hero section.
        </p>
      </div>

      {/* Funeral Information */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Funeral Service Details</h3>
          <p className="text-sm text-muted-foreground mb-4">Optional: Add details about the funeral or memorial service</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="funeral_date">Service Date</Label>
            <Input
              id="funeral_date"
              type="date"
              value={data.funeral_date || ""}
              onChange={(e) => updateData({ funeral_date: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="funeral_time">Service Time</Label>
            <Input
              id="funeral_time"
              type="time"
              value={data.funeral_time || ""}
              onChange={(e) => updateData({ funeral_time: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="funeral_location">Service Location</Label>
          <Input
            id="funeral_location"
            placeholder="e.g., St. Mary's Church, 123 Main Street, City"
            value={data.funeral_location || ""}
            onChange={(e) => updateData({ funeral_location: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
