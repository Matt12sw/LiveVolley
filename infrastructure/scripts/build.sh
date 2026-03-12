#!/bin/bash

# Production build script

echo "🏗️  Building LiveVolley for production..."

pnpm clean
pnpm install
pnpm type-check
pnpm lint
pnpm test
pnpm build

echo "✅ Build complete!"
