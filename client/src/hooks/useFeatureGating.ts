import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getSubscriptionEntitlements, type SubscriptionTier, type SubscriptionEntitlements } from "@shared/schema";

interface FeatureGatingData {
  currentTier: SubscriptionTier;
  entitlements: SubscriptionEntitlements;
  currentMemorials: number;
  memorialLimit: number | "unlimited";
  isMemorialLimitReached: boolean;
  canCreateMemorial: boolean;
  canUseGallery: boolean;
  canUseAudioVideo: boolean;
  canUsePdf: boolean;
  canUseEvents: boolean;
  canUseFamilyTree: boolean;
  canUsePrivateLink: boolean;
  isLoading: boolean;
}

/**
 * Hook to check subscription limits and feature access
 */
export function useFeatureGating(): FeatureGatingData {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Get user's subscription data
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["/api/billing/subscription"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Get user's usage statistics 
  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ["/api/user/usage"],
    enabled: isAuthenticated,
    retry: false,
  });

  const isLoading = authLoading || subscriptionLoading || usageLoading;

  // Default to free tier if not authenticated or no subscription
  const currentTier: SubscriptionTier = (subscription as any)?.plan || "remember";
  const entitlements = getSubscriptionEntitlements(currentTier);
  const currentMemorials = (usage as any)?.memorialsUsed || 0;
  
  // Check memorial limit
  const memorialLimit = entitlements.memorialLimit;
  const isMemorialLimitReached = memorialLimit !== "unlimited" && currentMemorials >= memorialLimit;
  const canCreateMemorial = !isMemorialLimitReached;

  return {
    currentTier,
    entitlements,
    currentMemorials,
    memorialLimit,
    isMemorialLimitReached,
    canCreateMemorial,
    canUseGallery: entitlements.allowGallery,
    canUseAudioVideo: entitlements.allowAudioVideo,
    canUsePdf: entitlements.allowPdf,
    canUseEvents: entitlements.allowEvents,
    canUseFamilyTree: entitlements.allowFamilyTree,
    canUsePrivateLink: entitlements.allowPrivateLink,
    isLoading,
  };
}