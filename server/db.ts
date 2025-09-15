// Load environment variables first
import { config } from 'dotenv';
config();

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import ws from "ws";
import * as schema from "@shared/schema";
import { logger } from './utils/logger';

// Configure Neon for WebSocket support
neonConfig.webSocketConstructor = ws;

// Database connection configuration
const getDatabaseConnection = () => {
  // Check for Supabase configuration first
  const supabaseUrl = process.env.SUPABASE_DB_URL;
  const supabaseHost = process.env.SUPABASE_HOST;
  
  if (supabaseUrl) {
    logger.info('Using Supabase database connection');
    
    // For Supabase, use regular postgres connection
    const client = postgres(supabaseUrl, {
      ssl: { rejectUnauthorized: false },
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    return {
      type: 'supabase',
      db: drizzlePostgres(client, { schema }),
      client,
    };
  }
  
  // Check for direct DATABASE_URL (Neon or other PostgreSQL)
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    
    // Check if this is a Neon connection
    if (url.includes('neon.tech') || url.includes('@ep-')) {
      logger.info('Using Neon database connection');
      
      const pool = new Pool({ connectionString: url });
      return {
        type: 'neon',
        db: drizzle({ client: pool, schema }),
        pool,
      };
    } else {
      logger.info('Using standard PostgreSQL connection');
      
      // Use standard postgres connection for other PostgreSQL providers
      const client = postgres(url, {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
      });
      
      return {
        type: 'postgres',
        db: drizzlePostgres(client, { schema }),
        client,
      };
    }
  }
  
  // Construct from individual Supabase variables
  if (supabaseHost && process.env.SUPABASE_PASSWORD) {
    const host = supabaseHost;
    const password = process.env.SUPABASE_PASSWORD;
    const database = process.env.SUPABASE_DATABASE || 'postgres';
    const user = process.env.SUPABASE_USER || 'postgres';
    const port = process.env.SUPABASE_PORT || '5432';
    
    const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
    
    logger.info('Using constructed Supabase connection');
    
    const client = postgres(connectionString, {
      ssl: { rejectUnauthorized: false },
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    return {
      type: 'supabase',
      db: drizzlePostgres(client, { schema }),
      client,
    };
  }

  throw new Error(
    "Database connection not configured. Please set either:\n" +
    "1. DATABASE_URL (for Neon, PostgreSQL, or direct connection), or\n" +
    "2. SUPABASE_DB_URL (Supabase connection string), or\n" +
    "3. Individual Supabase variables: SUPABASE_HOST, SUPABASE_PASSWORD, etc.\n" +
    "4. For Supabase, also consider setting SUPABASE_URL and SUPABASE_ANON_KEY for client features"
  );
};

// Initialize database connection
const connection = getDatabaseConnection();

// Export the database instance
export const db = connection.db;

// Export connection details for health checks and cleanup
export const dbConnection = connection;

// Legacy export for backward compatibility
export const pool = connection.type === 'neon' ? connection.pool : null;

// Health check function
export const checkDatabaseHealth = async () => {
  try {
    const result = await db.select().from(schema.memorials).limit(1);
    logger.info(`Database health check passed (${connection.type})`);
    return { 
      healthy: true, 
      type: connection.type,
      timestamp: new Date() 
    };
  } catch (error) {
    logger.error(`Database health check failed (${connection.type}):`, error);
    return { 
      healthy: false, 
      type: connection.type,
      error: error.message,
      timestamp: new Date() 
    };
  }
};

// Graceful shutdown function
export const closeDatabaseConnection = async () => {
  try {
    if (connection.type === 'neon' && connection.pool) {
      await connection.pool.end();
      logger.info('Neon database pool closed');
    } else if (connection.client && typeof connection.client.end === 'function') {
      await connection.client.end();
      logger.info(`${connection.type} database connection closed`);
    }
  } catch (error) {
    logger.error('Error closing database connection:', error);
  }
};

// Handle process termination
process.on('SIGINT', closeDatabaseConnection);
process.on('SIGTERM', closeDatabaseConnection);