import { FC } from "react"
import { FiExternalLink } from "react-icons/fi"
import styles from "./footer.module.css"
import { useTranslation } from "../../contexts/useTranslation"

const Footer: FC = () => {
  const { t } = useTranslation()
  return (
    <footer id="main-footer" className={styles.footer}>
      <p>
        <span>&copy; {new Date().getFullYear()} Olli Santa. </span>{" "}
        <span>{t("rightsReserved")}. </span>
        <span>
          {t("siteBy")}:{" "}
          <a href="https://jenniina.fi">
            <span>
              &nbsp;Jenniina <FiExternalLink />
            </span>
          </a>
        </span>
        <button
          type="button"
          className={`link ${styles["back-to-top"]}`}
          onClick={() => window.scrollTo(0, 0)}
        >
          {t("backToTop")}
        </button>
      </p>
    </footer>
  )
}

export default Footer
