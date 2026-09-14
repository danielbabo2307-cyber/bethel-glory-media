import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.svg',
        'pwa-192x192.png',
        'pwa-512x512.png',
      ],

      manifest: {
        name: 'BETHEL GLORY MEDIA',
        short_name: 'BETHEL GLORY',
        description:
          'Plateforme officielle de BETHEL GLORY MEDIA',

        start_url: '/',
        scope: '/',

        display: 'standalone',
        orientation: 'portrait',

        theme_color: '#14532d',
        background_color: '#ffffff',

        lang: 'fr',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,

        navigateFallbackDenylist: [
          /^\/api\//,
        ],
      },
    }),
  ],
})