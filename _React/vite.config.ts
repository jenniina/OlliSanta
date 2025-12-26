import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import vike from "vike/plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vike()],
  server: {
    host: true,
  },
  base: "/",
  build: {
    emptyOutDir: true,
    outDir: "../olli/dist",
    chunkSizeWarningLimit: 500,
  },
  ssr: {
    noExternal: true,
  },
})
