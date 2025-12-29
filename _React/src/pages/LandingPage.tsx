import { FC } from "react"
import SEO from "../components/SEO/SEO"
import { useTranslation } from "../contexts/useTranslation"
import {
  getBreadcrumbJsonLd,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
} from "../utils"
import JsonLdScript from "../components/SEO/JsonLdScript"
import { SITE_BASE_URL } from "../components/SEO/constants"
import { getHomePath } from "../utils/localizedRoutes"
import styles from "./css/about.module.css"
import { useTheme } from "../contexts/useTheme"

const LandingPage: FC = () => {
  const { t, language } = useTranslation()
  const darkMode = useTheme()

  const canonical = `${SITE_BASE_URL}${getHomePath(language)}`
  const alternates = [
    { hrefLang: "fi", href: `${SITE_BASE_URL}/` },
    { hrefLang: "en", href: `${SITE_BASE_URL}/en` },
  ]
  return (
    <>
      <SEO
        title={t("homePage") + " - Olli Santa - " + t("composerAndConductor")}
        description={t("introMetaDescription")}
        canonical={canonical}
        ogUrl={canonical}
        alternates={alternates}
        xDefault={`${SITE_BASE_URL}/`}
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
        data={getWebsiteJsonLd({
          description: t("introMetaDescription"),
          inLanguage: language,
          url: canonical,
        })}
      />
      <JsonLdScript
        data={getBreadcrumbJsonLd([{ name: t("homePage"), url: canonical }])}
      />
      <section
        className={
          darkMode
            ? `${styles.dark} dark ${styles["landing-section"]}`
            : styles["landing-section"]
        }
      >
        <div className={`${styles.landing} middle-wrap`}>
          <div className={`${styles["intro-text"]} middle-size`}>
            <p className="tleft">
              <small>{t("introText0")}</small>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default LandingPage
