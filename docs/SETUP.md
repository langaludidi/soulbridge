# SoulBridge Setup Guide

This guide will help you set up SoulBridge for local development.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account (free tier is fine)
- (Optional) Netcash merchant account for payment testing

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

### 3. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be created (2-3 minutes)

### 4. Get Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy the **Project URL** → Add to `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the **anon/public key** → Add to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Create Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Open `supabase/schema.sql` in your code editor
4. Copy ALL the SQL code
5. Paste into the Supabase SQL Editor
6. Click **Run**

You should see "Success. No rows returned" – this means all tables were created successfully.

### 6. Enable Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Email** provider (should be enabled by default)
3. (Optional) Enable **Google** OAuth:
   - You'll need a Google Cloud project
   - Follow Supabase's guide to set up Google OAuth
   - Add redirect URL: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`

### 7. Create Storage Buckets

1. Go to **Storage** in Supabase
2. Click **New Bucket** and create these three buckets:
   - `memorial-photos` (Public bucket)
   - `memorial-videos` (Public bucket)
   - `memorial-audio` (Public bucket)

For each bucket:
- Make it **Public**
- Set policies to allow:
  - Public read access
  - Authenticated users can upload/delete their own files

### 8. Update Environment Variables

Your `.env.local` should look like this:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=SoulBridge

# Netcash (Optional - for payment testing)
NEXT_PUBLIC_NETCASH_SERVICE_KEY=your-service-key
NETCASH_SECRET_KEY=your-secret-key

# Email (Optional - for notifications)
RESEND_API_KEY=your-resend-api-key
```

### 9. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Verify Setup

### Test Authentication

1. Go to [http://localhost:3000/sign-up](http://localhost:3000/sign-up)
2. Create a test account
3. Check your email for verification
4. Sign in at [http://localhost:3000/sign-in](http://localhost:3000/sign-in)

### Test Database

1. After signing in, you should see the dashboard
2. Try creating a memorial (when feature is implemented)
3. Check Supabase **Table Editor** to see your data

### Check Supabase Console

- **Authentication** → **Users**: Your test user should appear
- **Table Editor** → **profiles**: Your profile should exist
- **Database** → **Roles & Policies**: RLS should be enabled

## Common Issues

### "Invalid API key" error
- Double-check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Make sure there are no extra spaces
- Restart dev server after changing `.env.local`

### "Schema does not exist" error
- Make sure you ran the entire `supabase/schema.sql` file
- Check the Supabase SQL Editor for any error messages

### Can't sign up
- Verify Email authentication is enabled in Supabase
- Check browser console for error messages
- Make sure RLS policies are set up correctly

### Profile not created automatically
- The `handle_new_user()` trigger should create profiles automatically
- If not working, check **Database** → **Triggers** in Supabase
- You can manually insert a profile for testing

## Next Steps

Once setup is complete:

1. **Explore the codebase**: Check out the components in `src/components/`
2. **Read the README**: Understanding the project structure
3. **Start developing**:
   - Implement the memorial creation wizard (`src/app/memorial/create/`)
   - Build public memorial pages (`src/app/memorial/[slug]/`)
   - Add file upload functionality

## Development Tips

- Use the Supabase Studio **Table Editor** to inspect your data
- Check **Logs** → **API Logs** to debug API issues
- Test RLS policies in the SQL Editor with different user contexts
- Use browser DevTools to inspect network requests

## Getting Help

- Check the [README.md](README.md) for project overview
- Review Supabase docs: https://supabase.com/docs
- Check Next.js docs: https://nextjs.org/docs

Happy coding! 🚀
