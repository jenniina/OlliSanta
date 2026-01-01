import type { ReactNode } from "react"

const JsonLdScript = ({ data }: { data: object }): ReactNode => {
  // React escapes text children of <script> during SSR (e.g. quotes become &quot;),
  // which causes hydration mismatches if the client renders the raw JSON string.
  // Using dangerouslySetInnerHTML keeps SSR/CSR output consistent.
  const json = JSON.stringify(data).replace(/</g, "\\u003c")
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
export default JsonLdScript
