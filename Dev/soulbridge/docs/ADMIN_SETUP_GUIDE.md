# SoulBridge Admin Dashboard Setup Guide

## Overview

This guide will help you set up and access the SoulBridge admin dashboard. The admin dashboard provides comprehensive tools for managing the platform, including user management, memorial oversight, subscription tracking, and analytics.

## Features

The admin dashboard includes:

- **Overview Dashboard** - Platform statistics and recent activity
- **Memorial Management** - View, search, and manage all memorials
- **User Management** - View and manage all users and their plans
- **Subscription Management** - Track all subscriptions and billing
- **Analytics Dashboard** - Platform-wide engagement metrics
- **Settings** - Platform configuration and admin tools

## Setup Instructions

### Step 1: Run the Database Migration

1. Open the Supabase SQL Editor
2. Run the migration file: `supabase/migrations/015_admin_schema.sql`

This migration will:
- Add `is_admin` column to the profiles table
- Create admin activity logs table
- Create admin settings table
- Set up Row Level Security policies
- Create helper functions for admin operations

### Step 2: Grant Admin Access

After running the migration, you need to grant yourself admin privileges.

1. Find your Clerk user ID:
   - Go to the Clerk Dashboard
   - Navigate to Users
   - Click on your user
   - Copy the User ID

2. Run this SQL query in Supabase SQL Editor:

```sql
UPDATE profiles
SET is_admin = true
WHERE clerk_user_id = 'YOUR_CLERK_USER_ID_HERE';
```

Replace `YOUR_CLERK_USER_ID_HERE` with your actual Clerk user ID.

### Step 3: Verify Admin Access

1. Sign in to SoulBridge at https://soulbridge.co.za
2. Navigate to https://soulbridge.co.za/admin
3. You should see the admin dashboard

If you get redirected to the regular dashboard, verify:
- The migration ran successfully
- Your profile has `is_admin = true` in the database
- You're signed in with the correct account

## Admin Routes

The admin dashboard is accessible at the following routes:

- `/admin` - Overview dashboard
- `/admin/memorials` - Memorial management
- `/admin/users` - User management
- `/admin/subscriptions` - Subscription management
- `/admin/analytics` - Platform analytics
- `/admin/settings` - Admin settings

## Security

### Route Protection

The admin routes are protected by middleware that:
1. Checks if the user is authenticated (via Clerk)
2. Verifies the user has `is_admin = true` in the database
3. Redirects non-admin users to the dashboard

Middleware location: `middleware.ts:14-40`

### Admin Check Function

The admin check is performed by the `isUserAdmin()` function:

Location: `lib/admin/check-admin.ts:10-28`

```typescript
export async function isUserAdmin(clerkUserId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('clerk_user_id', clerkUserId)
    .single();

  return data?.is_admin === true;
}
```

### Activity Logging

All admin actions can be logged using the `logAdminActivity()` function:

Location: `lib/admin/check-admin.ts:30-58`

```typescript
await logAdminActivity({
  adminClerkId: userId,
  action: 'view_user',
  targetType: 'user',
  targetId: userId,
  details: { page: 'users' },
  ipAddress: request.ip,
  userAgent: request.headers['user-agent'],
});
```

## Database Schema

### Admin Tables

#### admin_activity_logs
Audit trail of all admin actions:
- `id` (UUID) - Primary key
- `admin_clerk_id` (TEXT) - Admin's Clerk ID
- `action` (TEXT) - Action performed
- `target_type` (TEXT) - Type of resource affected
- `target_id` (TEXT) - ID of affected resource
- `details` (JSONB) - Additional details
- `ip_address` (TEXT) - IP address
- `user_agent` (TEXT) - User agent
- `created_at` (TIMESTAMPTZ) - Timestamp

#### admin_settings
Platform-wide configuration:
- `id` (UUID) - Primary key
- `setting_key` (TEXT) - Unique setting identifier
- `setting_value` (JSONB) - Setting value
- `description` (TEXT) - Setting description
- `updated_by` (TEXT) - Who updated the setting
- `updated_at` (TIMESTAMPTZ) - Last update time

#### profiles.is_admin
Added column to profiles table:
- `is_admin` (BOOLEAN) - Admin flag, defaults to false

### Views

#### admin_dashboard_stats
Aggregated statistics for the overview dashboard:
- `total_users` - Total user count
- `new_users_30d` - New users in last 30 days
- `total_memorials` - Total memorial count
- `new_memorials_30d` - New memorials in last 30 days
- `total_tributes` - Total tribute count
- `total_candles` - Total candle count
- `paid_subscriptions` - Active paid subscription count
- `total_views_30d` - Total views in last 30 days

## Files Created

### Database
- `supabase/migrations/015_admin_schema.sql` - Database schema migration

### Backend
- `lib/admin/check-admin.ts` - Admin verification and activity logging
- `middleware.ts` - Updated with admin route protection

### Frontend
- `app/admin/layout.tsx` - Admin dashboard layout with navigation
- `app/admin/page.tsx` - Overview dashboard
- `app/admin/memorials/page.tsx` - Memorial management
- `app/admin/users/page.tsx` - User management
- `app/admin/subscriptions/page.tsx` - Subscription management
- `app/admin/analytics/page.tsx` - Analytics dashboard
- `app/admin/settings/page.tsx` - Admin settings

## Troubleshooting

### Can't Access Admin Dashboard

**Problem**: Redirected to /dashboard when accessing /admin

**Solution**:
1. Verify you're signed in
2. Check your profile in the database:
```sql
SELECT clerk_user_id, email, is_admin
FROM profiles
WHERE clerk_user_id = 'YOUR_CLERK_USER_ID';
```
3. Ensure `is_admin` is `true`

### Admin Dashboard Shows No Data

**Problem**: Dashboard displays but shows zero stats

**Solution**:
1. Check the `admin_dashboard_stats` view exists:
```sql
SELECT * FROM admin_dashboard_stats;
```
2. Verify RLS policies are set correctly
3. Ensure Supabase service role key is configured in environment variables

### Database Migration Failed

**Problem**: Migration errors when running 015_admin_schema.sql

**Solution**:
1. Check for existing tables/columns:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'is_admin';
```
2. If column exists, the migration may have already run
3. Check the migration history in Supabase

## Adding More Admins

To grant admin access to additional users:

1. Get their Clerk user ID from the admin users page
2. Run the SQL command:
```sql
UPDATE profiles
SET is_admin = true
WHERE clerk_user_id = 'THEIR_CLERK_USER_ID';
```

## Revoking Admin Access

To remove admin privileges:

```sql
UPDATE profiles
SET is_admin = false
WHERE clerk_user_id = 'THEIR_CLERK_USER_ID';
```

## Next Steps

After setting up admin access:

1. **Explore the Dashboard** - Familiarize yourself with all sections
2. **Review Settings** - Check platform configuration in /admin/settings
3. **Monitor Activity** - Use /admin/analytics to track platform usage
4. **Manage Content** - Review memorials and users as needed

## Support

For issues or questions about the admin dashboard:
- Check this documentation first
- Review the code in `app/admin/` and `lib/admin/`
- Check Supabase logs for database errors
- Verify Clerk authentication is working correctly

## Security Best Practices

1. **Limit Admin Users** - Only grant admin access to trusted individuals
2. **Monitor Activity Logs** - Regularly review `admin_activity_logs` table
3. **Use Strong Authentication** - Ensure Clerk MFA is enabled for admin accounts
4. **Regular Audits** - Periodically review who has admin access
5. **Keep Credentials Safe** - Never share admin credentials or Clerk/Supabase keys

---

**Version**: 1.0
**Last Updated**: 2025-01-27
**Author**: SoulBridge Development Team
