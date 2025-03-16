import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/users' : "http://localhost:8000",
      '/videos' :"http://localhost:8000"
    },
  },
  plugins: [react()],
})
