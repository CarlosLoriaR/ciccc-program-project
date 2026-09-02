import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Updates the service worker (and prompts a reload) automatically when a new
      // version is deployed — simplest option, no custom "update available" UI needed.
      registerType: 'autoUpdate',
      manifest: {
        name: 'Commutual',
        short_name: 'Commutual',
        description: 'Find and connect with people who share your daily commute.',
        start_url: '/',
        display: 'standalone',
        background_color: '#f8f9ff',
        theme_color: '#006492',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Never let the service worker cache API calls or the socket handshake —
        // this app's data is always live, not something to serve stale from cache.
        navigateFallbackDenylist: [/^\/api\//, /^\/socket\.io\//],
      },
    }),
  ],
  server: {
    // Proxies API calls to the backend so the browser sees everything as same-origin —
    // avoids cross-origin cookie issues with the refresh-token cookie in local dev.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
