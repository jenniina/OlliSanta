import Register from "../components/Register/Register"
import { FC } from "react"
import { getBreadcrumbJsonLd } from "../utils"
import JsonLdScript from "../components/SEO/JsonLdScript"

interface Props {
  heading: string
}

const RegisterPage: FC<Props> = ({ heading }) => {
  return (
    <div className="register-page">
      <section className="medium">
        <h2>{heading}</h2>
        <JsonLdScript
          data={getBreadcrumbJsonLd([
            { name: "Home", url: "https://ollisanta.fi/" },
            { name: heading, url: "https://ollisanta.fi/register" },
          ])}
        />
        <Register />
      </section>
    </div>
  )
}

export default RegisterPage
