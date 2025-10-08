# Database Setup Guide for SoulBridge

This guide will help you set up the Supabase database for the SoulBridge memorial platform.

## Prerequisites

1. A Supabase account and project created at [supabase.com](https://supabase.com)
2. Your Supabase project credentials (found in Project Settings > API)

## Initial Database Setup

### Step 1: Run the Main Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the entire contents of `/supabase/schema.sql`
5. Click **Run** to execute the SQL

This will create:
- All tables (profiles, memorials, gallery_items, timeline_events, tributes, relationships, plans, payments)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers and functions

### Step 2: Run Migrations

After running the main schema, run any migration files in `/supabase/migrations/`:

1. **Add Virtual Candles** (`add_virtual_candles.sql`):
   ```sql
   -- Add virtual candles table
   CREATE TABLE IF NOT EXISTS public.virtual_candles (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Add index
   CREATE INDEX IF NOT EXISTS idx_virtual_candles_memorial_id ON public.virtual_candles(memorial_id);

   -- Enable RLS
   ALTER TABLE public.virtual_candles ENABLE ROW LEVEL SECURITY;

   -- Add RLS policies
   CREATE POLICY "Anyone can view virtual candles" ON public.virtual_candles
     FOR SELECT USING (TRUE);

   CREATE POLICY "Anyone can light a candle" ON public.virtual_candles
     FOR INSERT WITH CHECK (TRUE);
   ```

### Step 3: Verify Tables

Run this query to verify all tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- gallery_items
- memorials
- payments
- plans
- profiles
- relationships
- timeline_events
- tributes
- virtual_candles

### Step 4: Set Up Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack (for payments)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### Memorial Creation Fails with Empty Error

If you get an empty error object `{}` when creating a memorial, check:

1. **RLS Policies**: Ensure the user is authenticated
   ```sql
   -- Check if insert policy exists
   SELECT * FROM pg_policies WHERE tablename = 'memorials' AND cmd = 'INSERT';
   ```

2. **Foreign Key**: Make sure the user profile exists
   ```sql
   -- Check if your user has a profile
   SELECT * FROM profiles WHERE id = 'your_user_id';
   ```

3. **Required Fields**: Ensure all NOT NULL fields are provided:
   - user_id
   - full_name
   - slug
   - privacy
   - status

### RLS Issues

If you're having permission issues, you can temporarily disable RLS to test:

```sql
-- TEMPORARY - DO NOT USE IN PRODUCTION
ALTER TABLE memorials DISABLE ROW LEVEL SECURITY;
```

Remember to re-enable it after testing:

```sql
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;
```

### Check Service Role Key

The service role key is needed for server-side operations. Make sure it's set in `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key
```

## Database Schema Overview

### Core Tables

1. **profiles** - User profiles (extends auth.users)
2. **memorials** - Memorial pages
3. **gallery_items** - Photos, videos, audio
4. **timeline_events** - Life events
5. **tributes** - Guestbook messages
6. **virtual_candles** - Virtual candle lighting feature
7. **relationships** - Family and friends
8. **plans** - Subscription plans
9. **payments** - Payment records

### Key Relationships

- memorials → profiles (user_id)
- gallery_items → memorials (memorial_id)
- timeline_events → memorials (memorial_id)
- tributes → memorials (memorial_id)
- virtual_candles → memorials (memorial_id)
- relationships → memorials (memorial_id)
- payments → profiles (user_id)
- payments → plans (plan_id)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
