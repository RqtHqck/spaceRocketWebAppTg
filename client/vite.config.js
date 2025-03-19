import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: false,
    cors: {
      origin: '*', // Разрешаем все источники
      methods: ['GET', 'POST', 'PUT', 'DELETE']

    },
    // allowedHosts: ["639d01b9b45a3d973bcdfe4028389b08.serveo.net"] // Разрешаем LocalTunnel
  }
});
