import { Router } from 'express';
import express from 'express';
import { z } from 'zod';
import { paystackProvider } from './paystack-provider';
import { isAuthenticated } from '../replitAuth';
import { db } from '../db';
import { subscriptions, users, families } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { BillingProvider } from './types';
import { PLAN_PRICING } from './types';
import { getSubscriptionEntitlements } from '@shared/schema';

export const billingRouter = Router();

// Available billing providers - can be extended later
const providers: Record<string, BillingProvider> = {
  paystack: paystackProvider,
};

// Get available subscription plans
billingRouter.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'remember',
      name: 'Remember',
      description: 'Basic memorial with essential features',
      price: PLAN_PRICING.remember,
      features: [
        '1 memorial',
        'Basic info & photo',
        'Public view',
        'Printable layout'
      ]
    },
    {
      id: 'honour',
      name: 'Honour', 
      description: 'Enhanced memorial with multimedia',
      price: PLAN_PRICING.honour,
      features: [
        'Up to 3 memorials',
        'Full obituary & quote',
        'Gallery (10 images)',
        'Audio or video',
        'Shareable private/public link'
      ],
      popular: false
    },
    {
      id: 'legacy',
      name: 'Legacy',
      description: 'Complete memorial solution',
      price: PLAN_PRICING.legacy,
      features: [
        'Unlimited memorials',
        'Unlimited gallery',
        'Editable content',
        'Family tree file upload',
        'Event announcements',
        'Featured homepage placement'
      ],
      popular: true
    },
    {
      id: 'family_vault',
      name: 'Family Vault',
      description: 'Multi-user family archive',
      price: PLAN_PRICING.family_vault,
      features: [
        'All Legacy features',
        'Multi-user family archive',
        'Shared login dashboard',
        'Schedule memorials in advance'
      ]
    }
  ];
  
  res.json({ plans });
});

// Get current user's subscription
billingRouter.get('/subscription', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Get user's current subscription
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1)
      .then(rows => rows[0]);
    
    if (!subscription) {
      return res.json({
        subscription: null,
        tier: 'remember',
        status: 'active',
        memorialCount: 0,
        memorialLimit: 1
      });
    }
    
    // Count user's memorials
    const memorialCountResult = await db.execute(
      sql`SELECT COUNT(*) as count FROM memorials WHERE submitted_by = ${userId}`
    );
    const memorialCount = parseInt((memorialCountResult as any).rows?.[0]?.count || '0');
    
    const entitlements = getSubscriptionEntitlements(subscription.plan as any);
    
    res.json({
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        interval: subscription.interval,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
      },
      tier: subscription.plan,
      status: subscription.status,
      memorialCount,
      memorialLimit: entitlements.memorialLimit,
      entitlements
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create checkout session
const checkoutSessionSchema = z.object({
  plan: z.enum(['honour', 'legacy', 'family_vault']),
  interval: z.enum(['monthly', 'yearly']),
  provider: z.enum(['paystack']).default('paystack')
});

billingRouter.post('/checkout-session', isAuthenticated, async (req: any, res) => {
  try {
    const { plan, interval, provider: providerName } = checkoutSessionSchema.parse(req.body);
    const userId = req.user.claims.sub;
    
    // Validate plan/interval combination
    if (plan === 'family_vault' && interval === 'yearly') {
      return res.status(400).json({ error: 'Family Vault is only available monthly' });
    }
    
    const provider = providers[providerName];
    if (!provider) {
      return res.status(400).json({ error: 'Invalid payment provider' });
    }
    
    const session = await provider.createCheckoutSession({
      plan,
      interval,
      userId
    });
    
    res.json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create portal session for subscription management
billingRouter.post('/portal-session', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Use Paystack as default provider for now
    const provider = providers.paystack;
    const session = await provider.createPortalSession(userId);
    
    res.json(session);
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// Cancel subscription
billingRouter.post('/cancel-subscription', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Find user's active subscription
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, 'active')
        )
      )
      .limit(1)
      .then(rows => rows[0]);
    
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    
    // Mark for cancellation at period end
    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: true,
        updatedAt: new Date()
      })
      .where(eq(subscriptions.id, subscription.id));
    
    res.json({ message: 'Subscription will be canceled at the end of the billing period' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Paystack webhook endpoint - MUST receive raw body for signature verification
billingRouter.post('/webhooks/paystack', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }
    
    // Use raw body buffer for proper signature verification
    const payload = req.body.toString();
    await paystackProvider.handleWebhook(payload, signature);
    
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Helper function already imported from @shared/schema