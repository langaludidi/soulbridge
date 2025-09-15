// Quick Supabase Connection Test
import postgres from 'postgres';

// Your correct Supabase connection string
const DATABASE_URL = 'postgresql://postgres:Kaya@0802&tando@db.jjuwdplambkndelfyjcy.supabase.co:5432/postgres';

console.log('🔍 Testing Supabase connection...');
console.log('Project: jjuwdplambkndelfyjcy');
console.log('');

async function testConnection() {
  console.log('📡 Testing connection to Supabase...');
  console.log(`   Host: db.jjuwdplambkndelfyjcy.supabase.co:5432`);
  console.log('');
  
  try {
    const sql = postgres(DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      max: 1,
      connect_timeout: 10,
    });
    
    // Test basic connectivity
    const result = await sql`SELECT 
      version() as version,
      current_database() as database,
      current_user as user,
      now() as timestamp
    `;
    
    await sql.end();
    
    console.log('✅ Connection successful!');
    console.log('');
    console.log('🎯 Your working connection string:');
    console.log('   postgresql://postgres:[PASSWORD]@db.jjuwdplambkndelfyjcy.supabase.co:5432/postgres');
    console.log('');
    console.log('📊 Database Info:');
    console.log('- Version:', result[0].version.split(' ')[0] + ' ' + result[0].version.split(' ')[1]);
    console.log('- Database:', result[0].database);
    console.log('- User:', result[0].user);
    console.log('- Connected at:', result[0].timestamp.toISOString());
    console.log('');
    console.log('🎉 Your Supabase database is ready for SoulBridge!');
    
    return { success: true, workingUrl: DATABASE_URL };
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('   Error:', error.message);
    console.log('');
    
    if (error.message.includes('password authentication failed')) {
      console.log('🚨 Authentication Error:');
      console.log('- Your password might be incorrect');
      console.log('- Go to Supabase Dashboard > Settings > Database');
      console.log('- Click "Reset database password" if needed');
      console.log('');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('🚨 Host Not Found:');
      console.log('- Check your internet connection');
      console.log('- Verify project is active in Supabase dashboard');
      console.log('- The host should be: db.jjuwdplambkndelfyjcy.supabase.co');
      console.log('');
    } else if (error.message.includes('timeout')) {
      console.log('🚨 Connection Timeout:');
      console.log('- Your network might be blocking the connection');
      console.log('- Try again in a moment');
      console.log('- Check if your firewall allows port 5432');
      console.log('');
    }
    
    return { success: false, workingUrl: null };
  }
}

// Run the test
testConnection().then((result) => {
  if (result.success) {
    console.log('📋 Next steps:');
    console.log('1. Update your .env file with the working connection string');
    console.log('2. Run: npm run db:generate && npm run db:migrate');
    console.log('3. Start your app: npm run dev');
  }
  process.exit(result.success ? 0 : 1);
}).catch((error) => {
  console.error('Test script error:', error);
  process.exit(1);
});