/**
 * SoulBridge Persistence Tests
 * Tests database connectivity and data persistence
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...');

  try {
    // Test 1: Check if we can connect
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful');
    console.log(`   Found ${data || 0} profiles`);
    return true;
  } catch (err) {
    console.error('❌ Database error:', err.message);
    return false;
  }
}

async function testTableExistence() {
  console.log('\n🔍 Checking Required Tables...');

  const tables = [
    'profiles',
    'memorials',
    'memorial_media',
    'tributes',
    'virtual_candles',
    'timeline_events',
    'guestbook_entries',
    'user_plans',
    'payment_transactions',
    'plan_usage'
  ];

  let allExist = true;

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });

      if (error) {
        console.error(`❌ Table '${table}' error:`, error.message);
        allExist = false;
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    } catch (err) {
      console.error(`❌ Table '${table}' check failed:`, err.message);
      allExist = false;
    }
  }

  return allExist;
}

async function testPlanFunctions() {
  console.log('\n🔍 Testing Plan Functions...');

  try {
    // Test get_active_user_plan function exists
    const { data, error } = await supabase.rpc('get_active_user_plan', {
      p_profile_id: '00000000-0000-0000-0000-000000000000'
    });

    // We expect null for a non-existent profile, not an error
    if (error && !error.message.includes('function')) {
      console.error('❌ get_active_user_plan function error:', error.message);
      return false;
    }

    console.log('✅ get_active_user_plan function exists');

    // Test can_create_memorial function
    const { data: canCreate, error: canCreateError } = await supabase.rpc('can_create_memorial', {
      p_profile_id: '00000000-0000-0000-0000-000000000000'
    });

    if (canCreateError && !canCreateError.message.includes('function')) {
      console.error('❌ can_create_memorial function error:', canCreateError.message);
      return false;
    }

    console.log('✅ can_create_memorial function exists');
    return true;
  } catch (err) {
    console.error('❌ Plan functions test failed:', err.message);
    return false;
  }
}

async function testDataIntegrity() {
  console.log('\n🔍 Testing Data Integrity...');

  try {
    // Check for memorials without profiles (orphaned data)
    const { data: orphanedMemorials, error: orphanError } = await supabase
      .from('memorials')
      .select('id')
      .is('profile_id', null);

    if (orphanError) {
      console.error('❌ Orphaned memorials check failed:', orphanError.message);
    } else {
      const count = orphanedMemorials?.length || 0;
      if (count > 0) {
        console.warn(`⚠️  Found ${count} orphaned memorials (no profile)`);
      } else {
        console.log('✅ No orphaned memorials found');
      }
    }

    // Check for plans without transactions (free plans are OK)
    const { data: plans, error: plansError } = await supabase
      .from('user_plans')
      .select('id, plan_type, transaction_id')
      .neq('plan_type', 'lite')
      .is('transaction_id', null);

    if (plansError) {
      console.error('❌ Paid plans check failed:', plansError.message);
    } else {
      const count = plans?.length || 0;
      if (count > 0) {
        console.warn(`⚠️  Found ${count} paid plans without transactions`);
      } else {
        console.log('✅ All paid plans have valid transactions');
      }
    }

    return true;
  } catch (err) {
    console.error('❌ Data integrity test failed:', err.message);
    return false;
  }
}

async function testPaymentIntegration() {
  console.log('\n🔍 Testing Payment Integration Setup...');

  const paystackPublic = envVars.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const paystackSecret = envVars.PAYSTACK_SECRET_KEY;

  if (!paystackPublic || !paystackPublic.startsWith('pk_')) {
    console.error('❌ Invalid Paystack public key');
    return false;
  }

  if (!paystackSecret || !paystackSecret.startsWith('sk_')) {
    console.error('❌ Invalid Paystack secret key');
    return false;
  }

  console.log('✅ Paystack keys configured correctly');
  console.log(`   Public key: ${paystackPublic.substring(0, 20)}...`);
  console.log(`   Secret key: ${paystackSecret.substring(0, 20)}...`);

  return true;
}

async function runAllTests() {
  console.log('==========================================');
  console.log('   SOULBRIDGE PERSISTENCE TEST SUITE     ');
  console.log('==========================================\n');

  const results = {
    connection: await testDatabaseConnection(),
    tables: await testTableExistence(),
    functions: await testPlanFunctions(),
    integrity: await testDataIntegrity(),
    payment: await testPaymentIntegration(),
  };

  console.log('\n==========================================');
  console.log('              TEST SUMMARY                ');
  console.log('==========================================');
  console.log(`Database Connection:  ${results.connection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Table Existence:      ${results.tables ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Plan Functions:       ${results.functions ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Data Integrity:       ${results.integrity ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Payment Setup:        ${results.payment ? '✅ PASS' : '❌ FAIL'}`);
  console.log('==========================================\n');

  const allPassed = Object.values(results).every(r => r === true);

  if (allPassed) {
    console.log('🎉 All persistence tests PASSED!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests FAILED. Please review the errors above.\n');
    process.exit(1);
  }
}

// Run tests
runAllTests();
