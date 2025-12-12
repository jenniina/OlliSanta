import type { ReactNode } from "react"

const JsonLdScript = ({ data }: { data: object }): ReactNode => {
  // Helper component to render JSON-LD safely
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}
export default JsonLdScript
