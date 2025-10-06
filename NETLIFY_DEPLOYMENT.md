# Netlify Deployment Guide

This project is configured for easy deployment of the frontend-only to Netlify while maintaining access to the external `types` directory and monorepo structure.

## Deployment Configuration

### Files Created:

- `netlify.toml` - Main Netlify configuration
- `build.sh` - Custom build script for monorepo
- `.nvmrc` - Node.js version specification

### Configuration Details:

1. **Base Directory**: Set to root (`.`) to access external `types` directory
2. **Publish Directory**: `frontend/dist` (build output)
3. **Build Command**: Custom script handles monorepo dependencies
4. **Node Version**: 18 (specified in `.nvmrc`)

## Deployment Steps:

### Option 1: Connect to Git Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect your repository
4. Netlify will automatically detect `netlify.toml` and use the configuration

### Option 2: Manual Deployment

1. Run `npm run build:frontend` locally
2. Drag and drop the `frontend/dist` folder to Netlify

## Configuration Features:

### Build Optimization:

- Only rebuilds when frontend-related files change
- Ignores backend changes to avoid unnecessary builds
- Proper handling of TypeScript path aliases (`@` and `~`)

### Performance & Security:

- SPA routing support (redirects to `index.html`)
- Security headers (XSS protection, content type sniffing prevention)
- Static asset caching (CSS/JS cached for 1 year)
- Immutable caching for bundled assets

### Environment Variables:

- `NODE_ENV=production` for optimized builds
- `NODE_VERSION=18` for consistent Node.js environment

## Troubleshooting:

### Build Fails:

- Check that all dependencies in root `package.json` are available
- Verify that `types` directory is accessible during build
- Ensure `build.sh` has executable permissions

### Runtime Errors:

- Check browser console for missing assets
- Verify all imports from `~/types/*` are resolving correctly
- Ensure SPA routing is working (404s redirect to index.html)

### Path Resolution Issues:

- Frontend uses `@/*` for internal paths (`frontend/src/*`)
- Frontend uses `~/*` for external types (`types/*`)
- Vite config and TypeScript config both define these aliases

## Build Process:

1. Install root dependencies (for workspace setup)
2. Install frontend dependencies
3. Build frontend with access to external types
4. Output to `frontend/dist/`
5. Deploy only the `dist` folder to Netlify

The configuration ensures the frontend can access the shared `types` directory while only deploying the built frontend assets.
