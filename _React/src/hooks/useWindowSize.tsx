import { useState, useEffect } from "react"

export default function useWindowSize() {
  // SSR-safe: first render must match server HTML to avoid hydration mismatch.
  // Start at 0 and update after mount.
  const [windowSize, setWindowSize] = useState(() => ({
    windowWidth: 0,
    windowHeight: 0,
  }))

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setWindowSize({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      })
    }

    // Populate real size right after mount.
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}
