import { useContext } from "react"
import { useThemeContext, useThemeUpdateContext } from "./useThemeContexts"

export function useTheme() {
  return useContext(useThemeContext())
}

export function useThemeUpdate() {
  return useContext(useThemeUpdateContext())
}
