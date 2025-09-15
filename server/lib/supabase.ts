import { createClient } from '@supabase/supabase-js';
import type { Database } from '@shared/types/database';

// Environment variables for Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

// Server-side client with service role key (full access)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Client-side client with anonymous key (row-level security enforced)
export const supabaseClient = supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  : null;

// Utility function to get the appropriate client
export const getSupabaseClient = (useServiceRole = false) => {
  if (useServiceRole) {
    if (!supabaseAdmin) {
      throw new Error('Service role client not available. Set SUPABASE_SERVICE_ROLE_KEY.');
    }
    return supabaseAdmin;
  }

  if (!supabaseClient) {
    throw new Error('Anonymous client not available. Set SUPABASE_ANON_KEY.');
  }
  
  return supabaseClient;
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error);
  
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        throw new Error('Resource not found');
      case 'PGRST301':
        throw new Error('Unauthorized access');
      case '23505':
        throw new Error('Duplicate entry');
      case '23503':
        throw new Error('Foreign key constraint violation');
      default:
        throw new Error(`Database error: ${error.message}`);
    }
  }
  
  throw new Error(`${operation} failed: ${error.message || 'Unknown error'}`);
};

// Database health check
export const checkSupabaseConnection = async () => {
  try {
    const client = getSupabaseClient(true);
    const { data, error } = await client
      .from('memorials')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    return { healthy: true, timestamp: new Date() };
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return { healthy: false, error: error.message, timestamp: new Date() };
  }
};