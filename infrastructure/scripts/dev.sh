#!/bin/bash

# Development environment starter

echo "🏐 Starting LiveVolley Development Environment..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing..."
    npm install -g pnpm
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Check if database is running
echo "🗄️  Checking database..."
if ! pnpm db:generate 2>&1 | grep -q "generated"; then
    echo "📝 Generating Prisma client..."
    pnpm db:generate
fi

# Start all apps
echo ""
echo "🚀 Starting all apps in parallel..."
echo ""
echo "Web:   http://localhost:3000"
echo "API:   http://localhost:3001"
echo "Admin: http://localhost:3002"
echo ""

pnpm dev
