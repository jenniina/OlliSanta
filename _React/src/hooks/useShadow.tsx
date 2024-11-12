import { useState, useEffect, RefObject, CSSProperties } from 'react'

const useShadow = (elementRef: RefObject<HTMLElement>, prefersReducedMotion: boolean) => {
  const [shadowStyle, setShadowStyle] = useState<CSSProperties>({})

  useEffect(() => {
    setShadowStyle({
      opacity: 0,
    }) // initial state
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setShadowStyle({
        opacity: 0,
      })
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event

      const element = elementRef.current
      if (element) {
        const rect = element.getBoundingClientRect()
        const elementCenterX = rect.left + rect.width / 2
        const elementCenterY = rect.top + rect.height / 2

        const shadowX = 2 * elementCenterX - clientX
        const shadowY = 2 * elementCenterY - clientY

        const distance = Math.sqrt(
          Math.pow(elementCenterX - clientX, 2) + Math.pow(elementCenterY - clientY, 2)
        )

        const blur = Math.min(distance / 50, 10)
        const opacity = Math.max(0.6 - distance / 500, 0)
        const scale = 1 + distance / 600

        if (opacity > 0)
          setShadowStyle({
            left: `${shadowX}px`,
            top: `${shadowY}px`,
            filter: `blur(${blur}px)`,
            opacity: opacity,
            position: 'absolute',
            WebkitTransform: `translate(-50%, -50%) scale(${scale})`,
            OTransform: `translate(-50%, -50%) scale(${scale})`,
            MozTransform: `translate(-50%, -50%) scale(${scale})`,
            msTransform: `translate(-50%, -50%) scale(${scale})`,
            transform: `translate(-50%, -50%) scale(${scale})`,
            whiteSpace: 'nowrap',
          })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [elementRef, prefersReducedMotion])

  return shadowStyle
}

export default useShadow
