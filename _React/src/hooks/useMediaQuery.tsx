import { useState, useEffect } from 'react'

export default function useMediaQuery(mediaQuery: string) {
  const [isMatch, setIsMatch] = useState(false)
  useEffect(() => {
    const list = window.matchMedia(mediaQuery)
    setIsMatch(list.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsMatch(e.matches)
    list.addEventListener('change', handleChange)

    return () => {
      list.removeEventListener('change', handleChange)
    }
  }, [mediaQuery])

  return isMatch
}
