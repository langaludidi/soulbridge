import postgres from 'postgres';

const DATABASE_URL = 'postgresql://postgres:Kaya@0802&tando@db.jjuwdplambkndelfyjcy.supabase.co:5432/postgres';
const PROJECT_ID = 'jjuwdplambkndelfyjcy';

console.log('🔍 Checking if Supabase project is ready...');
console.log(`Project: ${PROJECT_ID}`);
console.log('');

let attempts = 0;
const maxAttempts = 20;
const interval = 15000; // 15 seconds

async function checkConnection() {
  attempts++;
  console.log(`⏳ Attempt ${attempts}/${maxAttempts}...`);
  
  try {
    const sql = postgres(DATABASE_URL, { 
      ssl: { rejectUnauthorized: false },
      max: 1,
      connect_timeout: 10,
      idle_timeout: 5
    });
    
    const result = await sql`SELECT version(), current_database(), current_user`;
    await sql.end();
    
    console.log('');
    console.log('🎉 SUCCESS! Supabase is ready!');
    console.log('✅ Connection established');
    console.log(`📊 Database: ${result[0].current_database}`);
    console.log(`👤 User: ${result[0].current_user}`);
    console.log(`🔧 PostgreSQL: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`);
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. npm run db:generate');
    console.log('2. npm run db:migrate');
    console.log('3. npm run dev');
    console.log('4. Test: curl http://localhost:5000/api/health');
    
    return true;
  } catch (error) {
    if (error.message.includes('ENOTFOUND')) {
      console.log('❌ Host not found - project still provisioning...');
    } else if (error.message.includes('timeout')) {
      console.log('⏰ Connection timeout - retrying...');
    } else if (error.message.includes('authentication failed')) {
      console.log('🔐 Authentication failed - check password');
      console.log('   Current password: Kaya@0802&tando');
      return false;
    } else {
      console.log('❌ Other error:', error.message);
    }
    
    if (attempts >= maxAttempts) {
      console.log('');
      console.log('🚨 Max attempts reached. Manual steps:');
      console.log('1. Check https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy');
      console.log('2. Verify project is active and not paused');
      console.log('3. Go to Settings > Database and copy the exact connection string');
      console.log('4. Update your .env file with the correct connection string');
      return false;
    }
    
    console.log(`⏳ Retrying in ${interval/1000} seconds...`);
    setTimeout(checkConnection, interval);
    return null; // Continue checking
  }
}

checkConnection();