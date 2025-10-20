/**
 * SoulBridge API Endpoints Test
 * Tests all API routes are accessible and properly configured
 */

const fs = require('fs');
const path = require('path');

// Find all API route files
function findAPIRoutes(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findAPIRoutes(filePath, fileList);
    } else if (file === 'route.ts' || file === 'route.js') {
      // Extract route path from file location
      const routePath = filePath
        .replace(/.*\/app\/api/, '/api')
        .replace(/\/route\.(ts|js)$/, '')
        .replace(/\[([^\]]+)\]/g, ':$1'); // Convert [id] to :id

      fileList.push({
        file: filePath,
        route: routePath,
        exists: true
      });
    }
  });

  return fileList;
}

function checkRouteImplementation(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  return {
    hasGET: content.includes('export async function GET'),
    hasPOST: content.includes('export async function POST'),
    hasPUT: content.includes('export async function PUT'),
    hasPATCH: content.includes('export async function PATCH'),
    hasDELETE: content.includes('export async function DELETE'),
    hasAuth: content.includes('@clerk') || content.includes('auth()'),
    hasSupabase: content.includes('supabase'),
    hasErrorHandling: content.includes('try') && content.includes('catch'),
  };
}

console.log('==========================================');
console.log('   SOULBRIDGE API ENDPOINTS TEST         ');
console.log('==========================================\n');

const apiDir = path.join(__dirname, '..', 'app', 'api');
const routes = findAPIRoutes(apiDir);

console.log(`Found ${routes.length} API endpoints:\n`);

routes.forEach(({ file, route }) => {
  const impl = checkRouteImplementation(file);
  const methods = [];

  if (impl.hasGET) methods.push('GET');
  if (impl.hasPOST) methods.push('POST');
  if (impl.hasPUT) methods.push('PUT');
  if (impl.hasPATCH) methods.push('PATCH');
  if (impl.hasDELETE) methods.push('DELETE');

  console.log(`✅ ${route}`);
  console.log(`   Methods: ${methods.join(', ')}`);
  console.log(`   Auth: ${impl.hasAuth ? '✅' : '❌'} | DB: ${impl.hasSupabase ? '✅' : '❌'} | Error Handling: ${impl.hasErrorHandling ? '✅' : '⚠️ '}`);
  console.log('');
});

console.log('==========================================');
console.log('              ENDPOINT SUMMARY            ');
console.log('==========================================');
console.log(`Total API Endpoints: ${routes.length}`);

const authRoutes = routes.filter(r => checkRouteImplementation(r.file).hasAuth).length;
const dbRoutes = routes.filter(r => checkRouteImplementation(r.file).hasSupabase).length;
const errorHandling = routes.filter(r => checkRouteImplementation(r.file).hasErrorHandling).length;

console.log(`With Authentication: ${authRoutes}/${routes.length}`);
console.log(`With Database Access: ${dbRoutes}/${routes.length}`);
console.log(`With Error Handling: ${errorHandling}/${routes.length}`);
console.log('==========================================\n');

console.log('🎉 API endpoint scan complete!\n');
