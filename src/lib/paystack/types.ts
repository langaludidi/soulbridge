// Paystack API Types for SoulBridge Payment Integration

export interface PaystackInitializeRequest {
  email: string;
  amount: number; // in kobo (cents)
  reference?: string;
  callback_url?: string;
  metadata?: {
    userId: string;
    planId: string;
    billingCycle: 'monthly' | 'annual' | 'lifetime';
    customerName?: string;
    [key: string]: any;
  };
  channels?: string[];
  currency?: string;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: {
      userId: string;
      planId: string;
      billingCycle: string;
      [key: string]: any;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
      risk_action: string;
    };
  };
}

export interface PaystackWebhookEvent {
  event: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: {
      userId: string;
      planId: string;
      billingCycle: string;
      [key: string]: any;
    };
    customer: {
      id: number;
      email: string;
      [key: string]: any;
    };
    authorization: {
      [key: string]: any;
    };
  };
}

export interface PaymentMetadata {
  userId: string;
  planId: string;
  billingCycle: 'monthly' | 'annual' | 'lifetime';
  amount: number;
  customerEmail: string;
  customerName: string;
}

export interface PaystackSubscriptionRequest {
  customer: string; // customer_code or email
  plan: string; // plan_code
  authorization: string; // authorization_code
  start_date?: string; // ISO 8601 format
}

export interface PaystackSubscriptionResponse {
  status: boolean;
  message: string;
  data: {
    customer: number;
    plan: number;
    integration: number;
    domain: string;
    start: number;
    status: 'active' | 'non-renewing' | 'cancelled' | 'attention';
    quantity: number;
    amount: number;
    subscription_code: string;
    email_token: string;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
    created_at: string;
    next_payment_date: string;
  };
}

export interface PaystackPlanRequest {
  name: string;
  interval: 'monthly' | 'annually' | 'yearly';
  amount: number; // in kobo
  description?: string;
  currency?: string;
}

export interface PaystackPlanResponse {
  status: boolean;
  message: string;
  data: {
    name: string;
    amount: number;
    interval: string;
    integration: number;
    domain: string;
    plan_code: string;
    send_invoices: boolean;
    send_sms: boolean;
    hosted_page: boolean;
    currency: string;
    id: number;
    created_at: string;
    updated_at: string;
  };
}
