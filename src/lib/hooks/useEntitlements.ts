import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface PlanEntitlements {
  plan: 'free' | 'essential' | 'family' | 'lifetime';
  maxMemorials: number | null; // null = unlimited
  maxUploads: number | null; // null = unlimited
  features: {
    unlimitedMedia: boolean;
    qrCode: boolean;
    donations: boolean;
    analytics: boolean;
    prioritySupport: boolean;
    allThemes: boolean;
    customThemes: boolean;
    timeline: boolean;
    guestBook: boolean;
    virtualCandles: boolean;
  };
}

const PLAN_ENTITLEMENTS: Record<string, PlanEntitlements> = {
  free: {
    plan: 'free',
    maxMemorials: 1,
    maxUploads: 10,
    features: {
      unlimitedMedia: false,
      qrCode: false,
      donations: false,
      analytics: false,
      prioritySupport: false,
      allThemes: false,
      customThemes: false,
      timeline: true,
      guestBook: true,
      virtualCandles: true,
    },
  },
  essential: {
    plan: 'essential',
    maxMemorials: 1,
    maxUploads: null,
    features: {
      unlimitedMedia: true,
      qrCode: true,
      donations: true,
      analytics: true,
      prioritySupport: false,
      allThemes: true,
      customThemes: false,
      timeline: true,
      guestBook: true,
      virtualCandles: true,
    },
  },
  family: {
    plan: 'family',
    maxMemorials: 3,
    maxUploads: null,
    features: {
      unlimitedMedia: true,
      qrCode: true,
      donations: true,
      analytics: true,
      prioritySupport: true,
      allThemes: true,
      customThemes: false,
      timeline: true,
      guestBook: true,
      virtualCandles: true,
    },
  },
  lifetime: {
    plan: 'lifetime',
    maxMemorials: null,
    maxUploads: null,
    features: {
      unlimitedMedia: true,
      qrCode: true,
      donations: true,
      analytics: true,
      prioritySupport: true,
      allThemes: true,
      customThemes: true,
      timeline: true,
      guestBook: true,
      virtualCandles: true,
    },
  },
};

export function useEntitlements() {
  const [entitlements, setEntitlements] = useState<PlanEntitlements | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchEntitlements() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setEntitlements(PLAN_ENTITLEMENTS.free);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('plan, subscription_status')
          .eq('id', user.id)
          .single();

        if (!profile) {
          setEntitlements(PLAN_ENTITLEMENTS.free);
          setLoading(false);
          return;
        }

        // If subscription is expired or cancelled, downgrade to free
        if (profile.subscription_status !== 'active') {
          setEntitlements(PLAN_ENTITLEMENTS.free);
        } else {
          setEntitlements(PLAN_ENTITLEMENTS[profile.plan] || PLAN_ENTITLEMENTS.free);
        }
      } catch (error) {
        console.error('Failed to fetch entitlements:', error);
        setEntitlements(PLAN_ENTITLEMENTS.free);
      } finally {
        setLoading(false);
      }
    }

    fetchEntitlements();
  }, [supabase]);

  return { entitlements, loading };
}

// Helper function to check if user can perform an action
export async function checkEntitlement(
  action: 'create_memorial' | 'upload_media' | 'enable_qr' | 'enable_donations' | 'view_analytics'
): Promise<{ allowed: boolean; reason?: string; upgradeUrl?: string }> {
  const supabase = createClientComponentClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        allowed: false,
        reason: 'Please sign in to continue',
        upgradeUrl: '/sign-in',
      };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, subscription_status')
      .eq('id', user.id)
      .single();

    if (!profile || profile.subscription_status !== 'active') {
      return {
        allowed: false,
        reason: 'Your plan has expired. Please upgrade to continue.',
        upgradeUrl: '/pricing',
      };
    }

    const entitlements = PLAN_ENTITLEMENTS[profile.plan] || PLAN_ENTITLEMENTS.free;

    switch (action) {
      case 'create_memorial': {
        const { count } = await supabase
          .from('memorials')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (entitlements.maxMemorials !== null && count !== null && count >= entitlements.maxMemorials) {
          return {
            allowed: false,
            reason: `You've reached your memorial limit (${entitlements.maxMemorials}). Upgrade to create more.`,
            upgradeUrl: '/pricing',
          };
        }
        return { allowed: true };
      }

      case 'upload_media': {
        // This would need memorial_id passed in, but for now we check general entitlement
        if (!entitlements.features.unlimitedMedia) {
          return {
            allowed: false,
            reason: 'Upgrade to Essential for unlimited media uploads.',
            upgradeUrl: '/pricing',
          };
        }
        return { allowed: true };
      }

      case 'enable_qr':
        if (!entitlements.features.qrCode) {
          return {
            allowed: false,
            reason: 'QR code generation requires Essential plan or higher.',
            upgradeUrl: '/pricing',
          };
        }
        return { allowed: true };

      case 'enable_donations':
        if (!entitlements.features.donations) {
          return {
            allowed: false,
            reason: 'Donation links require Essential plan or higher.',
            upgradeUrl: '/pricing',
          };
        }
        return { allowed: true };

      case 'view_analytics':
        if (!entitlements.features.analytics) {
          return {
            allowed: false,
            reason: 'Analytics require Essential plan or higher.',
            upgradeUrl: '/pricing',
          };
        }
        return { allowed: true };

      default:
        return { allowed: true };
    }
  } catch (error) {
    console.error('Entitlement check failed:', error);
    return {
      allowed: false,
      reason: 'An error occurred. Please try again.',
    };
  }
}
