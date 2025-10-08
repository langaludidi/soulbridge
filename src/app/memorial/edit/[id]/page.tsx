"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

// Import step components
import ProfileStep from "../../create/_components/ProfileStep";
import ObituaryStep from "../../create/_components/ObituaryStep";
import FavoritesFormStep from "../../create/_components/FavoritesFormStep";
import GalleryStep from "../../create/_components/GalleryStep";
import TimelineStep from "../../create/_components/TimelineStep";
import RelationshipsStep from "../../create/_components/RelationshipsStep";
import EventsStep from "../../create/_components/EventsStep";
import DonationsRSVPStep from "../../create/_components/DonationsRSVPStep";
import PrivacyStep from "../../create/_components/PrivacyStep";

export default function EditMemorialPage() {
  const router = useRouter();
  const params = useParams();
  const memorialId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [memorial, setMemorial] = useState<any>(null);
  const [memorialData, setMemorialData] = useState({
    full_name: "",
    date_of_birth: "",
    date_of_death: "",
    age_at_death: null as number | null,
    profile_photo_url: "",
    verse: "",
    background_theme: "nature-roses",
    custom_background_url: "",
    funeral_date: "",
    funeral_time: "",
    funeral_location: "",
    obituary_short: "",
    obituary_full: "",
    favorite_quote: "",
    favorite_song: "",
    hobbies: [] as string[],
    personal_traits: [] as string[],
    privacy: "public" as "public" | "private" | "unlisted",
    allow_tributes: true,
    allow_donations: false,
    donation_link: "",
    rsvp_enabled: false,
    rsvp_event_date: "",
    rsvp_event_time: "",
    rsvp_event_location: "",
    rsvp_event_details: "",
  });

  useEffect(() => {
    fetchMemorial();
  }, []);

  // Auto-calculate age when dates change
  useEffect(() => {
    if (memorialData.date_of_birth && memorialData.date_of_death) {
      const birth = new Date(memorialData.date_of_birth);
      const death = new Date(memorialData.date_of_death);
      const age = death.getFullYear() - birth.getFullYear();
      setMemorialData((prev) => ({ ...prev, age_at_death: age }));
    }
  }, [memorialData.date_of_birth, memorialData.date_of_death]);

  const fetchMemorial = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in");
        router.push("/sign-in");
        return;
      }

      const { data, error } = await supabase
        .from("memorials")
        .select("*")
        .eq("id", memorialId)
        .single();

      if (error) throw error;

      // Check ownership
      if (data.user_id !== user.id) {
        toast.error("You don't have permission to edit this memorial");
        router.push("/dashboard");
        return;
      }

      setMemorial(data);
      setMemorialData({
        full_name: data.full_name || "",
        date_of_birth: data.date_of_birth || "",
        date_of_death: data.date_of_death || "",
        age_at_death: data.age_at_death,
        profile_photo_url: data.profile_photo_url || "",
        verse: data.verse || "",
        background_theme: data.background_theme || "nature-roses",
        custom_background_url: data.custom_background_url || "",
        funeral_date: data.funeral_date || "",
        funeral_time: data.funeral_time || "",
        funeral_location: data.funeral_location || "",
        obituary_short: data.obituary_short || "",
        obituary_full: data.obituary_full || "",
        favorite_quote: data.favorite_quote || "",
        favorite_song: data.favorite_song || "",
        hobbies: data.hobbies || [],
        personal_traits: data.personal_traits || [],
        privacy: data.privacy || "public",
        allow_tributes: data.allow_tributes ?? true,
        allow_donations: data.allow_donations || false,
        donation_link: data.donation_link || "",
        rsvp_enabled: data.rsvp_enabled || false,
        rsvp_event_date: data.rsvp_event_date || "",
        rsvp_event_time: data.rsvp_event_time || "",
        rsvp_event_location: data.rsvp_event_location || "",
        rsvp_event_details: data.rsvp_event_details || "",
      });
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to load memorial");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateMemorialData = (data: Partial<typeof memorialData>) => {
    setMemorialData((prev) => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("memorials")
        .update({
          full_name: memorialData.full_name,
          date_of_birth: memorialData.date_of_birth || null,
          date_of_death: memorialData.date_of_death || null,
          age_at_death: memorialData.age_at_death,
          profile_photo_url: memorialData.profile_photo_url || null,
          verse: memorialData.verse || null,
          background_theme: memorialData.background_theme || "nature-roses",
          custom_background_url: memorialData.custom_background_url || null,
          funeral_date: memorialData.funeral_date || null,
          funeral_time: memorialData.funeral_time || null,
          funeral_location: memorialData.funeral_location || null,
          obituary_short: memorialData.obituary_short || null,
          obituary_full: memorialData.obituary_full || null,
          favorite_quote: memorialData.favorite_quote || null,
          favorite_song: memorialData.favorite_song || null,
          hobbies: memorialData.hobbies || null,
          personal_traits: memorialData.personal_traits || null,
          privacy: memorialData.privacy,
          allow_tributes: memorialData.allow_tributes,
          allow_donations: memorialData.allow_donations,
          donation_link: memorialData.donation_link || null,
          rsvp_enabled: memorialData.rsvp_enabled,
          rsvp_event_date: memorialData.rsvp_event_date || null,
          rsvp_event_time: memorialData.rsvp_event_time || null,
          rsvp_event_location: memorialData.rsvp_event_location || null,
          rsvp_event_details: memorialData.rsvp_event_details || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", memorialId);

      if (error) throw error;

      toast.success("Memorial updated successfully!");
      router.push(`/memorial/${memorial.slug}`);
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading memorial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="border-l-4 border-primary pl-4">
              <h1 className="font-serif text-h1 md:text-4xl font-bold text-foreground mb-2">
                Edit Memorial
              </h1>
              <p className="text-muted-foreground text-lg">
                Update the memorial information for {memorial?.full_name}
              </p>
            </div>
            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-accent/10 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        {/* Profile Section */}
        <Card className="p-8 mb-6 shadow-md">
          <ProfileStep data={memorialData} updateData={updateMemorialData} />
        </Card>

        {/* Obituary Section */}
        <Card className="p-8 mb-6 shadow-md">
          <ObituaryStep data={memorialData} updateData={updateMemorialData} />
        </Card>

        {/* Favorites Section */}
        <Card className="p-8 mb-6 shadow-md">
          <FavoritesFormStep data={memorialData} updateData={updateMemorialData} />
        </Card>

        {/* Gallery Section */}
        <Card className="p-8 mb-6 shadow-md">
          <GalleryStep memorialId={memorialId} />
        </Card>

        {/* Timeline Section */}
        <Card className="p-8 mb-6 shadow-md">
          <TimelineStep memorialId={memorialId} />
        </Card>

        {/* Relationships Section */}
        <Card className="p-8 mb-6 shadow-md">
          <RelationshipsStep memorialId={memorialId} />
        </Card>

        {/* Events Section */}
        <Card className="p-8 mb-6 shadow-md">
          <EventsStep memorialId={memorialId} />
        </Card>

        {/* Donations & RSVP Section */}
        <Card className="p-8 mb-6 shadow-md">
          <DonationsRSVPStep data={memorialData} updateData={updateMemorialData} />
        </Card>

        {/* Privacy Section */}
        <Card className="p-8 mb-6 shadow-md">
          <PrivacyStep data={memorialData} updateData={updateMemorialData} />
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4 p-6 bg-gradient-to-br from-background to-muted/30 rounded-xl shadow-md">
          <Button variant="outline" onClick={() => router.back()} className="font-medium shadow-sm hover:shadow-md transition-all">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || !memorialData.full_name}
            className="font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
