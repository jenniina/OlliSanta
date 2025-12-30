import { useEffect, useState } from "react"

export const useScrollbarWidth = () => {
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useEffect(() => {
    if (typeof document === "undefined") return

    const measure = () => {
      // A sized, off-screen element is required; otherwise offsetWidth/clientWidth can be 0.
      const outer = document.createElement("div")
      outer.style.visibility = "hidden"
      outer.style.position = "absolute"
      outer.style.top = "-9999px"
      outer.style.width = "100px"
      outer.style.height = "100px"
      outer.style.overflow = "scroll" // force scrollbar
      outer.style.setProperty("msOverflowStyle", "scrollbar") // legacy WinJS
      document.body.appendChild(outer)

      const elementWidth = outer.offsetWidth - outer.clientWidth
      outer.remove()

      // Firefox (and some OS/browser combos) can use overlay/auto-hiding scrollbars,
      // making the element-based measurement 0. When a page scrollbar is present,
      // this viewport-based measurement is often more representative.
      const viewportWidth =
        typeof window === "undefined"
          ? 0
          : window.innerWidth - document.documentElement.clientWidth

      setScrollbarWidth(Math.max(0, elementWidth, viewportWidth))
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  return scrollbarWidth
}
