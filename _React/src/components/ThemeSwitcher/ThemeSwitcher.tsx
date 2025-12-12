import { FC } from "react"
import { MdLightMode } from "react-icons/md"
import { BsFillMoonStarsFill } from "react-icons/bs"
import styles from "./themeswitcher.module.css"
import { useTheme, useThemeUpdate } from "../../contexts/useTheme"
import { useTranslation } from "../../contexts/useTranslation"
import useWindowSize from "../../hooks/useWindowSize"

const ThemeSwitcher: FC = () => {
  const darkMode = useTheme()
  const toggleDark = useThemeUpdate()
  const { t } = useTranslation()
  const { windowWidth } = useWindowSize()

  return (
    <button
      aria-label={t("toggleTheme")}
      className={`link dflex tooltip-wrap ${styles["theme-btn"]} ${
        darkMode ? styles["dark"] : ""
      }`}
      onClick={toggleDark}
    >
      {/* {darkMode ? <MdLightMode /> : <BsFillMoonStarsFill viewBox='0 0 17 17' />} */}
      <span className={styles["theme-svg-wrap"]}>
        <BsFillMoonStarsFill viewBox="0 0 17 17" />
        <MdLightMode />
      </span>
      <span
        className={`tooltip below ${windowWidth > 350 ? "left" : ""} narrow`}
      >
        {t("toggleTheme")}
      </span>
    </button>
  )
}

export default ThemeSwitcher
