import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  //   https: {
  //     key: fs.readFileSync('./private-key.pem'),
  //     cert: fs.readFileSync('./certificate.pem'),
  //   }
    host: true,
    strictPort: false,
    cors: true,
    allowedHosts: ["grace-ec-instructions-suited.trycloudflare.com"] // Разрешаем LocalTunnel
  }
});


