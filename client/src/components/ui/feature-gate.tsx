import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";
import { useFeatureGating } from "@/hooks/useFeatureGating";

interface FeatureGateProps {
  feature: "gallery" | "audioVideo" | "events" | "familyTree" | "privateLink";
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Component that gates features based on subscription tier
 */
export function FeatureGate({ feature, children, fallback, className }: FeatureGateProps) {
  const featureGating = useFeatureGating();

  // Check if user has access to the feature
  const hasAccess = {
    gallery: featureGating.canUseGallery,
    audioVideo: featureGating.canUseAudioVideo,
    events: featureGating.canUseEvents,
    familyTree: featureGating.canUseFamilyTree,
    privateLink: featureGating.canUsePrivateLink,
  }[feature];

  if (featureGating.isLoading) {
    return <div className="animate-pulse bg-muted/20 rounded h-8"></div>;
  }

  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  // Show fallback or default upgrade prompt
  if (fallback) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div className={className}>
      <UpgradePrompt feature={feature} />
    </div>
  );
}

interface UpgradePromptProps {
  feature: "gallery" | "audioVideo" | "events" | "familyTree" | "privateLink";
  variant?: "card" | "inline";
  showIcon?: boolean;
}

/**
 * Reusable upgrade prompt component
 */
export function UpgradePrompt({ feature, variant = "inline", showIcon = true }: UpgradePromptProps) {
  const featureGating = useFeatureGating();

  const featureLabels = {
    gallery: "Photo Gallery",
    audioVideo: "Audio & Video",
    events: "Event Announcements", 
    familyTree: "Family Tree",
    privateLink: "Private Memorial Links",
  };

  const requiredTiers = {
    gallery: "honour",
    audioVideo: "honour", 
    events: "legacy",
    familyTree: "legacy",
    privateLink: "honour",
  };

  const featureLabel = featureLabels[feature];
  const requiredTier = requiredTiers[feature];
  const tierNames = {
    remember: "Remember",
    honour: "Honour", 
    legacy: "Legacy",
    family_vault: "Family Vault",
  };

  const requiredTierName = tierNames[requiredTier as keyof typeof tierNames];

  if (variant === "card") {
    return (
      <Card className="border-dashed border-accent/30 bg-accent/10">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {showIcon && <Crown className="w-4 h-4 text-accent" />}
            <CardTitle className="text-sm font-medium text-accent">
              Premium Feature
            </CardTitle>
          </div>
          <CardDescription className="text-accent/80">
            {featureLabel} requires {requiredTierName} plan or higher
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button size="sm" className="w-full" asChild data-testid="button-upgrade">
            <Link href="/pricing">
              Upgrade Plan <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/30 rounded-lg">
      {showIcon && <Lock className="w-4 h-4 text-accent flex-shrink-0" />}
      <div className="flex-1">
        <p className="text-sm font-medium text-accent">
          {featureLabel} requires {requiredTierName} plan
        </p>
      </div>
      <Button size="sm" variant="outline" asChild data-testid="button-upgrade">
        <Link href="/pricing">
          Upgrade <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </Button>
    </div>
  );
}

interface LimitWarningProps {
  type: "memorial";
  className?: string;
}

/**
 * Warning component when user approaches limits
 */
export function LimitWarning({ type, className }: LimitWarningProps) {
  const featureGating = useFeatureGating();

  if (featureGating.isLoading || type !== "memorial") {
    return null;
  }

  const { currentMemorials, memorialLimit, isMemorialLimitReached, currentTier } = featureGating;

  // Show warning when user is near limit
  const isNearLimit = memorialLimit !== "unlimited" && 
    currentMemorials >= Math.max(1, Math.floor(memorialLimit * 0.8));

  if (!isNearLimit && !isMemorialLimitReached) {
    return null;
  }

  return (
    <Card className={`border-accent/30 bg-accent/10 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Crown className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-accent mb-1">
              {isMemorialLimitReached ? "Memorial Limit Reached" : "Approaching Memorial Limit"}
            </h4>
            <p className="text-sm text-accent/80 mb-3">
              {isMemorialLimitReached 
                ? `You've used all ${memorialLimit} memorials in your ${currentTier} plan.`
                : `You've used ${currentMemorials} of ${memorialLimit} memorials in your ${currentTier} plan.`
              }
            </p>
            <Button size="sm" className="bg-accent hover:bg-accent/80" asChild data-testid="button-upgrade-limit">
              <Link href="/pricing">
                Upgrade for More Memorials <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}