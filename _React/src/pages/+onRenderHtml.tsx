import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"
import { HelmetProvider } from "react-helmet-async"
import { escapeInject, dangerouslySkipEscape } from "vike/server"
import type { OnRenderHtmlAsync, PageContextServer } from "vike/types"
import Page from "./+Page"

export const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext: PageContextServer
) => {
  const helmetContext: any = {}

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={pageContext.urlOriginal}>
        <Page />
      </StaticRouter>
    </HelmetProvider>
  )

  const helmet = helmetContext.helmet
  const head = helmet
    ? dangerouslySkipEscape(
        [
          helmet.title?.toString(),
          helmet.priority?.toString?.(),
          helmet.meta?.toString(),
          helmet.link?.toString(),
          helmet.script?.toString(),
          helmet.noscript?.toString(),
          helmet.style?.toString(),
        ]
          .filter(Boolean)
          .join("\n")
      )
    : ""

  const documentHtml = escapeInject`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${head}
  </head>
  <body>
    <div id="root">${dangerouslySkipEscape(appHtml)}</div>
  </body>
</html>`

  return {
    documentHtml,
  }
}
