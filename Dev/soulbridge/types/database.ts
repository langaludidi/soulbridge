/**
 * Database Types for SoulBridge MVP
 * Auto-generated types matching Supabase schema
 */

// ============================================
// ENUMS
// ============================================

export type UserRole = 'user' | 'creator' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

// ============================================
// PROFILE
// ============================================

export interface Profile {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  date_of_birth: string | null;

  // Address
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string;

  // Preferences
  preferred_language: string;
  timezone: string;
  notification_preferences: NotificationPreferences;

  // Role and status
  role: UserRole;
  status: UserStatus;

  // Metadata
  metadata: Record<string, any>;

  // Timestamps
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
}

export interface ProfileInsert {
  clerk_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone_number?: string;
  date_of_birth?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  preferred_language?: string;
  timezone?: string;
  notification_preferences?: NotificationPreferences;
  role?: UserRole;
  status?: UserStatus;
  metadata?: Record<string, any>;
}

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone_number?: string;
  date_of_birth?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  preferred_language?: string;
  timezone?: string;
  notification_preferences?: NotificationPreferences;
  metadata?: Record<string, any>;
  last_sign_in_at?: string;
}

// ============================================
// USER SESSION
// ============================================

export interface UserSession {
  id: string;
  profile_id: string;
  clerk_session_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  signed_in_at: string;
  signed_out_at: string | null;
  session_duration: string | null;
}

export interface UserSessionInsert {
  profile_id: string;
  clerk_session_id?: string;
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
}

// ============================================
// AUDIT LOG
// ============================================

export interface AuditLog {
  id: string;
  profile_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AuditLogInsert {
  profile_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

// ============================================
// USER STATISTICS (View)
// ============================================

export interface UserStatistics {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  last_sign_in_at: string | null;
  total_sessions: number;
  total_actions: number;
}

// ============================================
// DATABASE SCHEMA
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      user_sessions: {
        Row: UserSession;
        Insert: UserSessionInsert;
        Update: Partial<UserSessionInsert>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: AuditLogInsert;
        Update: Partial<AuditLogInsert>;
      };
    };
    Views: {
      user_statistics: {
        Row: UserStatistics;
      };
    };
    Functions: {
      update_updated_at_column: {
        Args: Record<string, never>;
        Returns: undefined;
      };
      log_profile_changes: {
        Args: Record<string, never>;
        Returns: undefined;
      };
    };
  };
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: any;
}

// ============================================
// WEBHOOK TYPES
// ============================================

export interface ClerkWebhookEvent {
  type: string;
  data: any;
  object: 'event';
}

export interface ClerkUserCreatedEvent extends ClerkWebhookEvent {
  type: 'user.created';
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
    }>;
    first_name: string;
    last_name: string;
    image_url: string;
    phone_numbers?: Array<{
      phone_number: string;
      id: string;
    }>;
    created_at: number;
    updated_at: number;
  };
}

export interface ClerkUserUpdatedEvent extends ClerkWebhookEvent {
  type: 'user.updated';
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
    }>;
    first_name: string;
    last_name: string;
    image_url: string;
    phone_numbers?: Array<{
      phone_number: string;
      id: string;
    }>;
    updated_at: number;
  };
}

export interface ClerkUserDeletedEvent extends ClerkWebhookEvent {
  type: 'user.deleted';
  data: {
    id: string;
    deleted: boolean;
  };
}

export interface ClerkSessionCreatedEvent extends ClerkWebhookEvent {
  type: 'session.created';
  data: {
    id: string;
    user_id: string;
    client_id: string;
    created_at: number;
    last_active_at: number;
  };
}

export type ClerkWebhookEventType =
  | ClerkUserCreatedEvent
  | ClerkUserUpdatedEvent
  | ClerkUserDeletedEvent
  | ClerkSessionCreatedEvent;
