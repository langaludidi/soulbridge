#!/bin/bash

echo "🚀 SoulBridge Supabase Setup - Final Steps"
echo "=========================================="
echo ""

echo "1️⃣ Testing connection..."
node test-exact-connection.js

if [ $? -eq 0 ]; then
    echo ""
    echo "2️⃣ Generating database schema..."
    npm run db:generate
    
    echo ""
    echo "3️⃣ Running database migrations..."
    npm run db:migrate
    
    echo ""
    echo "4️⃣ Starting development server..."
    echo "Press Ctrl+C to stop the server when you want to test"
    echo ""
    npm run dev &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 3
    
    echo ""
    echo "5️⃣ Testing health endpoint..."
    curl -s http://localhost:5000/api/health | json_pp || echo "Health check endpoint response above"
    
    echo ""
    echo "✅ Setup complete! Your SoulBridge app is running with Supabase."
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:5000"
    echo "   Health Check: http://localhost:5000/api/health"
    echo "   API Base: http://localhost:5000/api"
    echo ""
    echo "📊 Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy"
    echo ""
    echo "Press any key to stop the development server..."
    read -n 1 -s
    kill $SERVER_PID
else
    echo ""
    echo "❌ Connection failed. Please:"
    echo "1. Check https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy"
    echo "2. Verify project status is 'Active'"
    echo "3. Wait a few more minutes if still setting up"
    echo "4. Run this script again: ./run-when-ready.sh"
fi