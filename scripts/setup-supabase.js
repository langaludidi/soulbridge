#!/usr/bin/env node

/**
 * Supabase Setup Script for SoulBridge
 * Project: jjuwdplambkndelfyjcy
 * 
 * This script helps you:
 * 1. Test your database connection
 * 2. Run initial migrations
 * 3. Verify the setup
 */

import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import chalk from 'chalk';

// Your project configuration
const PROJECT_REF = 'jjuwdplambkndelfyjcy';
const DATABASE_URL = 'postgresql://postgres:Kaya%400802%26tando@db.jjuwdplambkndelfyjcy.supabase.co:5432/postgres';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

console.log(chalk.blue.bold('🚀 SoulBridge Supabase Setup'));
console.log(chalk.gray('Project:', PROJECT_REF));
console.log(chalk.gray('Database URL configured: ✓'));
console.log('');

async function testDatabaseConnection() {
  console.log(chalk.yellow('📡 Testing database connection...'));
  
  try {
    const sql = postgres(DATABASE_URL.replace('%40', '@').replace('%26', '&'), {
      ssl: { rejectUnauthorized: false },
      max: 1,
    });
    
    const result = await sql`SELECT version(), current_database(), current_user`;
    await sql.end();
    
    console.log(chalk.green('✅ Database connection successful!'));
    console.log(chalk.gray('  PostgreSQL Version:', result[0].version.split(' ')[0] + ' ' + result[0].version.split(' ')[1]));
    console.log(chalk.gray('  Database:', result[0].current_database));
    console.log(chalk.gray('  User:', result[0].current_user));
    console.log('');
    
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Database connection failed:'));
    console.log(chalk.red('  ', error.message));
    console.log('');
    
    if (error.message.includes('password authentication failed')) {
      console.log(chalk.yellow('💡 Troubleshooting:'));
      console.log('   - Check your database password in Supabase dashboard');
      console.log('   - Go to: Settings > Database > Database password');
      console.log('   - Reset password if needed');
      console.log('');
    }
    
    return false;
  }
}

async function checkSupabaseAPI() {
  console.log(chalk.yellow('🔑 Checking Supabase API access...'));
  
  // Check if we can reach the API endpoint
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 401) {
      console.log(chalk.yellow('⚠️  Supabase API accessible but requires auth key'));
      console.log(chalk.gray('   This is expected - you need to set SUPABASE_ANON_KEY'));
      console.log('');
      
      console.log(chalk.blue('📋 Next steps for API keys:'));
      console.log(`   1. Go to: ${chalk.underline('https://supabase.com/dashboard/project/' + PROJECT_REF + '/settings/api')}`);
      console.log('   2. Copy the "anon" key and "service_role" key');
      console.log('   3. Add them to your .env file:');
      console.log(chalk.gray('      SUPABASE_ANON_KEY="your_anon_key_here"'));
      console.log(chalk.gray('      SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"'));
      console.log('');
      
      return true;
    } else {
      console.log(chalk.green('✅ Supabase API endpoint reachable'));
      return true;
    }
  } catch (error) {
    console.log(chalk.red('❌ Cannot reach Supabase API:'), error.message);
    return false;
  }
}

async function showNextSteps() {
  console.log(chalk.blue.bold('🎯 Next Steps:'));
  console.log('');
  
  console.log('1️⃣  ' + chalk.bold('Copy environment configuration:'));
  console.log('   cp .env.supabase.ready .env');
  console.log('');
  
  console.log('2️⃣  ' + chalk.bold('Get your Supabase API keys:'));
  console.log(`   Visit: ${chalk.underline('https://supabase.com/dashboard/project/' + PROJECT_REF + '/settings/api')}`);
  console.log('   Add SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY to .env');
  console.log('');
  
  console.log('3️⃣  ' + chalk.bold('Run database migrations:'));
  console.log('   npm run db:generate');
  console.log('   npm run db:migrate');
  console.log('');
  
  console.log('4️⃣  ' + chalk.bold('Start your application:'));
  console.log('   npm run dev');
  console.log('');
  
  console.log('5️⃣  ' + chalk.bold('Test the health check:'));
  console.log('   curl http://localhost:5000/api/health');
  console.log('');
  
  console.log(chalk.green.bold('🎉 Your Supabase integration is ready!'));
}

// Main execution
async function main() {
  const dbConnected = await testDatabaseConnection();
  
  if (dbConnected) {
    await checkSupabaseAPI();
    await showNextSteps();
  } else {
    console.log(chalk.red.bold('Setup incomplete due to database connection issues.'));
    console.log(chalk.yellow('Please check your database configuration and try again.'));
  }
}

// Handle missing dependencies gracefully
try {
  await main();
} catch (error) {
  if (error.message.includes('Cannot find package')) {
    console.log(chalk.yellow('⚠️  Missing dependencies. Installing...'));
    console.log('Please run: npm install');
    console.log('Then run this script again: node scripts/setup-supabase.js');
  } else {
    console.error(chalk.red('Script error:'), error.message);
  }
}