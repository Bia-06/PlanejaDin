import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'GerenciaDin - Controle financeiro pessoal',
        short_name: 'GerenciaDin',
        description: 'A forma inteligente de cuidar do seu dinheiro',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png', // Corrigido para o nome padrão
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any' // Importante para desktop
          },
          {
            src: '/pwa-512x512.png', // Corrigido para o nome padrão
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any' // Versão para desktop/Windows
          },
          {
            src: '/pwa-512x512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' // Versão recortável para Android
          }
        ]
      }
    })
  ],
})