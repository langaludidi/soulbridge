#!/bin/bash

echo "🕐 Waiting for Supabase database to become available..."
echo "Project: jjuwdplambkndelfyjcy"
echo ""

DB_HOST="db.jjuwdplambkndelfyjcy.supabase.co"
MAX_ATTEMPTS=30
ATTEMPT=0
SLEEP_TIME=20

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    echo "⏳ Attempt $ATTEMPT/$MAX_ATTEMPTS - Checking DNS resolution..."
    
    if nslookup $DB_HOST > /dev/null 2>&1; then
        echo "✅ Database hostname resolved!"
        echo ""
        echo "🧪 Testing database connection..."
        
        if node test-exact-connection.js; then
            echo ""
            echo "🎉 Database is ready! Running setup..."
            echo ""
            
            echo "📊 Running migrations..."
            npm run db:migrate
            
            echo ""
            echo "🚀 Starting development server..."
            npm run dev &
            SERVER_PID=$!
            
            sleep 3
            echo ""
            echo "🧪 Testing health endpoint..."
            curl -s http://localhost:5000/api/health | json_pp
            
            echo ""
            echo "✅ SoulBridge is running with Supabase!"
            echo "🌐 Frontend: http://localhost:5000"
            echo "📊 Supabase: https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy"
            echo ""
            echo "Press Enter to stop the server..."
            read
            kill $SERVER_PID
            exit 0
        else
            echo "⚠️  DNS resolved but connection failed. Check your Supabase dashboard."
        fi
    else
        echo "❌ Database hostname not yet available"
        if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
            echo "   Waiting ${SLEEP_TIME} seconds before retry..."
            sleep $SLEEP_TIME
        fi
    fi
done

echo ""
echo "🚨 Database did not become available within expected time."
echo "Manual steps:"
echo "1. Check: https://supabase.com/dashboard/project/jjuwdplambkndelfyjcy"
echo "2. Verify project status is 'Active'"
echo "3. Check database is enabled and running"
echo "4. Try running this script again later"