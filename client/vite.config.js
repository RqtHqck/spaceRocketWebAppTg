import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: false,
    cors: true,
    allowedHosts: ["0f72956bdb9fe987a4db7e19441bb30c.serveo.net"] // Разрешаем LocalTunnel
  }
});


