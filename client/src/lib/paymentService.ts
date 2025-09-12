import axios from 'axios';

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  description: string;
  features: string[];
}

export interface CheckoutRequest {
  plan: string;
  interval: 'monthly' | 'yearly';
  provider?: 'paystack' | 'netcash';
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface SubscriptionStatus {
  subscription: {
    id: string;
    plan: string;
    interval: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
  tier: string;
  status: string;
  memorialCount: number;
  memorialLimit: number;
}

class PaymentService {
  private baseURL: string;

  constructor() {
    this.baseURL = '/api/billing';
  }

  /**
   * Initialize payment session
   */
  async createCheckoutSession(request: CheckoutRequest): Promise<CheckoutResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/checkout`, request);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Payment initialization failed';
      throw new Error(message);
    }
  }

  /**
   * Get current subscription status
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response = await axios.get(`${this.baseURL}/subscription`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch subscription status';
      throw new Error(message);
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/subscription`);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to cancel subscription';
      throw new Error(message);
    }
  }

  /**
   * Get customer portal URL
   */
  async getCustomerPortal(): Promise<{ portalUrl: string }> {
    try {
      const response = await axios.get(`${this.baseURL}/portal`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to get customer portal';
      throw new Error(message);
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(reference: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${this.baseURL}/verify`, { reference });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Payment verification failed';
      throw new Error(message);
    }
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency: string = 'ZAR'): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency
    }).format(price);
  }

  /**
   * Get available plans
   */
  getAvailablePlans(): Plan[] {
    return [
      {
        id: 'remember',
        name: 'Remember',
        price: 0,
        interval: 'monthly',
        description: 'Perfect for commemorating a single loved one with dignity and respect.',
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
        price: 49,
        interval: 'monthly',
        description: 'Honor multiple family members with enhanced memorial features and media galleries.',
        features: [
          '3 memorials',
          'Full obituary & quote',
          'Gallery (10 images)',
          'Audio or video',
          'Shareable private/public link'
        ]
      },
      {
        id: 'legacy',
        name: 'Legacy',
        price: 99,
        interval: 'monthly',
        description: 'Create unlimited memorials with advanced features for preserving family history.',
        features: [
          'Unlimited memorials',
          'Gallery (unlimited images)',
          'Audio or video',
          'Timeline of life events',
          'Family tree builder',
          'Shareable private/public link'
        ]
      },
      {
        id: 'family_vault',
        name: 'Family Vault',
        price: 199,
        interval: 'monthly',
        description: 'Complete family memorial solution with collaboration features.',
        features: [
          'Unlimited family memorials',
          'Multi-user access',
          'Gallery (unlimited images)',
          'Audio or video',
          'Timeline of life events',
          'Family tree builder',
          'Private family sharing',
          'Priority support'
        ]
      }
    ];
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;