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
import { subscriptions, invoices, users, webhookEvents, netcashTransactions } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export class NetcashProvider implements BillingProvider {
  readonly name = 'netcash';
  
  private serviceKey: string = '5a99a80a-77da-41d8-b161-272af6977889';
  private merchantEmail: string = 'LudidiL@gmail.com';
  private payNowUrl: string = 'https://paynow.netcash.co.za/site/paynow.aspx';
  
  constructor() {
    // NetCash provider is ready with hardcoded service key
  }
  
  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
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
    
    // Generate unique PayNow reference
    const paynowReference = `SB_${plan.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // Customer email - use user email or family placeholder
    const customerEmail = user?.email || `family-${familyId}@soulbridge.co.za`;
    
    // Create transaction record
    const transactionData = {
      paynowReference,
      amount,
      currency: 'ZAR',
      status: 'pending' as const,
      customerEmail,
      customerReference: `${plan}_${interval}_subscription`,
      description: `SoulBridge ${plan} plan (${interval})`,
      extraField1: plan, // Plan name
      extraField2: userId || '', // User ID
      extraField3: familyId || '', // Family ID  
      extraField4: interval, // Billing interval
      extraField5: '', // Reserved for partner ID
      subscriptionId: null, // Will be set after subscription creation
      invoiceId: null, // Will be set after invoice creation
    };
    
    // Store transaction in database
    await db.insert(netcashTransactions).values(transactionData);
    
    // NetCash Pay Now uses form submission - we need to generate form data
    // Since we can't redirect directly, we'll create a checkout URL that serves the form
    const checkoutUrl = this.generatePayNowForm(paynowReference, amount, customerEmail, transactionData.description, {
      plan,
      interval,
      userId,
      familyId,
    });
    
    return {
      checkoutUrl,
      sessionId: paynowReference,
    };
  }
  
  private generatePayNowForm(
    reference: string, 
    amount: number, 
    email: string, 
    description: string, 
    metadata: { plan: string; interval: string; userId?: string; familyId?: string }
  ): string {
    // Convert amount from cents to rands
    const amountInRands = (amount / 100).toFixed(2);
    
    // Base URL for our app
    const baseUrl = process.env.APP_URL || 'http://localhost:5000';
    
    // Return URL with metadata
    const returnUrl = `${baseUrl}/billing/netcash/return?reference=${reference}`;
    const cancelUrl = `${baseUrl}/pricing?cancelled=true`;
    const notifyUrl = `${baseUrl}/api/billing/webhook/netcash`;
    
    // Build form parameters for NetCash Pay Now
    const formParams = new URLSearchParams({
      'm1': reference, // Unique reference
      'm2': email, // Customer email
      'm3': amountInRands, // Amount in Rands
      'm4': this.serviceKey, // Service key
      'm5': this.merchantEmail, // Merchant email
      'm6': description, // Description
      'm9': returnUrl, // Return URL
      'm10': this.merchantEmail, // Merchant email (duplicate)
      'return_url': returnUrl,
      'cancel_url': cancelUrl,
      'notify_url': notifyUrl,
      // Extra fields for our metadata
      'extra1': metadata.plan,
      'extra2': metadata.userId || '',
      'extra3': metadata.familyId || '',
      'extra4': metadata.interval,
      'extra5': '', // Reserved for partner ID
    });
    
    // For NetCash Pay Now, we return a URL that will redirect to their payment page
    // In a real implementation, this would be a page on our site that auto-submits the form
    return `${this.payNowUrl}?${formParams.toString()}`;
  }
  
  async createPortalSession(userId: string): Promise<PortalSessionResponse> {
    // NetCash doesn't have a built-in customer portal like Stripe
    // We'll redirect to a custom billing management page
    return {
      portalUrl: `${process.env.APP_URL || 'http://localhost:5000'}/dashboard/billing`
    };
  }
  
  verifyWebhook(payload: string, signature: string): boolean {
    // NetCash Pay Now uses a different verification method
    // They typically include the reference and amount in the notification
    // For now, we'll parse the payload and verify essential fields are present
    try {
      const data = new URLSearchParams(payload);
      const reference = data.get('Reference') || data.get('m1');
      const amount = data.get('Amount') || data.get('m3'); 
      const status = data.get('RequestTrace') || data.get('Status');
      
      // Basic validation - ensure we have the required fields
      return !!(reference && amount && status !== undefined);
    } catch (error) {
      console.error('NetCash webhook verification error:', error);
      return false;
    }
  }
  
  async handleWebhook(payload: string, signature: string): Promise<void> {
    console.log('NetCash webhook received:', payload);
    
    // Verify webhook
    if (!this.verifyWebhook(payload, signature)) {
      throw new Error('Invalid webhook data');
    }
    
    // Parse NetCash notification data
    const data = new URLSearchParams(payload);
    const reference = data.get('Reference') || data.get('m1');
    const amount = data.get('Amount') || data.get('m3');
    const status = data.get('RequestTrace') || data.get('Status');
    const netcashId = data.get('TransactionAccepted') || data.get('TransactionID');
    const extra1 = data.get('Extra1'); // Plan
    const extra2 = data.get('Extra2'); // User ID
    const extra3 = data.get('Extra3'); // Family ID
    const extra4 = data.get('Extra4'); // Interval
    
    if (!reference) {
      throw new Error('Missing reference in NetCash webhook');
    }
    
    // Generate event ID for idempotency
    const eventId = `netcash_${reference}_${netcashId || Date.now()}`;
    
    // Check if we've already processed this event
    const existingEvent = await db
      .select()
      .from(webhookEvents)
      .where(and(
        eq(webhookEvents.provider, 'netcash'),
        eq(webhookEvents.eventId, eventId)
      ))
      .limit(1)
      .then(rows => rows[0]);
    
    if (existingEvent?.processed) {
      console.log(`NetCash webhook event ${eventId} already processed, skipping`);
      return;
    }
    
    // Record the webhook event
    const webhookEventData = {
      provider: 'netcash' as const,
      eventId,
      eventType: status === '1' ? 'payment.completed' : 'payment.failed',
      processed: false,
      rawEvent: Object.fromEntries(data.entries()),
    };
    
    if (existingEvent) {
      await db
        .update(webhookEvents)
        .set({ processed: false, rawEvent: webhookEventData.rawEvent })
        .where(eq(webhookEvents.id, existingEvent.id));
    } else {
      await db.insert(webhookEvents).values(webhookEventData);
    }
    
    // Find the transaction record
    const transaction = await db
      .select()
      .from(netcashTransactions)
      .where(eq(netcashTransactions.paynowReference, reference))
      .limit(1)
      .then(rows => rows[0]);
    
    if (!transaction) {
      console.error(`NetCash transaction not found for reference: ${reference}`);
      return;
    }
    
    // Process the payment based on status
    if (status === '1') { // Payment successful
      await this.handlePaymentSuccess(transaction, {
        netcashId: netcashId || '',
        amount: parseFloat(amount || '0') * 100, // Convert to cents
        extra1,
        extra2,
        extra3,
        extra4,
        rawData: Object.fromEntries(data.entries()),
      });
    } else {
      await this.handlePaymentFailure(transaction, {
        reason: data.get('Reason') || 'Payment failed',
        rawData: Object.fromEntries(data.entries()),
      });
    }
    
    // Mark event as processed
    await db
      .update(webhookEvents)
      .set({ 
        processed: true,
        processedAt: new Date()
      })
      .where(and(
        eq(webhookEvents.provider, 'netcash'),
        eq(webhookEvents.eventId, eventId)
      ));
  }
  
  private async handlePaymentSuccess(
    transaction: any,
    paymentData: {
      netcashId: string;
      amount: number;
      extra1?: string | null;
      extra2?: string | null;
      extra3?: string | null;
      extra4?: string | null;
      rawData: any;
    }
  ): Promise<void> {
    const { netcashId, amount, extra1: plan, extra2: userId, extra3: familyId, extra4: interval, rawData } = paymentData;
    
    // Update transaction status
    await db
      .update(netcashTransactions)
      .set({
        status: 'completed',
        netcashId,
        verified: true,
        verifiedAt: new Date(),
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(netcashTransactions.id, transaction.id));
    
    if (!plan || !interval || (!userId && !familyId)) {
      console.error('Invalid metadata in NetCash payment success', { plan, interval, userId, familyId });
      return;
    }
    
    // Create or update subscription
    const subscriptionData = {
      userId: userId || null,
      familyId: familyId || null,
      provider: 'netcash' as const,
      providerCustomerId: transaction.customerEmail,
      providerSubscriptionId: transaction.paynowReference,
      plan,
      interval,
      status: 'active' as const,
      currentPeriodEnd: new Date(Date.now() + (interval === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
      metadata: { netcashData: rawData },
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
    
    let subscriptionId: string;
    
    if (existingSubscription) {
      await db
        .update(subscriptions)
        .set({
          ...subscriptionData,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, existingSubscription.id));
      subscriptionId = existingSubscription.id;
    } else {
      const [newSubscription] = await db.insert(subscriptions).values(subscriptionData).returning();
      subscriptionId = newSubscription.id;
    }
    
    // Update user subscription status if individual subscription
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
    const [invoice] = await db.insert(invoices).values({
      subscriptionId,
      amount,
      currency: 'ZAR',
      status: 'paid',
      providerPaymentId: transaction.paynowReference,
      paidAt: new Date(),
      rawEvent: { event: 'payment.completed', data: rawData },
    }).returning();
    
    // Update transaction with subscription and invoice IDs
    await db
      .update(netcashTransactions)
      .set({
        subscriptionId,
        invoiceId: invoice.id,
        updatedAt: new Date(),
      })
      .where(eq(netcashTransactions.id, transaction.id));
    
    console.log(`NetCash payment completed for subscription ${subscriptionId}`);
  }
  
  private async handlePaymentFailure(
    transaction: any,
    failureData: {
      reason: string;
      rawData: any;
    }
  ): Promise<void> {
    const { reason, rawData } = failureData;
    
    // Update transaction status
    await db
      .update(netcashTransactions)
      .set({
        status: 'failed',
        verified: true,
        verifiedAt: new Date(),
        failedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(netcashTransactions.id, transaction.id));
    
    console.log(`NetCash payment failed for transaction ${transaction.paynowReference}: ${reason}`);
  }
}

// Export a singleton instance
export const netcashProvider = new NetcashProvider();