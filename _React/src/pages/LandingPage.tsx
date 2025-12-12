import { FC } from "react"
import SEO from "../components/SEO/SEO"
import { useTranslation } from "../contexts/useTranslation"
import {
  getBreadcrumbJsonLd,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
} from "../utils"
import JsonLdScript from "../components/SEO/JsonLdScript"

const LandingPage: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <SEO
        title={t("homePage") + " - Olli Santa - " + t("composerAndConductor")}
        description={t("introMetaDescription")}
        canonical="https://ollisanta.fi/"
        keywords={[
          "Olli Santa",
          "composer",
          "music",
          "arrangement",
          "notation",
        ]}
        ogTitle={t("homePage") + " - Olli Santa - " + t("composerAndConductor")}
        ogDescription={t("introMetaDescription")}
      />
      <JsonLdScript data={getOrganizationJsonLd()} />
      <JsonLdScript
        data={getWebsiteJsonLd({ description: t("introMetaDescription") })}
      />
      <JsonLdScript
        data={getBreadcrumbJsonLd([
          { name: t("homePage"), url: "https://ollisanta.fi/" },
        ])}
      />
    </>
  )
}

export default LandingPage
