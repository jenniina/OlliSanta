import { FC, ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ELang } from "../interfaces"
import { TranslationKey, TranslationLang, translations } from "./translations"
import { TranslationValueContext } from "./TranslationValueContext"
import {
  getLanguageFromPathname,
  localizePathname,
} from "../utils/localizedRoutes"

// type Translations = {
//   [key: string]: {
//     [key: string]: string
//   }
// }

// Provider only; hook moved to separate file for Fast Refresh compliance

export const TranslationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  // URL is the source of truth (SSR-safe + crawlable)
  const language = getLanguageFromPathname(location.pathname)

  const setLanguage = (nextLanguage: ELang) => {
    const nextPath = localizePathname(location.pathname, nextLanguage)
    navigate(`${nextPath}${location.search}${location.hash}`)
  }

  const t = (key: TranslationKey) => {
    return translations[key][language as TranslationLang] || key
  }

  return (
    <TranslationValueContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationValueContext.Provider>
  )
}
// Hook moved to ./useTranslation
