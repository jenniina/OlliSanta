import { useEffect, type ReactNode } from "react"
import useMediaQuery from "../hooks/useMediaQuery"
import useLocalStorage from "../hooks/useStorage"
import { ThemeContext, ThemeUpdateContext } from "./useThemeContexts"

// Custom hooks moved to a separate module to satisfy Fast Refresh only-export-components rule

export function ThemeProvider({ children }: { children: ReactNode }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")

  const [darkTheme, setDarkTheme] = useLocalStorage(
    `${isLocalhost ? "local-" : ""}useDarkMode`,
    prefersDark ? true : false
  )

  const darkEnabled = darkTheme ?? prefersDark

  function toggleTheme() {
    setDarkTheme((prevTheme) => !prevTheme)
  }

  useEffect(() => {
    setTimeout(() => {
      document.body.classList.toggle("dark", darkEnabled)
    }, 300)
  }, [darkEnabled])

  return (
    <ThemeContext.Provider value={darkTheme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  )
}
