import {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  ImgHTMLAttributes,
} from "react"
import styles from "./image.module.css"

type Source = { srcSet: string; type?: string; media?: string }
type LegacyMediaQueryList = MediaQueryList & {
  addListener: (
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
  ) => void
  removeListener: (
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
  ) => void
}

export interface ImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "src" | "alt" | "onError" | "role" | "aria-label"
  > {
  src: string
  alt: string
  title?: string
  srcSet?: string
  sizes?: string
  sources?: Source[]
  poster?: string
  loading?: "lazy" | "eager"
  fetchPriority?: "high" | "low" | "auto"
  className?: string
  style?: React.CSSProperties
  styles?: React.CSSProperties // alias - sometimes used
  onClick?: React.MouseEventHandler<HTMLImageElement>
  onError?: React.ReactEventHandler<HTMLImageElement>
  id?: string
  width?: number | string
  height?: number | string
  animated?: boolean
  role?: string
  ariaLabel?: string
}

const Image: FC<ImageProps> = ({
  src,
  alt,
  title,
  srcSet,
  sizes,
  sources,
  poster,
  loading = "lazy",
  fetchPriority,
  className = "",
  style = {},
  styles: styleAlias,
  onClick,
  onError,
  width,
  height,
  animated = false,
  role,
  ariaLabel,
  ...rest
}) => {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
      setReducedMotion(mq.matches)
      const handler = (ev: MediaQueryListEvent) => setReducedMotion(ev.matches)
      if (mq.addEventListener) {
        mq.addEventListener("change", handler)
      } else if ("onchange" in mq) {
        // Fallback using the non-deprecated onchange property
        mq.onchange = handler
      } else {
        // Last resort legacy fallback
        ;(mq as LegacyMediaQueryList).addListener(handler)
      }
      return () => {
        if (mq.removeEventListener) {
          mq.removeEventListener("change", handler)
        } else if ("onchange" in mq) {
          mq.onchange = null
        } else {
          ;(mq as LegacyMediaQueryList).removeListener(handler)
        }
      }
    } catch {
      // If window isn't available (SSR), default to false
      setReducedMotion(false)
    }
  }, [])

  // Decide which src to use. If animated and user prefers reduced motion -> use poster if available
  const effectiveSrc = useMemo(() => {
    if (animated && reducedMotion && poster) return poster
    return src
  }, [src, poster, animated, reducedMotion])

  // Reset visibility when the underlying image URL changes.
  useEffect(() => {
    setLoaded(false)
  }, [effectiveSrc])

  // When SSR is used, the browser may load the image before React attaches the onLoad handler.
  // In that case, the load event won't fire again and the image would remain invisible.
  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    if (img.complete) {
      // naturalWidth === 0 typically indicates a failed load.
      setLoaded(img.naturalWidth > 0)
    }
  }, [effectiveSrc])

  const combinedStyle: React.CSSProperties = {
    width: width ?? undefined,
    height: height ?? undefined,
    ...styleAlias,
    ...style,
  }

  return (
    <picture className={`${styles.image} ${className}`} style={combinedStyle}>
      {/* Render sources first */}
      {sources?.map((s, i) => (
        <source key={i} srcSet={s.srcSet} type={s.type} media={s.media} />
      ))}
      {srcSet && <source srcSet={srcSet} sizes={sizes} />}
      {/* img fallback */}
      <img
        ref={imgRef}
        src={effectiveSrc}
        alt={alt}
        title={title}
        loading={loading}
        onClick={onClick}
        onError={(e) => {
          // Don't keep it permanently hidden if the image fails to load.
          setLoaded(true)
          onError?.(e)
        }}
        width={width}
        height={height}
        role={role ?? "img"}
        aria-label={ariaLabel ?? alt}
        className={loaded ? styles.visible : styles.hidden}
        {...(fetchPriority
          ? ({ fetchpriority: fetchPriority } as Record<string, unknown>)
          : {})}
        onLoad={() => setLoaded(true)}
        {...rest}
      />
    </picture>
  )
}

export default Image
