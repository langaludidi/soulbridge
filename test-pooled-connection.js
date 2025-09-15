import postgres from 'postgres';

// Try pooled connection format (common for new Supabase projects)
const POOLED_URL = 'postgresql://postgres.jjuwdplambkndelfyjcy:Kaya@0802&tando@aws-0-us-east-1.pooler.supabase.com:6543/postgres';
const DIRECT_URL = 'postgresql://postgres:Kaya@0802&tando@db.jjuwdplambkndelfyjcy.supabase.co:5432/postgres';

console.log('🔍 Testing multiple connection formats...\n');

async function testConnection(url, name) {
  console.log(`📡 Testing ${name}...`);
  console.log(`   URL: ${url.replace(/:([^:@]*@)/, ':***@')}`);
  
  try {
    const sql = postgres(url, { 
      ssl: { rejectUnauthorized: false },
      max: 1,
      connect_timeout: 10
    });
    
    const result = await sql`SELECT version(), current_database()`;
    await sql.end();
    
    console.log(`✅ ${name} SUCCESS!`);
    console.log(`   Database: ${result[0].current_database}`);
    console.log(`   PostgreSQL: ${result[0].version.split(' ')[1]}\n`);
    
    // Update .env with working connection
    console.log(`🔧 Working connection string for .env:`);
    console.log(`SUPABASE_DB_URL="${url}"`);
    console.log(`DATABASE_URL="${url}"\n`);
    
    return true;
  } catch (error) {
    console.log(`❌ ${name} failed: ${error.message}\n`);
    return false;
  }
}

async function testAll() {
  // Test pooled connection first (more likely to work for new projects)
  if (await testConnection(POOLED_URL, 'Pooled Connection')) {
    return;
  }
  
  // Test direct connection
  if (await testConnection(DIRECT_URL, 'Direct Connection')) {
    return;
  }
  
  console.log('🚨 Neither connection worked. Next steps:');
  console.log('1. Check https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy');
  console.log('2. Verify project is "Active" and database is running');
  console.log('3. Copy exact connection string from Settings > Database');
  console.log('4. Check if you need to wait longer for provisioning');
}

testAll();