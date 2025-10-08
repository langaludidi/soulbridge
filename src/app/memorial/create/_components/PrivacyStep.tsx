"use client";

import { Label } from "@/components/ui/label";
import { Globe, Lock, EyeOff } from "lucide-react";

interface PrivacyStepProps {
  data: {
    privacy: "public" | "private" | "unlisted";
    allow_tributes: boolean;
  };
  updateData: (data: any) => void;
}

export default function PrivacyStep({ data, updateData }: PrivacyStepProps) {
  const privacyOptions = [
    {
      value: "public" as const,
      icon: Globe,
      title: "Public",
      description: "Anyone can find and view this memorial",
    },
    {
      value: "unlisted" as const,
      icon: EyeOff,
      title: "Unlisted",
      description: "Only people with the link can view",
    },
    {
      value: "private" as const,
      icon: Lock,
      title: "Private",
      description: "Only you can view and manage",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Privacy Settings
        </h2>
        <p className="text-muted-foreground">
          Control who can view this memorial
        </p>
      </div>

      {/* Privacy Level */}
      <div className="space-y-4">
        <Label>Who can view this memorial?</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {privacyOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = data.privacy === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateData({ privacy: option.value })}
                className={`p-6 rounded-token border-2 text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <Icon
                  className={`h-6 w-6 mb-3 ${
                    isSelected ? "text-accent" : "text-muted-foreground"
                  }`}
                />
                <h3 className="font-semibold text-foreground mb-1">
                  {option.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Allow Tributes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-6 rounded-token border border-border">
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Allow Guestbook Tributes
            </h3>
            <p className="text-sm text-muted-foreground">
              Let visitors leave messages and condolences
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateData({ allow_tributes: !data.allow_tributes })}
            className={`relative inline-flex h-6 w-11 items-center rounded-pill transition-colors ${
              data.allow_tributes ? "bg-accent" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.allow_tributes ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        You can change these settings at any time from your dashboard.
      </p>
    </div>
  );
}
