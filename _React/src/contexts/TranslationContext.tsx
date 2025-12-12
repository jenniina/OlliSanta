import { FC, ReactNode } from "react"
import useLocalStorage from "../hooks/useStorage"
import { ELang } from "../interfaces"
import { TranslationKey, TranslationLang, translations } from "./translations"
import { TranslationValueContext } from "./TranslationValueContext"

// type Translations = {
//   [key: string]: {
//     [key: string]: string
//   }
// }

// Provider only; hook moved to separate file for Fast Refresh compliance

export const TranslationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useLocalStorage<ELang>(
    "OlliSantaLanguage",
    ELang.fi
  )

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
