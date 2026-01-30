import { FC, useEffect, useRef, useState } from "react"
import { FiExternalLink } from "react-icons/fi"
import styles from "./footer.module.css"
import { useTranslation } from "../../contexts/useTranslation"
import { useLocation } from "react-router-dom"

const Footer: FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const scheduleUpdateRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    const update = () => {
      const doc = document.documentElement
      const docHeight = doc?.scrollHeight ?? 0
      const viewportHeight = window.innerHeight || 0
      setShowBackToTop(docHeight > viewportHeight * 1.2)
    }

    let rafId = 0
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(update)
    }
    scheduleUpdateRef.current = scheduleUpdate

    // Initial measure (and a second one shortly after for late layout changes).
    scheduleUpdate()
    const timeoutId = window.setTimeout(scheduleUpdate, 400)

    // Observe document size changes (route changes, images loading, accordion open, etc.)
    const ro = new ResizeObserver(scheduleUpdate)
    ro.observe(document.documentElement)

    window.addEventListener("resize", scheduleUpdate)
    return () => {
      scheduleUpdateRef.current = null
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(timeoutId)
      ro.disconnect()
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [])

  // Also re-check right after navigation.
  useEffect(() => {
    scheduleUpdateRef.current?.()
  }, [location.pathname, location.search, location.hash])

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
        {showBackToTop ? (
          <button
            type="button"
            className={`link ${styles["back-to-top"]}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            {t("backToTop")}
          </button>
        ) : null}
      </p>
    </footer>
  )
}

export default Footer
