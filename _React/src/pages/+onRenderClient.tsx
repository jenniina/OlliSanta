import { hydrateRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import type { OnRenderClientAsync } from "vike/types"
import Page from "./+Page"

export const onRenderClient: OnRenderClientAsync = async () => {
  const container = document.getElementById("root")
  if (!container) throw new Error("Missing #root element")

  hydrateRoot(
    container,
    <HelmetProvider>
      <BrowserRouter>
        <Page />
      </BrowserRouter>
    </HelmetProvider>
  )
}
