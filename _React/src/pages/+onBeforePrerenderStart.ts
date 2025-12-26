import type { OnBeforePrerenderStartSync } from "vike/types"

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = () => {
  // Only public pages; protected/admin routes are intentionally excluded.
  return ["/", "/about", "/contact", "/login"]
}
