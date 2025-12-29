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

      const width = outer.offsetWidth - outer.clientWidth
      outer.remove()
      setScrollbarWidth(width)
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  return scrollbarWidth
}
