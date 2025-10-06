#!/bin/bash

# Netlify build script for frontend-only deployment
set -e

echo "🏗️  Starting Uma3 Frontend Build..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📁 Working directory: $(pwd)"

# Install dependencies from root (needed for monorepo setup)
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Go back to root for build (needed for types access)
cd ..

# Build the frontend (this runs from root and builds frontend)
echo "🔨 Building frontend..."
npm run build:frontend

echo "✅ Build completed successfully!"
echo "📁 Build output is in frontend/dist/"