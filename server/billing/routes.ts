import { Router } from 'express';
import express from 'express';
import { z } from 'zod';
import { paystackProvider } from './paystack-provider';
import { netcashProvider } from './netcash-provider';
import { isAuthenticated } from '../replitAuth';
import { db } from '../db';
import { subscriptions, users, families, netcashTransactions } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { BillingProvider } from './types';
import { PLAN_PRICING } from './types';
import { getSubscriptionEntitlements } from '@shared/schema';
import type { AuthenticatedRequestStrict, AuthenticatedRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

export const billingRouter = Router();

// Available billing providers - can be extended later
const providers: Record<string, BillingProvider> = {
  paystack: paystackProvider,
  netcash: netcashProvider,
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
billingRouter.get('/subscription', isAuthenticated, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequestStrict;
    const userId = authReq.user.claims.sub;
    
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
  provider: z.enum(['paystack', 'netcash']).default('netcash')
});

// Simplified checkout endpoint for PaymentModal compatibility
billingRouter.post('/checkout', isAuthenticated, async (req, res) => {
  try {
    const { plan, interval, provider: providerName } = checkoutSessionSchema.parse(req.body);
    const authReq = req as AuthenticatedRequestStrict;
    const userId = authReq.user.claims.sub;
    
    const provider = providers[providerName];
    if (!provider) {
      return res.status(400).json({ error: `Provider ${providerName} not supported` });
    }
    
    const result = await provider.createCheckoutSession({
      plan,
      interval,
      userId,
    });
    
    res.json(result);
  } catch (error: any) {
    logger.error('Error creating checkout session', { error: error.message, userId: (req as any).user?.claims?.sub });
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: error.errors 
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Failed to create checkout session'
    });
  }
});

billingRouter.post('/checkout-session', isAuthenticated, async (req, res) => {
  try {
    const { plan, interval, provider: providerName } = checkoutSessionSchema.parse(req.body);
    const authReq = req as AuthenticatedRequestStrict;
    const userId = authReq.user.claims.sub;
    
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
billingRouter.post('/portal-session', isAuthenticated, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequestStrict;
    const userId = authReq.user.claims.sub;
    
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
billingRouter.post('/cancel-subscription', isAuthenticated, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequestStrict;
    const userId = authReq.user.claims.sub;
    
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

// NetCash Pay Now webhook endpoint - receives form-encoded notifications
billingRouter.post('/webhooks/netcash', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    // NetCash sends notifications as form data
    const payload = new URLSearchParams(req.body).toString();
    
    // NetCash doesn't use signatures in the same way - verification happens in the provider
    await netcashProvider.handleWebhook(payload, '');
    
    res.status(200).send('OK'); // NetCash expects simple OK response
  } catch (error) {
    console.error('NetCash webhook error:', error);
    res.status(400).send('ERROR');
  }
});

// NetCash return URL handler - handles customer return after payment
billingRouter.get('/netcash/return', async (req, res) => {
  try {
    const { reference } = req.query;
    
    if (!reference || typeof reference !== 'string') {
      return res.redirect('/pricing?error=invalid_reference');
    }
    
    // Find the transaction
    const transaction = await db
      .select()
      .from(netcashTransactions)
      .where(eq(netcashTransactions.paynowReference, reference))
      .limit(1)
      .then(rows => rows[0]);
    
    if (!transaction) {
      return res.redirect('/pricing?error=transaction_not_found');
    }
    
    // Check transaction status
    if (transaction.status === 'completed') {
      // Redirect to success page
      return res.redirect('/billing/success?reference=' + reference);
    } else if (transaction.status === 'failed') {
      // Redirect to failure page
      return res.redirect('/pricing?error=payment_failed');
    } else {
      // Still pending - redirect to processing page
      return res.redirect('/billing/processing?reference=' + reference);
    }
  } catch (error) {
    console.error('NetCash return handler error:', error);
    res.redirect('/pricing?error=processing_error');
  }
});

// Generic success page for completed payments
billingRouter.get('/success', async (req, res) => {
  const { reference } = req.query;
  
  // You could render a success page here or redirect to dashboard
  res.redirect('/dashboard?subscription_created=true');
});

// Processing page for pending payments
billingRouter.get('/processing', async (req, res) => {
  const { reference } = req.query;
  
  // You could render a processing page or redirect to dashboard with a message
  res.redirect('/dashboard?payment_processing=true');
});

// Add /payment/notify endpoint as alias for NetCash webhook
billingRouter.post('/payment/notify', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    // This is an alias for the NetCash webhook endpoint
    // NetCash sends notifications as form data
    const payload = new URLSearchParams(req.body).toString();
    
    // Use NetCash provider to handle the webhook
    await netcashProvider.handleWebhook(payload, '');
    
    res.status(200).send('OK'); // NetCash expects simple OK response
  } catch (error) {
    console.error('NetCash payment notification error:', error);
    res.status(400).send('ERROR');
  }
});

// Transaction lookup endpoint for frontend polling
billingRouter.get('/transaction', async (req, res) => {
  try {
    const { reference } = req.query;
    
    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({ error: 'Transaction reference is required' });
    }
    
    // Find the NetCash transaction
    const transaction = await db
      .select()
      .from(netcashTransactions)
      .where(eq(netcashTransactions.paynowReference, reference))
      .limit(1)
      .then(rows => rows[0]);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    // Get related subscription if available
    let subscription = null;
    if (transaction.subscriptionId) {
      subscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, transaction.subscriptionId))
        .limit(1)
        .then(rows => rows[0]);
    }
    
    // Return transaction status and details
    res.json({
      transaction: {
        id: transaction.id,
        reference: transaction.paynowReference,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        customerEmail: transaction.customerEmail,
        verified: transaction.verified,
        paidAt: transaction.paidAt,
        failedAt: transaction.failedAt,
        createdAt: transaction.createdAt,
        metadata: {
          plan: transaction.extraField1,
          userId: transaction.extraField2,
          familyId: transaction.extraField3,
          interval: transaction.extraField4
        }
      },
      subscription: subscription ? {
        id: subscription.id,
        plan: subscription.plan,
        interval: subscription.interval,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd
      } : null
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction details' });
  }
});

// NetCash transaction status update endpoint (for manual reconciliation)
billingRouter.post('/transaction/:reference/status', isAuthenticated, async (req, res) => {
  try {
    const { reference } = req.params;
    const { status, adminNote } = req.body;
    const authReq = req as AuthenticatedRequestStrict;
    const userId = authReq.user.claims.sub;
    
    // Validate request
    if (!reference) {
      return res.status(400).json({ error: 'Transaction reference is required' });
    }
    
    if (!['pending', 'completed', 'failed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    // Check if user has admin privileges (you might want to add role checking here)
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then(rows => rows[0]);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    
    // Find and update the transaction
    const transaction = await db
      .select()
      .from(netcashTransactions)
      .where(eq(netcashTransactions.paynowReference, reference))
      .limit(1)
      .then(rows => rows[0]);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    // Update transaction status
    await db
      .update(netcashTransactions)
      .set({
        status: status as any,
        updatedAt: new Date(),
        ...(adminNote && { extraField5: adminNote }) // Store admin note in extra field
      })
      .where(eq(netcashTransactions.id, transaction.id));
    
    res.json({ 
      message: 'Transaction status updated successfully',
      transaction: {
        reference,
        oldStatus: transaction.status,
        newStatus: status,
        updatedBy: userId,
        adminNote
      }
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({ error: 'Failed to update transaction status' });
  }
});

// NetCash transaction history endpoint for admins
billingRouter.get('/transactions', isAuthenticated, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequestStrict;
    const userId = authReq.user.claims.sub;
    const { status, limit = 50, offset = 0 } = req.query;
    
    // Check if user has admin privileges
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then(rows => rows[0]);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    
    // Get transactions with pagination
    const transactions = await db
      .select()
      .from(netcashTransactions)
      .where(status ? eq(netcashTransactions.status, status as any) : undefined)
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string))
      .orderBy(netcashTransactions.createdAt);
    
    res.json({
      transactions: transactions.map(t => ({
        id: t.id,
        reference: t.paynowReference,
        status: t.status,
        amount: t.amount,
        currency: t.currency,
        customerEmail: t.customerEmail,
        description: t.description,
        verified: t.verified,
        paidAt: t.paidAt,
        failedAt: t.failedAt,
        createdAt: t.createdAt,
        metadata: {
          plan: t.extraField1,
          userId: t.extraField2,
          familyId: t.extraField3,
          interval: t.extraField4,
          adminNote: t.extraField5
        }
      })),
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: transactions.length
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Helper function already imported from @shared/schema