import { FC, useEffect, useRef } from "react"
import { Link, NavLink } from "react-router-dom"
import { useTranslation } from "../../contexts/useTranslation"
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import styles from "./nav.module.css"
import { useTheme } from "../../contexts/useTheme"

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
  const { t } = useTranslation()
  const darkMode = useTheme()
  const navRef = useRef<HTMLDivElement>(null)

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
      <nav ref={navRef} id="site-navigation" className={`${styles.nav}`}>
        <ul>
          {location !== "/" && (
            <li>
              <NavLink to="/">
                <span>{t("home")}</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/about" id="link-about">
              <span>{t("about")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact">
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
