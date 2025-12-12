import { useContext } from "react"
import {
  TranslationValueContext,
  type TranslationContextType,
} from "./TranslationValueContext"

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationValueContext)
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
