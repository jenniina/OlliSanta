import { FC } from "react"
import Login from "../components/Login/Login"
import { getBreadcrumbJsonLd } from "../utils"
import JsonLdScript from "../components/SEO/JsonLdScript"

interface Props {
  heading: string
}

const LoginPage: FC<Props> = ({ heading }) => {
  return (
    <div className="login-page">
      <section className="medium">
        <h2>{heading}</h2>
        <JsonLdScript
          data={getBreadcrumbJsonLd([
            { name: "Home", url: "https://ollisanta.fi/" },
            { name: heading, url: "https://ollisanta.fi/login" },
          ])}
        />
        <Login />
      </section>
    </div>
  )
}

export default LoginPage
