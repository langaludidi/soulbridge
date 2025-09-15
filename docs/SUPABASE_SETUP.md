# Supabase Setup Guide for SoulBridge

This guide will help you set up Supabase as your database backend for the SoulBridge application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- SoulBridge project cloned locally

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/sign up
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `SoulBridge` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the region closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (usually takes 1-2 minutes)

## Step 2: Get Your Connection Details

From your Supabase dashboard, go to **Settings** → **Database**:

### Option A: Connection String (Recommended)
1. Under "Connection string", copy the **URI** format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
   ```
2. Replace `[YOUR-PASSWORD]` with the database password you set in Step 1

### Option B: Individual Parameters
If you prefer individual parameters, note down:
- **Host**: `[PROJECT-REF].supabase.co`
- **Database**: `postgres`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: [Your database password]

## Step 3: Get API Keys (Optional)

If you plan to use Supabase's real-time features or client-side auth:

Go to **Settings** → **API**:
- **URL**: `https://[PROJECT-REF].supabase.co`
- **Anon (public) key**: Copy this key
- **Service role key**: Copy this key (keep it secret!)

## Step 4: Configure Environment Variables

Update your `.env` file with ONE of these configurations:

### Option A: Using Connection String (Recommended)
```env
# Supabase Database Connection (Direct URL)
SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# Optional: Supabase API Configuration (for real-time features)
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your_supabase_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key_here"
```

### Option B: Using Individual Parameters
```env
# Supabase Individual Connection Parameters
SUPABASE_HOST="[PROJECT-REF].supabase.co"
SUPABASE_PASSWORD="your_database_password"
SUPABASE_DATABASE="postgres"
SUPABASE_USER="postgres"
SUPABASE_PORT="5432"

# Optional: Supabase API Configuration
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your_supabase_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key_here"
```

### Option C: Keep Existing DATABASE_URL
```env
# If you want to use Supabase with the existing DATABASE_URL format
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
```

## Step 5: Run Database Migrations

1. Generate and apply migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

2. Optionally, seed the database:
   ```bash
   npm run db:seed
   ```

## Step 6: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the health check endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```

   You should see output like:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-01-15T10:30:00.000Z",
     "version": "1.0.0",
     "environment": "development",
     "uptime": 125,
     "database": {
       "status": "connected",
       "type": "supabase",
       "timestamp": "2024-01-15T10:30:00.000Z",
       "error": null
     }
   }
   ```

## Step 7: Verify in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click on **Table Editor** in the sidebar
3. You should see your tables (memorials, tributes, etc.) listed
4. You can browse the data and run SQL queries from here

## Migration from Other Databases

### From Neon Database

If you're migrating from Neon, the process is straightforward since both use PostgreSQL:

1. **Export data from Neon** (if you have existing data):
   ```bash
   pg_dump [NEON_DATABASE_URL] > backup.sql
   ```

2. **Import to Supabase**:
   ```bash
   psql [SUPABASE_DATABASE_URL] < backup.sql
   ```

3. **Update environment variables** as described in Step 4

4. **Test the migration** using the health check endpoint

### From Other PostgreSQL Providers

The same process applies for any PostgreSQL database. SoulBridge's database layer automatically detects and connects to Supabase when properly configured.

## Troubleshooting

### Connection Issues

1. **"Database connection failed"**:
   - Verify your password is correct
   - Check that your IP is not blocked (Supabase allows all IPs by default)
   - Ensure the project reference in the URL is correct

2. **"SSL connection required"**:
   - This is handled automatically by the SoulBridge configuration
   - Supabase requires SSL connections in production

3. **"Permission denied"**:
   - Verify you're using the correct database password
   - Check that the user is `postgres`

### Performance Considerations

- Supabase free tier has certain limitations (500MB database, 2GB bandwidth)
- For production, consider upgrading to Pro plan
- Use connection pooling (already configured in SoulBridge)

### Security Best Practices

1. **Never expose Service Role Key** in client-side code
2. **Use Row Level Security (RLS)** in Supabase for data protection
3. **Rotate keys regularly** from the Supabase dashboard
4. **Use environment variables** for all sensitive credentials

## Additional Features

### Real-time Subscriptions

If you configured the Supabase API keys, you can use real-time features:

```typescript
import { supabaseClient } from '@/lib/supabase';

// Subscribe to memorial changes
supabaseClient
  .channel('memorials')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'memorials'
  }, (payload) => {
    console.log('Memorial updated:', payload);
  })
  .subscribe();
```

### Authentication Integration

Supabase provides built-in authentication that can complement your existing Replit auth:

```typescript
import { supabaseClient } from '@/lib/supabase';

// Sign in with email
const { data, error } = await supabaseClient.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [SoulBridge GitHub Issues](https://github.com/langaludidi/soulbridge/issues)
- [Supabase Discord Community](https://discord.supabase.com/)

## Next Steps

1. Set up Row Level Security (RLS) policies in Supabase
2. Configure backup policies in Supabase dashboard
3. Set up monitoring and alerts
4. Consider using Supabase Edge Functions for serverless logic