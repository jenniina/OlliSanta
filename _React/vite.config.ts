import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../olli/dist',
    chunkSizeWarningLimit: 500,
  },
})
