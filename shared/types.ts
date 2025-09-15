// Comprehensive type definitions for SoulBridge application

// ===============================
// API Response Types
// ===============================

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface ApiError extends Error {
  status?: number;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

// ===============================
// Payment & Billing Types  
// ===============================

export interface PaymentTransaction {
  id: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  verified: boolean;
  paidAt?: string;
  failedAt?: string;
  createdAt: string;
  metadata?: {
    plan?: string;
    userId?: string;
    familyId?: string;
    interval?: string;
    adminNote?: string;
  };
}

export interface SubscriptionData {
  id: string;
  plan: string;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionResponse {
  subscription?: SubscriptionData;
  tier: string;
  status: string;
  memorialCount: number;
  memorialLimit: number | -1; // -1 for unlimited
  entitlements?: {
    memorialLimit: number | -1;
    galleryLimit: number | -1;
    audioVideoSupport: boolean;
    privateSharing: boolean;
    customDomain: boolean;
  };
}

export interface PlanFeatures {
  memorialLimit: number | -1;
  galleryLimit: number | -1;
  audioVideoSupport: boolean;
  privateSharing: boolean;
  customDomain: boolean;
  familyAccess: boolean;
  prioritySupport: boolean;
}

// ===============================
// User & Authentication Types
// ===============================

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'partner';
  subscriptionTier?: string;
  subscriptionStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  claims: {
    sub: string;
    email: string;
    name?: string;
    role?: string;
  };
}

// ===============================
// Memorial & Content Types
// ===============================

export interface Memorial {
  id: string;
  name: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  biography?: string;
  profileImageUrl?: string;
  isPublic: boolean;
  slug: string;
  submittedBy: string;
  familyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderOfService {
  id: string;
  memorialId: string;
  title: string;
  serviceDate: string;
  serviceTime?: string;
  venue?: string;
  description?: string;
  events: OrderOfServiceEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderOfServiceEvent {
  id: string;
  orderOfServiceId: string;
  title: string;
  description?: string;
  startTime?: string;
  duration?: number;
  speaker?: string;
  eventType: 'reading' | 'hymn' | 'eulogy' | 'prayer' | 'music' | 'other';
  orderIndex: number;
}

// ===============================
// Form & Validation Types
// ===============================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PartnerBrandingConfig {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  customCss?: string;
}

// ===============================
// Dashboard & Analytics Types
// ===============================

export interface UsageStats {
  memorialsUsed: number;
  memorialsLimit: number | 'unlimited';
  currentMonthActive: number;
  totalTributes: number;
  storageUsed?: number;
  storageLimit?: number;
}

export interface DashboardStats {
  totalMemorials: number;
  totalViews: number;
  totalTributes: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'memorial_created' | 'tribute_added' | 'memorial_viewed' | 'order_of_service_created';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ===============================
// Partner & Business Types
// ===============================

export interface Partner {
  id: string;
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  website?: string;
  phone?: string;
  address?: string;
  status: 'pending' | 'approved' | 'suspended';
  brandingConfig?: PartnerBrandingConfig;
  createdAt: string;
  updatedAt: string;
}

// ===============================
// Utility Types
// ===============================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type PlanTier = 'remember' | 'honour' | 'legacy' | 'family_vault';

export type PaymentProvider = 'paystack' | 'netcash';

export type BillingInterval = 'monthly' | 'yearly';

// ===============================
// Component Prop Types
// ===============================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===============================
// Environment & Config Types
// ===============================

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  APP_URL: string;
  DATABASE_URL?: string;
  SUPABASE_DB_URL?: string;
  PAYSTACK_SECRET_KEY?: string;
  PAYSTACK_PUBLIC_KEY?: string;
  NETCASH_SERVICE_KEY?: string;
  NETCASH_MERCHANT_EMAIL?: string;
}

// ===============================
// Event & Webhook Types
// ===============================

export interface WebhookEvent {
  id: string;
  provider: PaymentProvider;
  eventId: string;
  eventType: string;
  processed: boolean;
  processedAt?: string;
  rawEvent: Record<string, unknown>;
  createdAt: string;
}

// ===============================
// Type Guards & Utility Functions
// ===============================

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && 'status' in error;
}

export function isPaymentTransaction(data: unknown): data is PaymentTransaction {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'status' in data &&
    'amount' in data
  );
}

export function isSubscriptionResponse(data: unknown): data is SubscriptionResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'tier' in data &&
    'status' in data &&
    'memorialCount' in data
  );
}