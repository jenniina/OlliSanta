import { FC, useEffect, useRef } from "react"
import { Link, NavLink } from "react-router-dom"
import { useTranslation } from "../../contexts/useTranslation"
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import styles from "./nav.module.css"
import { useTheme } from "../../contexts/useTheme"
import {
  getAboutPath,
  getContactPath,
  getHomePath,
} from "../../utils/localizedRoutes"

interface NavProps {
  location: string
}
interface LinkProps {
  href: string
  label: string
}

const SkipLinks: FC<{ skipLinks: LinkProps[] }> = ({ skipLinks }) => {
  return (
    <ul>
      {skipLinks?.map((link: LinkProps) => {
        return (
          <li key={link.href}>
            <Link
              to={link.href}
              className={`${styles["skip-link"]}`}
              onClick={() => {
                //unfocus the link after click
                ;(document.activeElement as HTMLAnchorElement)?.blur()
              }}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

const Nav: FC<NavProps> = ({ location }) => {
  const { t, language } = useTranslation()
  const darkMode = useTheme()
  const navRef = useRef<HTMLDivElement>(null)

  const homePath = getHomePath(language)
  const aboutPath = getAboutPath(language)
  const contactPath = getContactPath(language)

  const links = [
    {
      label: t("skipToMainNavigation"),
      href: "#link-about",
    },
    {
      label: t("skipToMainContent"),
      href: "#main-content",
    },
    {
      label: t("skipToFooter"),
      href: "#main-footer",
    },
  ]

  useEffect(() => {
    setTimeout(() => {
      darkMode
        ? navRef.current?.classList.add(styles["dark"])
        : navRef.current?.classList.remove(styles["dark"])
    }, 300)
  }, [darkMode])

  return (
    <>
      <nav className={styles["skip-links"]}>
        <SkipLinks skipLinks={links} />
      </nav>
      <nav ref={navRef} id="site-navigation" className={styles.nav}>
        <ul>
          {location !== homePath && (
            <li>
              <NavLink to={homePath} end>
                <span>{t("home")}</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to={aboutPath} id="link-about" end>
              <span>{t("about")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={contactPath}>
              <span>{t("contact")}</span>
            </NavLink>
          </li>
          <li>
            <LanguageSwitcher />
          </li>
          <li>
            <ThemeSwitcher />
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Nav
