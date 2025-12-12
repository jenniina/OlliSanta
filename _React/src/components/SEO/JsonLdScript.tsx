import { FC } from "react"

const JsonLdScript: FC<{ data: object }> = ({ data }) => {
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}

export default JsonLdScript
