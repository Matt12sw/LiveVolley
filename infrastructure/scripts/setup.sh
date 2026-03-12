#!/bin/bash

# Setup script for LiveVolley

set -e

echo "🚀 Setting up LiveVolley..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup environment
echo "⚙️  Setting up environment..."
if [ ! -f .env.local ]; then
  cp apps/api/.env.example apps/api/.env.local
  echo "✅ Created .env.local (update with your values)"
fi

# Database setup
echo "🗄️  Setting up database..."
pnpm db:generate
pnpm db:push

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Run 'pnpm dev' to start development"
echo "3. Visit http://localhost:3000"
