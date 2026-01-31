import path from 'node:path'
import { params } from '@ampt/sdk'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  plugins: [react()],
  server: {
    open: false,
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 5173,
    strictPort: true,
    proxy: { '/api': { target: params('AMPT_URL'), changeOrigin: true, secure: false } }
  },
  build: { outDir: 'static', sourcemap: false }
})
