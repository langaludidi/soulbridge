import postgres from 'postgres';

// Exact connection string from your Supabase dashboard
const DASHBOARD_URL = 'postgresql://postgres.jjuwdplambkndelfyjcy:Kaya@0802&tando@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

console.log('🧪 Testing exact connection string from dashboard...');
console.log('Project: jjuwdplambkndelfyjcy');
console.log('Region: ap-southeast-1 (Asia Pacific - Singapore)');
console.log('Format: Pooled connection');
console.log('');

async function testDashboardConnection() {
  try {
    console.log('📡 Connecting to Supabase...');
    const sql = postgres(DASHBOARD_URL, { 
      ssl: { rejectUnauthorized: false },
      max: 1,
      connect_timeout: 10
    });
    
    const result = await sql`SELECT 
      version(), 
      current_database(), 
      current_user, 
      now() as server_time,
      inet_server_addr() as server_ip`;
    await sql.end();
    
    console.log('🎉 SUCCESS! Database connection established!');
    console.log('✅ Connection details:');
    console.log(`   Database: ${result[0].current_database}`);
    console.log(`   User: ${result[0].current_user}`);
    console.log(`   PostgreSQL: ${result[0].version.split(' ')[1]}`);
    console.log(`   Server time: ${result[0].server_time}`);
    console.log(`   Server IP: ${result[0].server_ip || 'hidden'}`);
    console.log('');
    console.log('🔧 Update your .env file with:');
    console.log(`SUPABASE_DB_URL="${DASHBOARD_URL}"`);
    console.log(`DATABASE_URL="${DASHBOARD_URL}"`);
    console.log('');
    console.log('🚀 Ready for next steps:');
    console.log('1. npm run db:migrate');
    console.log('2. npm run dev');
    console.log('3. Test: curl http://localhost:5000/api/health');
    
    return true;
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    
    if (error.message.includes('Tenant or user not found')) {
      console.log('');
      console.log('🔐 Authentication Issue:');
      console.log('- The connection string format looks correct');
      console.log('- Double-check your database password in Supabase dashboard');
      console.log('- Try resetting your database password');
      console.log('- Ensure project is fully active (not paused)');
    } else if (error.message.includes('timeout')) {
      console.log('');
      console.log('⏰ Connection timeout - the server may be under load');
      console.log('- Wait a moment and try again');
      console.log('- Check your internet connection');
    } else {
      console.log('');
      console.log('🔍 Other issue detected:');
      console.log(`- Error: ${error.message}`);
      console.log('- Check Supabase dashboard for project status');
    }
    
    return false;
  }
}

testDashboardConnection();