import { createContext } from "react"
import type { EffectCallback } from "react"

// Internal contexts split out so the provider file can export only components
export const ThemeContext = createContext<boolean>(false)
export const ThemeUpdateContext = createContext<EffectCallback | undefined>(
  undefined
)

export const useThemeContext = () => ThemeContext
export const useThemeUpdateContext = () => ThemeUpdateContext
