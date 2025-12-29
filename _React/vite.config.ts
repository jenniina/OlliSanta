import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import vike from "vike/plugin"

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
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
    // Dev SSR: only bundle the problematic CJS dependency.
    // Build/prerender: bundle everything because output lives outside `_React`,
    // and Node won't resolve `_React/node_modules` from `../olli/dist/server`.
    noExternal: command === "build" ? true : ["react-helmet-async"],
  },
}))
