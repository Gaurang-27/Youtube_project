import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


//import { defineConfig, loadEnv } from 'vite';

// export default defineConfig(({ mode }) => {
//   // Load environment variables based on the current mode (e.g., development, production)
//   const env = loadEnv(mode, process.cwd(), "");

//   return {
//     server: {
//       proxy: {
//         '/users' : env.VITE_BASE_URL_BACKEND,
//         '/videos' :env.VITE_BASE_URL_BACKEND,
//         '/subs' : env.VITE_BASE_URL_BACKEND
//       },
//     },
//     plugins: [react(),tailwindcss()],
// }});

//https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
})
