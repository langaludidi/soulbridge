// Paystack Payment Gateway Client for SoulBridge
import axios from 'axios';
import crypto from 'crypto';
import {
  PaystackInitializeRequest,
  PaystackInitializeResponse,
  PaystackVerifyResponse,
  PaystackWebhookEvent,
  PaystackSubscriptionRequest,
  PaystackSubscriptionResponse,
  PaystackPlanRequest,
  PaystackPlanResponse,
} from './types';

// Paystack API Configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Initialize a Paystack payment
 * This creates a payment and returns the authorization URL
 */
export async function initiatePaystackPayment(
  params: PaystackInitializeRequest
): Promise<PaystackInitializeResponse> {
  try {
    const response = await axios.post<PaystackInitializeResponse>(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: params.email,
        amount: params.amount, // amount in kobo
        reference: params.reference || generatePaymentReference(),
        callback_url: params.callback_url,
        metadata: params.metadata,
        channels: params.channels || ['card', 'bank', 'ussd', 'mobile_money'],
        currency: params.currency || 'ZAR', // South African Rand
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Paystack payment initiation error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to initiate payment');
  }
}

/**
 * Verify a Paystack payment transaction
 */
export async function verifyPaystackPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  try {
    const response = await axios.get<PaystackVerifyResponse>(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to verify payment');
  }
}

/**
 * Verify Paystack webhook signature
 * This ensures the webhook came from Paystack
 */
export function verifyPaystackWebhook(
  payload: string,
  signature: string
): boolean {
  try {
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest('hex');

    return hash === signature;
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

/**
 * Generate a unique payment reference
 * Format: SB-{timestamp}-{randomString}
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SB-${timestamp}-${random}`;
}

/**
 * Convert amount from Rands to Kobo (Paystack uses kobo)
 * 1 Rand = 100 Kobo
 */
export function convertToKobo(amountInRands: number): number {
  return Math.round(amountInRands * 100);
}

/**
 * Convert amount from Kobo to Rands
 */
export function convertFromKobo(amountInKobo: number): number {
  return amountInKobo / 100;
}

/**
 * Validate payment amount
 * Ensures amount is positive and within acceptable range
 */
export function validatePaymentAmount(amount: number): boolean {
  // Minimum R10, Maximum R100,000
  return amount >= 10 && amount <= 100000;
}

/**
 * Get Paystack public key for client-side use
 */
export function getPaystackPublicKey(): string {
  return PAYSTACK_PUBLIC_KEY;
}

/**
 * Create a Paystack subscription plan
 * This is typically done once per plan, not per transaction
 */
export async function createPaystackPlan(
  params: PaystackPlanRequest
): Promise<PaystackPlanResponse> {
  try {
    const response = await axios.post<PaystackPlanResponse>(
      `${PAYSTACK_BASE_URL}/plan`,
      {
        name: params.name,
        interval: params.interval,
        amount: params.amount, // in kobo
        description: params.description,
        currency: params.currency || 'ZAR',
        send_invoices: true,
        send_sms: false,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Paystack plan creation error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create subscription plan');
  }
}

/**
 * Create a subscription for a customer
 * Requires authorization code from a previous successful transaction
 */
export async function createPaystackSubscription(
  params: PaystackSubscriptionRequest
): Promise<PaystackSubscriptionResponse> {
  try {
    const response = await axios.post<PaystackSubscriptionResponse>(
      `${PAYSTACK_BASE_URL}/subscription`,
      {
        customer: params.customer,
        plan: params.plan,
        authorization: params.authorization,
        start_date: params.start_date,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Paystack subscription creation error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create subscription');
  }
}

/**
 * Disable/Cancel a Paystack subscription
 */
export async function disablePaystackSubscription(
  subscriptionCode: string,
  emailToken: string
): Promise<{ status: boolean; message: string }> {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/subscription/disable`,
      {
        code: subscriptionCode,
        token: emailToken,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Paystack subscription disable error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to disable subscription');
  }
}

/**
 * Get Paystack plan codes for SoulBridge subscription plans
 * These should be created in Paystack dashboard or via API
 * Return them from environment variables for flexibility
 */
export function getPaystackPlanCodes() {
  return {
    essential_monthly: process.env.PAYSTACK_PLAN_ESSENTIAL_MONTHLY || 'PLN_essential_monthly',
    essential_annual: process.env.PAYSTACK_PLAN_ESSENTIAL_ANNUAL || 'PLN_essential_annual',
    family_monthly: process.env.PAYSTACK_PLAN_FAMILY_MONTHLY || 'PLN_family_monthly',
    family_annual: process.env.PAYSTACK_PLAN_FAMILY_ANNUAL || 'PLN_family_annual',
  };
}
