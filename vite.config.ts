import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html'
      },
      manifest: {
        name: 'חיפוש תמונות חופשיות',
        short_name: 'Free Images',
        description: 'חיפוש תמונות חופשיות עם מידע ברור על רישיונות',
        lang: 'he',
        dir: 'rtl',
        display: 'standalone',
        start_url: '/',
        theme_color: '#ffffff',
        background_color: '#f7f8fb',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts'
  }
});
