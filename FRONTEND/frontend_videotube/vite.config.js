import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/users' : "http://localhost:8000",
      '/videos' :"http://localhost:8000"
    },
  },
  plugins: [react(),tailwindcss()],
})
