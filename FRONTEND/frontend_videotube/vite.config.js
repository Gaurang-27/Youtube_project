import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/users' : "https://de8b-2401-4900-1c5a-3167-1e7-8c87-73e9-3116.ngrok-free.app",
      '/videos' :"https://de8b-2401-4900-1c5a-3167-1e7-8c87-73e9-3116.ngrok-free.app",
      '/subs' : "https://de8b-2401-4900-1c5a-3167-1e7-8c87-73e9-3116.ngrok-free.app"
    },
  },
  plugins: [react(),tailwindcss()],
})
