import postgres from 'postgres';

const variations = [
  // Different pooled formats
  'postgresql://postgres.jjuwdplambkndelfyjcy:Kaya@0802&tando@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres.jjuwdplambkndelfyjcy:Kaya@0802&tando@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres.jjuwdplambkndelfyjcy:Kaya@0802&tando@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  
  // URL encoded password versions
  'postgresql://postgres:Kaya%400802%26tando@db.jjuwdplambkndelfyjcy.supabase.co:5432/postgres',
  'postgresql://postgres.jjuwdplambkndelfyjcy:Kaya%400802%26tando@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
  
  // Try different ports
  'postgresql://postgres:Kaya@0802&tando@db.jjuwdplambkndelfyjcy.supabase.co:5432/postgres?sslmode=require',
];

async function testVariation(url, index) {
  console.log(`\n${index + 1}. Testing variation ${index + 1}...`);
  console.log(`   Format: ${url.includes('pooler') ? 'Pooled' : 'Direct'}`);
  console.log(`   URL: ${url.replace(/:([^:@]*[@%])/, ':***@').substring(0, 80)}...`);
  
  try {
    const sql = postgres(url, { 
      ssl: { rejectUnauthorized: false },
      max: 1,
      connect_timeout: 5
    });
    
    const result = await sql`SELECT version(), current_database()`;
    await sql.end();
    
    console.log(`   ✅ SUCCESS!`);
    console.log(`   Database: ${result[0].current_database}`);
    console.log(`   Version: ${result[0].version.split(' ')[1]}`);
    console.log(`\n🎉 WORKING CONNECTION FOUND!`);
    console.log(`Add this to your .env file:`);
    console.log(`SUPABASE_DB_URL="${url}"`);
    console.log(`DATABASE_URL="${url}"`);
    
    return true;
  } catch (error) {
    if (error.message.includes('ENOTFOUND')) {
      console.log(`   ❌ DNS resolution failed`);
    } else if (error.message.includes('Tenant or user not found')) {
      console.log(`   ⚠️  Authentication issue (but server reachable!)`);
    } else if (error.message.includes('timeout')) {
      console.log(`   ⏰ Connection timeout`);
    } else {
      console.log(`   ❌ ${error.message}`);
    }
    return false;
  }
}

async function testAll() {
  console.log('🧪 Testing connection string variations...');
  console.log('This will help identify the correct format for your Supabase project.\n');
  
  for (let i = 0; i < variations.length; i++) {
    if (await testVariation(variations[i], i)) {
      return; // Stop on first success
    }
  }
  
  console.log('\n🚨 None of the variations worked.');
  console.log('\n📋 Manual steps required:');
  console.log('1. Visit: https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy');
  console.log('2. Check project status - should be "Active"');
  console.log('3. Go to Settings > Database');
  console.log('4. Copy the EXACT connection string from the dashboard');
  console.log('5. Try both pooled and direct connection options');
  console.log('6. If still having issues, try resetting your database password');
}

testAll();