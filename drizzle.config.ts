import { defineConfig } from "drizzle-kit";

// Support both direct DATABASE_URL and Supabase-specific environment variables
const getDatabaseUrl = () => {
  // If DATABASE_URL is provided (direct connection), use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // If using Supabase, construct the connection string
  if (process.env.SUPABASE_DB_URL) {
    return process.env.SUPABASE_DB_URL;
  }

  // Construct from individual Supabase variables
  if (process.env.SUPABASE_HOST && process.env.SUPABASE_PASSWORD) {
    const host = process.env.SUPABASE_HOST;
    const password = process.env.SUPABASE_PASSWORD;
    const database = process.env.SUPABASE_DATABASE || 'postgres';
    const user = process.env.SUPABASE_USER || 'postgres';
    const port = process.env.SUPABASE_PORT || '5432';
    
    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  throw new Error(
    "Database connection not configured. Please set either:\n" +
    "1. DATABASE_URL (direct connection string), or\n" +
    "2. SUPABASE_DB_URL (Supabase connection string), or\n" +
    "3. Individual Supabase variables: SUPABASE_HOST, SUPABASE_PASSWORD, etc."
  );
};

const databaseUrl = getDatabaseUrl();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  // Additional Supabase-specific configuration
  verbose: true,
  strict: true,
});
