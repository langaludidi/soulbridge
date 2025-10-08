"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";

// Import step components
import ProfileStep from "./_components/ProfileStep";
import ObituaryStep from "./_components/ObituaryStep";
import FavoritesFormStep from "./_components/FavoritesFormStep";
import GalleryStep from "./_components/GalleryStep";
import TimelineStep from "./_components/TimelineStep";
import RelationshipsStep from "./_components/RelationshipsStep";
import EventsStep from "./_components/EventsStep";
import DonationsRSVPStep from "./_components/DonationsRSVPStep";
import PrivacyStep from "./_components/PrivacyStep";
import ReviewStep from "./_components/ReviewStep";

const steps = [
  { number: 1, title: "Profile", description: "Basic information" },
  { number: 2, title: "Obituary", description: "Life story" },
  { number: 3, title: "Favorites", description: "Personality" },
  { number: 4, title: "Gallery", description: "Photos & videos" },
  { number: 5, title: "Timeline", description: "Life events" },
  { number: 6, title: "Relationships", description: "Family & friends" },
  { number: 7, title: "Events", description: "Memorial services" },
  { number: 8, title: "Donations & RSVP", description: "Additional features" },
  { number: 9, title: "Privacy", description: "Who can view" },
  { number: 10, title: "Review", description: "Final review" },
];

export default function CreateMemorialPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [memorialId, setMemorialId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [memorialData, setMemorialData] = useState({
    // Step 1: Profile
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

    // Step 2: Obituary
    obituary_short: "",
    obituary_full: "",

    // Step 3: Favorites
    favorite_quote: "",
    favorite_song: "",
    hobbies: [] as string[],
    personal_traits: [] as string[],

    // Step 9: Privacy
    privacy: "public" as "public" | "private" | "unlisted",
    allow_tributes: true,

    // Step 8: Donations & RSVP
    allow_donations: false,
    donation_link: "",
    rsvp_enabled: false,
    rsvp_event_date: "",
    rsvp_event_time: "",
    rsvp_event_location: "",
    rsvp_event_details: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to create a memorial");
      router.push("/sign-in");
    }
  };

  // Auto-calculate age when dates change
  useEffect(() => {
    if (memorialData.date_of_birth && memorialData.date_of_death) {
      const birth = new Date(memorialData.date_of_birth);
      const death = new Date(memorialData.date_of_death);
      const age = death.getFullYear() - birth.getFullYear();
      setMemorialData((prev) => ({ ...prev, age_at_death: age }));
    }
  }, [memorialData.date_of_birth, memorialData.date_of_death]);

  const updateMemorialData = (data: Partial<typeof memorialData>) => {
    setMemorialData((prev) => ({ ...prev, ...data }));
  };

  const saveDraft = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be signed in to save a memorial");
        return;
      }

      // Check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        console.error("Profile check error:", profileError);
        toast.error("User profile not found. Please sign out and sign in again.");
        return;
      }

      // Validate required fields
      if (!memorialData.full_name.trim()) {
        toast.error("Please enter a name before saving");
        return;
      }

      const slug = memorialData.full_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        + "-" + Date.now();

      if (memorialId) {
        // Update existing draft
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

        if (error) {
          console.error("Update error details:", error);
          throw new Error(error.message || "Failed to update memorial");
        }
      } else {
        // Create new draft via API route (bypasses client-side RLS issues)
        console.log("Creating memorial via API for user:", user.id);

        const response = await fetch("/api/memorial/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            memorialData,
          }),
        });

        const result = await response.json();

        console.log("API response:", result);

        if (!response.ok || result.error) {
          console.error("API error:", result);
          throw new Error(result.error || "Failed to create memorial");
        }

        if (result.data) {
          console.log("Memorial created successfully:", result.data);
          setMemorialId(result.data.id);
        }
      }

      toast.success("Draft saved successfully!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save draft. Please try again.");
    }
  };

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 1 && !memorialData.full_name) {
      toast.error("Please enter a name");
      return;
    }

    // Save draft before moving to next step
    if (currentStep < 10) {
      await saveDraft();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be signed in to publish a memorial");
      }

      // Validate required fields
      if (!memorialData.full_name.trim()) {
        throw new Error("Please enter a name before publishing");
      }

      let slug = "";

      if (memorialId) {
        // Get existing slug from database
        const { data: existingMemorial, error: fetchError } = await supabase
          .from("memorials")
          .select("slug")
          .eq("id", memorialId)
          .single();

        if (fetchError || !existingMemorial) {
          throw new Error("Could not find memorial to publish");
        }

        slug = existingMemorial.slug;

        // Update and publish
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
            status: "published",
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", memorialId);

        if (error) {
          console.error("Publish error details:", error);
          throw new Error(error.message || "Failed to publish memorial");
        }
      } else {
        // Generate slug for new memorial
        slug = memorialData.full_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          + "-" + Date.now();

        // Create and publish
        const { data, error } = await supabase
          .from("memorials")
          .insert({
            user_id: user.id,
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
            slug,
            status: "published",
            published_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error("Publish error details:", error);
          throw new Error(error.message || "Failed to publish memorial");
        }
        if (data) setMemorialId((data as { id: string }).id);
      }

      toast.success("Memorial published successfully!");
      router.push(`/memorial/${slug}`);
    } catch (error: any) {
      console.error("Publish error:", error);
      toast.error(error.message || "Failed to publish memorial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProfileStep
            data={memorialData}
            updateData={updateMemorialData}
          />
        );
      case 2:
        return (
          <ObituaryStep
            data={memorialData}
            updateData={updateMemorialData}
          />
        );
      case 3:
        return (
          <FavoritesFormStep
            data={memorialData}
            updateData={updateMemorialData}
          />
        );
      case 4:
        return (
          <GalleryStep
            memorialId={memorialId}
          />
        );
      case 5:
        return (
          <TimelineStep
            memorialId={memorialId}
          />
        );
      case 6:
        return (
          <RelationshipsStep
            memorialId={memorialId}
          />
        );
      case 7:
        return (
          <EventsStep
            memorialId={memorialId}
          />
        );
      case 8:
        return (
          <DonationsRSVPStep
            data={memorialData}
            updateData={updateMemorialData}
          />
        );
      case 9:
        return (
          <PrivacyStep
            data={memorialData}
            updateData={updateMemorialData}
          />
        );
      case 10:
        return (
          <ReviewStep
            data={memorialData}
            memorialId={memorialId}
            onEdit={setCurrentStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-h1 md:text-4xl font-bold text-foreground mb-2">
            Create a Memorial
          </h1>
          <p className="text-muted-foreground">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </p>
        </div>

        {/* Progress Stepper */}
        <Card className="p-4 md:p-6 mb-8 bg-gradient-to-br from-background to-muted/30 shadow-md overflow-x-auto">
          <div className="flex items-center min-w-max md:min-w-0 md:justify-between px-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center shrink-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all duration-300 ${
                      step.number < currentStep
                        ? "bg-green-500 text-white shadow-lg"
                        : step.number === currentStep
                        ? "bg-blue-600 text-white ring-4 ring-blue-300 shadow-xl"
                        : "bg-gray-200 text-gray-500 border-2 border-gray-300"
                    }`}
                  >
                    {step.number < currentStep ? (
                      <Check className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-[10px] md:text-xs mt-1.5 md:mt-2 text-center max-w-[60px] md:max-w-[80px] font-medium transition-colors leading-tight ${
                    step.number === currentStep ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 md:h-1.5 w-6 md:w-8 lg:w-12 mx-1.5 md:mx-2 rounded-full transition-all duration-300 ${
                      step.number < currentStep ? "bg-gradient-to-r from-accent to-accent/60" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Step Content */}
        <Card className="p-8 mb-8 shadow-md">{renderStep()}</Card>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="font-medium shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            variant="ghost"
            onClick={saveDraft}
            disabled={!memorialData.full_name}
            className="font-medium hover:bg-accent/10 transition-all"
          >
            Save Draft
          </Button>

          {currentStep < 10 ? (
            <Button variant="primary" onClick={handleNext} className="font-medium shadow-md hover:shadow-lg transition-all">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={handlePublish}
              className="font-medium shadow-md hover:shadow-lg transition-all"
              disabled={loading || !memorialData.full_name}
            >
              {loading ? "Publishing..." : "Publish Memorial"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
