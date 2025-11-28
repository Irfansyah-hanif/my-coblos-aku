import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Coblos Aku',
        short_name: 'CoblosAku',
        theme_color: '#0f172a',
        icons: [
          { src: '/vite.svg', sizes: '192x192', type: 'image/svg+xml' } // Ganti dengan icon PWA aslimu nanti
        ]
      }
    })
  ],
})