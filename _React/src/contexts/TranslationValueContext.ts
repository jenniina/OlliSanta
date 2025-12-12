import { createContext } from "react"
import type { ELang } from "../interfaces"
import type { TranslationKey } from "./translations"

export type TranslationContextType = {
  language: ELang
  setLanguage: (language: ELang) => void
  t: (key: TranslationKey) => string
}

export const TranslationValueContext = createContext<
  TranslationContextType | undefined
>(undefined)
