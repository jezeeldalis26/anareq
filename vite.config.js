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
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'anareQ',
        short_name: 'anareQ',
        description:
          'Auditoría clara de rentabilidad para campañas de Meta Ads.',
        theme_color: '#0c0a09',
        background_color: '#0c0a09',
        display: 'standalone',
        scope: '/',
        start_url: '/app',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Nuevo diagnóstico',
            short_name: 'Diagnóstico',
            description: 'Abrir anareQ para crear un nuevo diagnóstico.',
            url: '/app?tab=new',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Historial',
            short_name: 'Historial',
            description: 'Abrir el historial de auditorías guardadas.',
            url: '/app?tab=history',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Glosario',
            short_name: 'Glosario',
            description: 'Abrir el glosario de métricas de anareQ.',
            url: '/app?tab=glossary',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
      },
    }),
  ],
})