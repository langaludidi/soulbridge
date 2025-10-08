"use client";

import { AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UpgradePromptProps {
  title: string;
  message: string;
  feature?: string;
  currentPlan?: string;
  suggestedPlan?: string;
  variant?: "banner" | "modal" | "inline";
  onClose?: () => void;
}

export function UpgradePrompt({
  title,
  message,
  feature,
  currentPlan = "free",
  suggestedPlan = "essential",
  variant = "inline",
  onClose,
}: UpgradePromptProps) {
  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-l-4 border-accent p-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{title}</h3>
              {currentPlan && (
                <Badge variant="secondary" className="text-xs">
                  {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{message}</p>
            <div className="flex items-center gap-3">
              <Link href="/pricing">
                <Button variant="accent" size="sm">
                  Upgrade to {suggestedPlan.charAt(0).toUpperCase() + suggestedPlan.slice(1)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">
                  View All Plans
                </Button>
              </Link>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-lg w-full p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl"
            >
              ×
            </button>
          )}

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              {title}
            </h2>
            {feature && (
              <Badge variant="accent" className="mb-4">
                {feature}
              </Badge>
            )}
            <p className="text-muted-foreground leading-relaxed">{message}</p>
          </div>

          <div className="space-y-3">
            <Link href="/pricing" className="block">
              <Button variant="accent" size="lg" className="w-full">
                Upgrade to {suggestedPlan.charAt(0).toUpperCase() + suggestedPlan.slice(1)}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing" className="block">
              <Button variant="outline" size="lg" className="w-full">
                Compare All Plans
              </Button>
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            No hidden fees • Cancel anytime
          </p>
        </Card>
      </div>
    );
  }

  // Default: inline variant
  return (
    <Card className="p-6 bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-accent" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl font-bold text-foreground mb-2">
            {title}
          </h3>
          {feature && (
            <Badge variant="accent" className="mb-3">
              {feature}
            </Badge>
          )}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {message}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/pricing">
              <Button variant="accent">
                Upgrade Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline">View Plans</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Preset prompts for common scenarios
export const UpgradePrompts = {
  memorialLimit: (count: number, max: number) => ({
    title: "Memorial Limit Reached",
    message: `You've created ${count} of ${max} memorial${max === 1 ? "" : "s"} on your current plan. Upgrade to create more tributes for your loved ones.`,
    feature: "Additional Memorials",
    suggestedPlan: "family",
  }),

  mediaLimit: (count: number) => ({
    title: "Photo Limit Reached",
    message: `You've uploaded ${count} photos. Upgrade to Essential for unlimited photos, videos, and audio to fully capture your loved one's memories.`,
    feature: "Unlimited Media",
    suggestedPlan: "essential",
  }),

  qrCodeLocked: () => ({
    title: "QR Code Generation",
    message: "Generate QR codes to easily share memorials at services, on printed materials, or with family members. Available on Essential plan and above.",
    feature: "QR Code",
    suggestedPlan: "essential",
  }),

  donationsLocked: () => ({
    title: "Enable Donation Links",
    message: "Add donation links to honor your loved one's memory through charitable giving. Available on Essential plan and above.",
    feature: "Donations",
    suggestedPlan: "essential",
  }),

  analyticsLocked: () => ({
    title: "View Analytics",
    message: "Track memorial visits, tribute submissions, and engagement. See how many people are honoring your loved one's memory.",
    feature: "Analytics",
    suggestedPlan: "essential",
  }),

  planExpired: () => ({
    title: "Your Plan Has Expired",
    message: "Renew your subscription to restore full access to your memorials and all premium features.",
    feature: "Renewal Required",
    suggestedPlan: "essential",
  }),
};
