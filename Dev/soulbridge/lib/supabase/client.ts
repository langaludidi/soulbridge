import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// ============================================
// SUPABASE CLIENT INSTANCES
// ============================================

/**
 * Get Supabase client for client-side usage
 * Uses anon key with RLS enabled
 */
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Get Supabase admin client for server-side usage
 * Uses service role key - bypasses RLS
 * ⚠️ ONLY use in API routes or server components
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get profile by Clerk user ID
 */
export async function getProfileByClerkId(clerkUserId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    throw error;
  }

  return data;
}

/**
 * Create or update profile from Clerk data
 */
export async function upsertProfile(profileData: {
  clerk_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone_number?: string;
}) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        clerk_user_id: profileData.clerk_user_id,
        email: profileData.email,
        first_name: profileData.first_name || null,
        last_name: profileData.last_name || null,
        avatar_url: profileData.avatar_url || null,
        phone_number: profileData.phone_number || null,
        last_sign_in_at: new Date().toISOString(),
      },
      {
        onConflict: 'clerk_user_id',
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Log user session
 */
export async function logUserSession(sessionData: {
  profile_id: string;
  clerk_session_id?: string;
  ip_address?: string;
  user_agent?: string;
}) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('user_sessions')
    .insert(sessionData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(logData: {
  profile_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('audit_logs')
    .insert(logData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
