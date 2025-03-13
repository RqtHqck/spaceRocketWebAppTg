import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: false,
    cors: true,
    allowedHosts: ["cefa61047cd9453ec5c0968dc81968bf.serveo.net"] // Разрешаем LocalTunnel
  }
});


