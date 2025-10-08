"use client";

import { Button } from "@/components/ui/button";
import { Edit, Check } from "lucide-react";

interface ReviewStepProps {
  data: {
    full_name: string;
    date_of_birth: string;
    date_of_death: string;
    age_at_death: number | null;
    obituary_short: string;
    obituary_full: string;
    privacy: "public" | "private" | "unlisted";
    allow_tributes: boolean;
    allow_donations: boolean;
    rsvp_enabled: boolean;
  };
  memorialId: string | null;
  onEdit: (step: number) => void;
}

export default function ReviewStep({ data, memorialId, onEdit }: ReviewStepProps) {
  const formatDate = (date: string) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sections = [
    {
      step: 1,
      title: "Profile",
      fields: [
        { label: "Name", value: data.full_name || "Not set" },
        { label: "Date of Birth", value: formatDate(data.date_of_birth) },
        { label: "Date of Death", value: formatDate(data.date_of_death) },
        {
          label: "Age at Passing",
          value: data.age_at_death ? `${data.age_at_death} years` : "Not set",
        },
      ],
    },
    {
      step: 2,
      title: "Obituary",
      fields: [
        { label: "Short Tribute", value: data.obituary_short || "Not set" },
        {
          label: "Full Obituary",
          value: data.obituary_full
            ? `${data.obituary_full.slice(0, 100)}...`
            : "Not set",
        },
      ],
    },
    {
      step: 7,
      title: "Privacy",
      fields: [
        {
          label: "Visibility",
          value: data.privacy.charAt(0).toUpperCase() + data.privacy.slice(1),
        },
        {
          label: "Guestbook",
          value: data.allow_tributes ? "Enabled" : "Disabled",
        },
      ],
    },
    {
      step: 6,
      title: "Features",
      fields: [
        { label: "Donations", value: data.allow_donations ? "Enabled" : "Disabled" },
        { label: "RSVP", value: data.rsvp_enabled ? "Enabled" : "Disabled" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Review & Publish
        </h2>
        <p className="text-muted-foreground">
          Review all details before publishing your memorial
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.step}
            className="border border-border rounded-token p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(section.step)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-2">
              {section.fields.map((field, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {field.label}
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation */}
      <div className="bg-muted/30 rounded-token p-6">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="confirm"
            className="mt-1"
            required
          />
          <label htmlFor="confirm" className="text-sm">
            <span className="font-medium text-foreground">
              I confirm that all content is respectful and accurate.
            </span>
            <p className="text-muted-foreground mt-1">
              By publishing, you agree that the information provided is truthful
              and appropriate for a memorial tribute.
            </p>
          </label>
        </div>
      </div>

      {/* Status */}
      {memorialId ? (
        <div className="flex items-center gap-2 text-sm text-accent">
          <Check className="h-4 w-4" />
          <span>Memorial saved as draft</span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Click "Publish Memorial" below to make this memorial live.
        </p>
      )}
    </div>
  );
}
