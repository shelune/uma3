#!/bin/bash

# Netlify build script for frontend-only deployment
set -e

echo "🏗️  Starting Uma3 Frontend Build..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📁 Working directory: $(pwd)"

# Install dependencies from root (needed for monorepo setup)
echo "📦 Installing root dependencies (including dev + workspaces)..."
npm ci --include=dev --include-workspace-root

# Build the frontend (this runs from root and builds frontend)
echo "🔨 Building frontend..."
npm run build:frontend

echo "✅ Build completed successfully!"
echo "📁 Build output is in frontend/dist/"