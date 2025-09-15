import postgres from 'postgres';

const DATABASE_URL = 'postgresql://postgres:Kaya@0802&tando@db.jjuwdplambkndelfyjcy.supabase.co:5432/postgres';

console.log('🔍 Testing your exact connection string...');
console.log('Connection string format verified ✅');
console.log('');

async function testConnection() {
  try {
    console.log('📡 Attempting connection...');
    const sql = postgres(DATABASE_URL, { 
      ssl: { rejectUnauthorized: false },
      max: 1,
      connect_timeout: 10
    });
    
    const result = await sql`SELECT version(), current_database(), current_user, now()`;
    await sql.end();
    
    console.log('');
    console.log('🎉 SUCCESS! Connection established!');
    console.log('✅ Database:', result[0].current_database);
    console.log('👤 User:', result[0].current_user);
    console.log('🔧 PostgreSQL:', result[0].version.split(' ')[1]);
    console.log('⏰ Server time:', result[0].now);
    console.log('');
    console.log('🚀 Ready for next steps:');
    console.log('1. npm run db:generate');
    console.log('2. npm run db:migrate');
    console.log('3. npm run dev');
    
    return true;
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('');
      console.log('🕐 DNS Issue: The hostname is not resolving yet.');
      console.log('This usually means:');
      console.log('• Supabase project is still being set up');
      console.log('• DNS propagation is in progress');
      console.log('• Project might be paused or inactive');
      console.log('');
      console.log('✋ Check your dashboard:');
      console.log('👉 https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy');
      console.log('');
      console.log('Look for:');
      console.log('• Project status: Should be "Active"');
      console.log('• Green indicators on all services');
      console.log('• No "Setting up" or "Paused" messages');
    } else if (error.message.includes('authentication')) {
      console.log('');
      console.log('🔐 Authentication issue - check your password');
      console.log('Current password in connection string: Kaya@0802&tando');
    }
    
    return false;
  }
}

testConnection();