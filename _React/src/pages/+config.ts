import type { Config } from "vike/types"

export default {
  // We keep using React Router for routing; Vike provides SSR/SSG pipeline.
  route: "*",
  clientRouting: true,
  prerender: true,
} satisfies Config
