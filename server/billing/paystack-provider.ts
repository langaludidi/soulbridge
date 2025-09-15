import crypto from 'crypto';
import type { 
  BillingProvider, 
  CheckoutSessionRequest, 
  CheckoutSessionResponse,
  PortalSessionResponse,
  WebhookEvent,
  PlanKey,
  IntervalKey 
} from './types';
import { PLAN_PRICING } from './types';
import { db } from '../db';
import { subscriptions, invoices, users, webhookEvents } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export class PaystackProvider implements BillingProvider {
  readonly name = 'paystack';
  
  private secretKey?: string;
  private publicKey?: string;
  private webhookSecret?: string;
  
  constructor() {
    // Lazy initialization to prevent startup crashes
  }
  
  private initializeKeys() {
    if (this.secretKey) return;
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // Use development keys for local testing - these can be placeholder values
      this.secretKey = process.env.PAYSTACK_SECRET_KEY_DEV || '';
      this.publicKey = process.env.PAYSTACK_PUBLIC_KEY_DEV || '';
      this.webhookSecret = process.env.PAYSTACK_SECRET_KEY_DEV || '';
      
      if (!this.secretKey || this.secretKey.includes('placeholder')) {
        console.warn('Paystack development keys not configured. Paystack payments will not work in development.');
        throw new Error('Paystack not available in development mode - use NetCash for local testing');
      }
    } else {
      // Use live keys for production
      this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
      this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || '';
      this.webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET || this.secretKey;
      
      if (!this.secretKey || !this.secretKey.startsWith('sk_live_')) {
        throw new Error('Paystack live keys not configured for production - PAYSTACK_SECRET_KEY required');
      }
    }
    
    console.log(`Paystack provider initialized for ${isDevelopment ? 'development' : 'production'}`);
    console.log(`- Using ${isDevelopment ? 'test' : 'live'} keys`);
    console.log(`- Secret key: ${this.secretKey?.substring(0, 12)}...`);
  }
  
  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    this.initializeKeys();
    const { plan, interval, userId, familyId } = request;
    
    // Validate request
    if (!userId && !familyId) {
      throw new Error('Either userId or familyId must be provided');
    }
    if (userId && familyId) {
      throw new Error('Cannot provide both userId and familyId');
    }
    
    // Get user details
    const user = userId ? await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then(rows => rows[0]) : null;
      
    if (userId && !user) {
      throw new Error('User not found');
    }
    
    // Free plan doesn't need payment
    if (plan === 'remember') {
      throw new Error('Free plan does not require payment');
    }
    
    // Get pricing
    const amount = PLAN_PRICING[plan as PlanKey][interval as IntervalKey];
    if (!amount) {
      throw new Error(`Invalid plan/interval combination: ${plan}/${interval}`);
    }
    
    // Create Paystack transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user?.email || `family-${familyId}@soulbridge.co.za`,
        amount,
        currency: 'ZAR',
        metadata: {
          plan,
          interval,
          userId,
          familyId,
          source: 'soulbridge_subscription'
        },
        callback_url: `${process.env.APP_URL || 'http://localhost:5000'}/billing/success`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:5000'}/pricing`,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Paystack API error: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.status) {
      throw new Error(`Paystack error: ${data.message || 'Unknown error'}`);
    }
    
    return {
      checkoutUrl: data.data.authorization_url,
      sessionId: data.data.reference,
    };
  }
  
  async createPortalSession(userId: string): Promise<PortalSessionResponse> {
    // Paystack doesn't have a built-in customer portal like Stripe
    // We'll redirect to a custom billing management page
    return {
      portalUrl: `${process.env.APP_URL || 'http://localhost:5000'}/dashboard/billing`
    };
  }
  
  verifyWebhook(payload: string, signature: string): boolean {
    this.initializeKeys();
    const hash = crypto
      .createHmac('sha512', this.secretKey!) // Use secret key as per Paystack docs
      .update(payload)
      .digest('hex');
      
    return hash === signature;
  }
  
  async handleWebhook(payload: string, signature: string): Promise<void> {
    this.initializeKeys();
    
    // Verify webhook signature
    if (!this.verifyWebhook(payload, signature)) {
      throw new Error('Invalid webhook signature');
    }
    
    let event: WebhookEvent;
    try {
      event = JSON.parse(payload) as WebhookEvent;
    } catch (error) {
      throw new Error('Invalid webhook payload');
    }
    
    // Check if we've already processed this event (idempotency)
    const eventId = event.id || event.event_id || `${event.event}_${event.data?.reference || Date.now()}`;
    
    const existingEvent = await db
      .select()
      .from(webhookEvents)
      .where(and(
        eq(webhookEvents.provider, 'paystack'),
        eq(webhookEvents.eventId, eventId)
      ))
      .limit(1)
      .then(rows => rows[0]);
    
    if (existingEvent?.processed) {
      console.log(`Webhook event ${eventId} already processed, skipping`);
      return;
    }
    
    // Record the event (or update existing)
    const webhookEventData = {
      provider: 'paystack' as const,
      eventId,
      eventType: event.event,
      processed: false,
      rawEvent: event,
    };
    
    if (existingEvent) {
      await db
        .update(webhookEvents)
        .set({ processed: false, rawEvent: event })
        .where(eq(webhookEvents.id, existingEvent.id));
    } else {
      await db.insert(webhookEvents).values(webhookEventData);
    }
    
    console.log(`Processing Paystack webhook: ${event.event}`, event.data);
    
    switch (event.event) {
      case 'charge.success':
        await this.handleChargeSuccess(event);
        break;
      case 'subscription.create':
        await this.handleSubscriptionCreate(event);
        break;
      case 'subscription.disable':
        await this.handleSubscriptionDisable(event);
        break;
      case 'invoice.create':
      case 'invoice.update':
        await this.handleInvoiceUpdate(event);
        break;
      default:
        console.log(`Unhandled Paystack webhook event: ${event.event}`);
    }
    
    // Mark event as processed
    await db
      .update(webhookEvents)
      .set({ 
        processed: true,
        processedAt: new Date()
      })
      .where(and(
        eq(webhookEvents.provider, 'paystack'),
        eq(webhookEvents.eventId, eventId)
      ));
  }
  
  private async handleChargeSuccess(event: WebhookEvent): Promise<void> {
    const { data } = event;
    const { reference, amount, customer, metadata, status } = data;
    
    if (status !== 'success') return;
    
    // Extract subscription info from metadata
    const { plan, interval, userId, familyId } = metadata || {};
    
    if (!plan || !interval || (!userId && !familyId)) {
      console.error('Invalid metadata in charge.success webhook', metadata);
      return;
    }
    
    // Create or update subscription
    const subscriptionData = {
      userId: userId || null,
      familyId: familyId || null,
      provider: 'paystack' as const,
      providerCustomerId: customer.customer_code,
      providerSubscriptionId: reference, // Use transaction reference for now
      plan,
      interval,
      status: 'active' as const,
      currentPeriodEnd: new Date(Date.now() + (interval === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
      metadata: { paystackData: data },
    };
    
    // Insert or update subscription
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(
        userId 
          ? eq(subscriptions.userId, userId)
          : eq(subscriptions.familyId, familyId!)
      )
      .limit(1)
      .then(rows => rows[0]);
    
    if (existingSubscription) {
      await db
        .update(subscriptions)
        .set({
          ...subscriptionData,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, existingSubscription.id));
    } else {
      await db.insert(subscriptions).values(subscriptionData);
    }
    
    // Update user subscription status
    if (userId) {
      await db
        .update(users)
        .set({
          subscriptionTier: plan,
          subscriptionStatus: 'active',
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }
    
    // Create invoice record
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        userId 
          ? eq(subscriptions.userId, userId)
          : eq(subscriptions.familyId, familyId!)
      )
      .limit(1)
      .then(rows => rows[0]);
    
    if (subscription) {
      await db.insert(invoices).values({
        subscriptionId: subscription.id,
        amount,
        currency: 'ZAR',
        status: 'paid',
        providerPaymentId: reference,
        paidAt: new Date(),
        rawEvent: { event: event.event, data },
      });
    }
  }
  
  private async handleSubscriptionCreate(event: WebhookEvent): Promise<void> {
    // Handle subscription creation from Paystack plans
    console.log('Subscription created:', event.data);
  }
  
  private async handleSubscriptionDisable(event: WebhookEvent): Promise<void> {
    const { data } = event;
    const { subscription_code, customer } = data;
    
    // Find and update subscription
    await db
      .update(subscriptions)
      .set({
        status: 'canceled',
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.providerSubscriptionId, subscription_code));
    
    // Update user status if individual subscription
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.providerSubscriptionId, subscription_code))
      .limit(1)
      .then(rows => rows[0]);
      
    if (subscription?.userId) {
      await db
        .update(users)
        .set({
          subscriptionStatus: 'canceled',
          updatedAt: new Date(),
        })
        .where(eq(users.id, subscription.userId));
    }
  }
  
  private async handleInvoiceUpdate(event: WebhookEvent): Promise<void> {
    const { data } = event;
    console.log('Invoice updated:', data);
    
    // Handle invoice updates if needed
    // This could be used for failed payment retries, etc.
  }
}

// Export a singleton instance
export const paystackProvider = new PaystackProvider();