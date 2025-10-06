import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    // Netlify's Linux build image occasionally lacks the LightningCSS native binding.
    // Fall back to Vite's PostCSS transformer so the build doesn't require the optional binary.
    transformer: 'postcss',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, '../types'),
    },
  },
})
