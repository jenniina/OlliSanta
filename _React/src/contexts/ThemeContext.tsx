import { useContext, createContext, useEffect, ReactPortal, EffectCallback } from 'react'
import useMediaQuery from '../hooks/useMediaQuery'
import useLocalStorage from '../hooks/useStorage'

const ThemeContext = createContext(false)
const ThemeUpdateContext = createContext<EffectCallback | undefined>(undefined)

export function useTheme() {
  return useContext(ThemeContext)
}

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext)
}

export function ThemeProvider({ children }: ReactPortal) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  const [darkTheme, setDarkTheme] = useLocalStorage(
    `${isLocalhost ? 'local-' : ''}useDarkMode`,
    prefersDark ? true : false
  )

  const darkEnabled = darkTheme ?? prefersDark

  function toggleTheme() {
    setDarkTheme((prevTheme) => !prevTheme)
  }

  useEffect(() => {
    setTimeout(() => {
      document.body.classList.toggle('dark', darkEnabled)
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
