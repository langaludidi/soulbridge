# 🔗 Get Your Supabase Connection String

Your Supabase project: **jjuwdplambkndelfyjcy**  
Dashboard: https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy

## 📋 Step-by-Step Instructions

### 1. Open Your Supabase Dashboard
👉 Go to: https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy/settings/database

### 2. Find Connection String Section
Look for the "**Connection string**" section on the page

### 3. Choose Connection Method

#### Option A: Direct Connection (Recommended)
1. **Uncheck** "Use connection pooling" if it's checked
2. Select **"URI"** tab
3. Copy the connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.jjuwdplambkndelfyjcy.supabase.co:5432/postgres
   ```

#### Option B: Connection Pooling (For High Traffic)
1. **Check** "Use connection pooling"
2. Select **"URI"** tab  
3. Copy the connection string that looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

### 4. Update Your Environment

Once you have the connection string, create your `.env` file:

```env
# Copy this format and replace [YOUR-CONNECTION-STRING] with what you copied
SUPABASE_DB_URL="[YOUR-CONNECTION-STRING]"

# Or alternatively, use the standard format:
DATABASE_URL="[YOUR-CONNECTION-STRING]"
```

### 5. Test the Connection

```bash
# Copy the connection string to test file
echo 'import postgres from "postgres";

const DATABASE_URL = "YOUR-CONNECTION-STRING-HERE";

async function test() {
  try {
    const sql = postgres(DATABASE_URL, { ssl: { rejectUnauthorized: false }, max: 1 });
    const result = await sql`SELECT version(), current_database()`;
    await sql.end();
    console.log("✅ Connected successfully!");
    console.log("Database:", result[0].current_database);
    console.log("Version:", result[0].version.split(" ")[0], result[0].version.split(" ")[1]);
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
  }
}

test();' > test-my-connection.js

# Run the test
node test-my-connection.js
```

## 🚨 Common Issues & Solutions

### Issue 1: "getaddrinfo ENOTFOUND"
**Cause:** Wrong hostname format  
**Solution:** Get the exact connection string from Supabase dashboard

### Issue 2: "password authentication failed"  
**Cause:** Wrong password or special characters  
**Solution:** 
- Reset your database password in Supabase dashboard
- Use a simpler password without special characters
- Or get the exact URI format from dashboard

### Issue 3: "Tenant or user not found"
**Cause:** Using connection pooling URL without proper setup  
**Solution:** Try the direct connection (uncheck "Use connection pooling")

### Issue 4: Connection timeout
**Cause:** Network issues or wrong port  
**Solution:** 
- Check your internet connection
- Verify you're using the correct host and port from dashboard
- Try both port 5432 (direct) and 6543 (pooled)

## 🎯 What to Do After Connection Works

1. **Update your .env file** with the working connection string
2. **Run database migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
3. **Start your application:**
   ```bash
   npm run dev
   ```
4. **Test the health check:**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 📞 Need Help?

If you're still having issues:
1. Screenshot your Supabase database settings page
2. Check if your project is active and not paused
3. Verify your database password is correct
4. Try resetting your database password

Your connection string should work once you get it directly from the Supabase dashboard! 🎉