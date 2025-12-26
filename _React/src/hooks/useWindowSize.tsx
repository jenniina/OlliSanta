import { useState, useEffect } from "react"

function getWindowSize() {
  if (typeof window === "undefined") {
    return {
      windowWidth: 0,
      windowHeight: 0,
    }
  }
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window
  return {
    windowWidth,
    windowHeight,
  }
}

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState(() => getWindowSize())

  useEffect(() => {
    if (typeof window === "undefined") return
    function handleResize() {
      setWindowSize(getWindowSize())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}
