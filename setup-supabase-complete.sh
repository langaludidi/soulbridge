#!/bin/bash

echo "🚀 SoulBridge Supabase Setup Script"
echo "==================================="
echo ""
echo "Project: jjuwdplambkndelfyjcy"
echo "Dashboard: https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Creating backup..."
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created: .env.backup.$(date +%Y%m%d_%H%M%S)"
    echo ""
fi

# Copy the Supabase configuration
echo "📋 Setting up your environment configuration..."
cp .env.supabase .env
echo "✅ Created .env with your Supabase configuration"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

echo "🔍 Verifying Supabase setup..."
echo ""

# Test database connection (if possible)
if command -v node &> /dev/null; then
    echo "📡 Testing database connection..."
    if node test-supabase-connection.js; then
        echo "✅ Database connection test passed!"
    else
        echo "⚠️  Database connection test failed, but this is expected if:"
        echo "   - Your Supabase project is still starting up (takes 1-2 minutes)"
        echo "   - You're on a restricted network"
        echo "   - The project needs to be accessed from browser first"
    fi
    echo ""
fi

echo "📋 Next Steps:"
echo ""
echo "1️⃣  Verify your Supabase project is active:"
echo "   👉 https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy"
echo "   - Make sure project status shows 'Active'"
echo "   - If it says 'Starting' or 'Paused', wait a moment"
echo ""

echo "2️⃣  Get your API keys (optional but recommended):"
echo "   👉 https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy/settings/api"
echo "   - Copy the 'anon public' key"
echo "   - Copy the 'service_role' key"
echo "   - Add them to your .env file"
echo ""

echo "3️⃣  Run database migrations:"
echo "   npm run db:generate"
echo "   npm run db:migrate"
echo ""

echo "4️⃣  Start your development server:"
echo "   npm run dev"
echo ""

echo "5️⃣  Test your application:"
echo "   curl http://localhost:5000/api/health"
echo ""

echo "🔧 If you encounter issues:"
echo ""
echo "Database Connection Issues:"
echo "- Wait 2-3 minutes for Supabase to fully start"
echo "- Check project status in Supabase dashboard"
echo "- Verify your database password is correct"
echo "- Try accessing your project dashboard first in browser"
echo ""

echo "Migration Issues:"
echo "- Make sure your .env file has the correct DATABASE_URL or SUPABASE_DB_URL"
echo "- Check that your database is accessible"
echo "- Run 'npm run db:push' if migrations fail"
echo ""

echo "🎉 Your SoulBridge application is configured for Supabase!"
echo ""
echo "Configuration files created:"
echo "- .env (your environment variables)"
echo "- .env.supabase (template for future reference)"
echo "- SUPABASE_CONNECTION_GUIDE.md (detailed instructions)"
echo ""

echo "Need help? Check the following files:"
echo "- SUPABASE_CONNECTION_GUIDE.md"
echo "- docs/SUPABASE_SETUP.md"
echo ""

echo "Happy coding! 🚀"