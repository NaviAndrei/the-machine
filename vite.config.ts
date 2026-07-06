import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/the-machine/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // the lazy 3D chunk carries three.js — large but loaded behind the boot screen
    chunkSizeWarningLimit: 1500,
  },
})
