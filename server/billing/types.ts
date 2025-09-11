export interface CheckoutSessionRequest {
  plan: "remember" | "honour" | "legacy" | "family_vault";
  interval: "monthly" | "yearly";
  userId?: string;
  familyId?: string;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface PortalSessionResponse {
  portalUrl: string;
}

export interface WebhookEvent {
  id: string;
  event: string;
  data: any;
  signature?: string;
  timestamp?: string;
}

export interface BillingProvider {
  readonly name: string;
  
  // Create a checkout session for subscription
  createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse>;
  
  // Create a customer portal session for subscription management
  createPortalSession(userId: string): Promise<PortalSessionResponse>;
  
  // Handle webhook events from the provider
  handleWebhook(payload: string, signature: string): Promise<void>;
  
  // Verify webhook signature
  verifyWebhook(payload: string, signature: string): boolean;
}

// Plan pricing in cents (South African Rands)
export const PLAN_PRICING = {
  remember: {
    monthly: 0,
    yearly: 0,
  },
  honour: {
    monthly: 4900, // R49.00
    yearly: 49900, // R499.00 
  },
  legacy: {
    monthly: 9900, // R99.00
    yearly: 99900, // R999.00
  },
  family_vault: {
    monthly: 19900, // R199.00
    yearly: null, // Not available yearly
  },
} as const;

export type PlanKey = keyof typeof PLAN_PRICING;
export type IntervalKey = "monthly" | "yearly";