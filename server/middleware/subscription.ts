import type { Request, Response, NextFunction } from "express";
import { db } from '../db';
import { subscriptions, memorials } from '@shared/schema';
import { eq, and, count } from 'drizzle-orm';
import { getSubscriptionEntitlements } from '@shared/schema';
import type { SubscriptionTier } from '@shared/schema';

// Extend Request type to include user info
interface AuthenticatedRequest extends Request {
  user: {
    claims: {
      sub: string;
      email?: string;
    };
  };
}

/**
 * Middleware to enforce subscription limits for memorial creation
 */
export const enforceMemorialLimits = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ 
        message: "Authentication required",
        code: "AUTH_REQUIRED" 
      });
    }
    
    // Get user's current subscription
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active')
      ))
      .limit(1)
      .then(rows => rows[0]);
    
    // Default to free tier if no subscription
    const subscriptionTier = subscription?.plan as SubscriptionTier || 'remember';
    const entitlements = getSubscriptionEntitlements(subscriptionTier);
    
    // Count user's current memorials
    const memorialCount = await db
      .select({ count: count() })
      .from(memorials)
      .where(eq(memorials.submittedBy, userId))
      .then(rows => rows[0]?.count || 0);
    
    // Check if user has reached their limit (unlimited = no limit)
    if (entitlements.memorialLimit !== "unlimited" && memorialCount >= entitlements.memorialLimit) {
      return res.status(402).json({
        message: "Memorial limit reached for your current plan",
        code: "MEMORIAL_LIMIT_REACHED",
        details: {
          currentPlan: subscriptionTier,
          currentMemorials: memorialCount,
          memorialLimit: entitlements.memorialLimit,
          upgradeUrl: "/pricing"
        }
      });
    }
    
    // Attach subscription info to request for use in handlers
    (req as any).subscription = {
      tier: subscriptionTier,
      entitlements,
      memorialCount
    };
    
    next();
  } catch (error) {
    console.error('Subscription enforcement error:', error);
    res.status(500).json({ 
      message: "Unable to verify subscription limits",
      code: "SUBSCRIPTION_CHECK_ERROR" 
    });
  }
};

/**
 * Middleware to check if user has access to premium features
 */
export const enforcePremiumFeatures = (requiredTier: SubscriptionTier) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ 
          message: "Authentication required",
          code: "AUTH_REQUIRED" 
        });
      }
      
      // Get user's current subscription
      const subscription = await db
        .select()
        .from(subscriptions)
        .where(and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, 'active')
        ))
        .limit(1)
        .then(rows => rows[0]);
      
      const userTier = subscription?.plan as SubscriptionTier || 'remember';
      
      // Check if user's tier meets the requirement
      const tierHierarchy: SubscriptionTier[] = ['remember', 'honour', 'legacy', 'family_vault'];
      const userTierIndex = tierHierarchy.indexOf(userTier);
      const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
      
      if (userTierIndex < requiredTierIndex) {
        return res.status(402).json({
          message: `This feature requires ${requiredTier} plan or higher`,
          code: "PREMIUM_FEATURE_REQUIRED",
          details: {
            currentPlan: userTier,
            requiredPlan: requiredTier,
            upgradeUrl: "/pricing"
          }
        });
      }
      
      next();
    } catch (error) {
      console.error('Premium feature check error:', error);
      res.status(500).json({ 
        message: "Unable to verify premium access",
        code: "FEATURE_CHECK_ERROR" 
      });
    }
  };
};

/**
 * Utility function to get user's subscription status for API responses
 */
export const getUserSubscriptionInfo = async (userId: string) => {
  const subscription = await db
    .select()
    .from(subscriptions)
    .where(and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, 'active')
    ))
    .limit(1)
    .then(rows => rows[0]);
  
  const subscriptionTier = subscription?.plan as SubscriptionTier || 'remember';
  const entitlements = getSubscriptionEntitlements(subscriptionTier);
  
  const memorialCount = await db
    .select({ count: count() })
    .from(memorials)
    .where(eq(memorials.submittedBy, userId))
    .then(rows => rows[0]?.count || 0);
  
  const memorialsRemaining = entitlements.memorialLimit === "unlimited" 
    ? "unlimited"
    : Math.max(0, entitlements.memorialLimit - memorialCount);

  return {
    tier: subscriptionTier,
    status: subscription?.status || 'none',
    entitlements,
    usage: {
      memorials: memorialCount,
      memorialsRemaining
    }
  };
};