#!/bin/bash

# CS Society Clone - Startup Script

echo "🚀 Starting CS Society Clone..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found or not configured"
    echo "   The app will use mock data until Supabase is configured"
    echo "   See SETUP.md for configuration instructions"
    echo ""
fi

# Start the development server
echo "🌐 Starting development server on http://localhost:3000"
echo ""
npm run dev
