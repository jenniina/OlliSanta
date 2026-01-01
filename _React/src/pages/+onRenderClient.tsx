import { hydrateRoot, type Root } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import type { OnRenderClientAsync } from "vike/types"
import Page from "./+Page"

let root: Root | null = null

export const onRenderClient: OnRenderClientAsync = async () => {
  const container = document.getElementById("root")
  if (!container) throw new Error("Missing #root element")

  const reactTree = (
    <HelmetProvider>
      <BrowserRouter>
        <Page />
      </BrowserRouter>
    </HelmetProvider>
  )

  // Vike may call onRenderClient again (e.g. client-side navigation).
  // Hydrate only once; then reuse the existing root.
  if (!root) {
    root = hydrateRoot(container, reactTree, {
      onRecoverableError: (error) => {
        // In production, React minifies hydration errors. This prints actionable info.
        // eslint-disable-next-line no-console
        console.error("[React recoverable error]", error)
      },
    })
  } else {
    root.render(reactTree)
  }
}
