import { FC } from "react"
import Dashboard from "../components/Dashboard/Dashboard"
import { getBreadcrumbJsonLd } from "../utils"
import JsonLdScript from "../components/SEO/JsonLdScript"

const DashboardPage: FC = () => {
  return (
    <div className="dashboard-page">
      <JsonLdScript
        data={getBreadcrumbJsonLd([
          { name: "Home", url: "https://ollisanta.fi/" },
          { name: "Dashboard", url: "https://ollisanta.fi/dashboard" },
        ])}
      />
      <Dashboard />
    </div>
  )
}

export default DashboardPage
