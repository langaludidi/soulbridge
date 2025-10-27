import { getSupabaseAdmin } from '@/lib/supabase/client';

/**
 * Check if a user is an admin by their Clerk user ID
 * @param clerkUserId - The Clerk user ID to check
 * @returns Promise<boolean> - True if user is admin, false otherwise
 */
export async function isUserAdmin(clerkUserId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data?.is_admin === true;
  } catch (error) {
    console.error('Error in isUserAdmin:', error);
    return false;
  }
}

/**
 * Log admin activity for audit trail
 */
export async function logAdminActivity(params: {
  adminClerkId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('admin_activity_logs')
      .insert({
        admin_clerk_id: params.adminClerkId,
        action: params.action,
        target_type: params.targetType || null,
        target_id: params.targetId || null,
        details: params.details || null,
        ip_address: params.ipAddress || null,
        user_agent: params.userAgent || null,
      });

    if (error) {
      console.error('Error logging admin activity:', error);
    }
  } catch (error) {
    console.error('Error in logAdminActivity:', error);
  }
}
