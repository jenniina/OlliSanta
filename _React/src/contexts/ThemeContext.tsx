import { useEffect, useMemo, useState, type ReactNode } from "react"
import useMediaQuery from "../hooks/useMediaQuery"
import { ThemeContext, ThemeUpdateContext } from "./useThemeContexts"

// Custom hooks moved to a separate module to satisfy Fast Refresh only-export-components rule

export function ThemeProvider({ children }: { children: ReactNode }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")

  const storageKey = useMemo(
    () => `${isLocalhost ? "local-" : ""}useDarkMode`,
    [isLocalhost]
  )

  // Hydration-safe: don't read localStorage during the first render.
  // Start with null (meaning "no override") and load after mount.
  const [darkTheme, setDarkTheme] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw != null) {
        setDarkTheme(JSON.parse(raw) as boolean)
      }
    } catch {
      // ignore
    }
  }, [storageKey])

  const darkEnabled = darkTheme ?? prefersDark

  function toggleTheme() {
    setDarkTheme((prevTheme) => !(prevTheme ?? prefersDark))
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    if (darkTheme === null) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(darkTheme))
    } catch {
      // ignore
    }
  }, [storageKey, darkTheme])

  useEffect(() => {
    setTimeout(() => {
      document.body.classList.toggle("dark", darkEnabled)
    }, 300)
  }, [darkEnabled])

  return (
    <ThemeContext.Provider value={darkEnabled}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  )
}
