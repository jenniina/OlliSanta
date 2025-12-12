import { FC, useEffect, useRef, useState, CSSProperties } from "react"
import ollisanta from "../../assets/ollisanta.svg"
import ollisantaPng from "../../assets/OlliSanta_x2.png"
import ollisantaGif from "../../assets/olli-santa-nimi.gif"
import ollisantaWebP from "../../assets/olli-santa-nimi.webp"
import Image from "../Image/Image"
import { Helmet } from "react-helmet-async"
import useShadow from "../../hooks/useShadow"
import useWindowSize from "../../hooks/useWindowSize"
import { useTheme } from "../../contexts/useTheme"
import { useTranslation } from "../../contexts/useTranslation"
import { firstToLowerCase } from "../../utils"

interface Props {
  location: string
}

const Header: FC<Props> = ({ location }) => {
  const { t } = useTranslation()
  const darkMode = useTheme()
  const heading =
    location === "/contact"
      ? t("contact")
      : location === "/about"
      ? t("about")
      : t("homePage")
  const { windowWidth } = useWindowSize()
  const [clickCounter, setClickCounter] = useState(0)
  const [hasClickedTwice, setClickedTwice] = useState(false)
  const [noShadow, setShadow] = useState(false)
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches

  useEffect(() => {
    if (clickCounter === 2) {
      setClickedTwice(true)
    }
  }, [clickCounter])

  useEffect(() => {
    if (prefersReducedMotion) {
      setShadow(true)
    }
  }, [prefersReducedMotion])

  const elementRef = useRef<HTMLHeadingElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const shadowStyle: CSSProperties = useShadow(elementRef, noShadow)
  const width =
    location !== "/"
      ? "130px"
      : windowWidth < 200
      ? "150px"
      : windowWidth < 300
      ? "200px"
      : windowWidth < 400
      ? "300px"
      : windowWidth < 500
      ? "350px"
      : windowWidth < 700
      ? "390px"
      : windowWidth < 1000
      ? "400px"
      : "420px"

  const widthPlus = parseInt(width) + 7 + "px"

  useEffect(() => {
    const img1 = spanRef.current?.querySelector("img")
    const img2 = elementRef.current?.querySelector("img")

    setTimeout(() => {
      if (!darkMode) {
        img1?.setAttribute("style", "filter: invert(0.4); opacity: 0.7")
        img2?.setAttribute("style", "filter: invert(0.2)")
      } else {
        img1?.setAttribute("style", "filter: none; opacity: 1")
        img2?.setAttribute("style", "filter: invert(0.9)")
      }
    }, 300)
  }, [darkMode])

  return (
    <>
      {/* Preload images for the homepage for faster LCP */}
      {location === "/" && (
        <Helmet>
          {/* If user prefers reduced motion, prefer the poster over the heavy animated file */}
          {!prefersReducedMotion ? (
            <>
              <link
                rel="preload"
                as="image"
                href={ollisantaWebP}
                type="image/webp"
                fetchPriority="high"
              />
              <link
                rel="preload"
                as="image"
                href={ollisantaGif}
                type="image/gif"
              />
            </>
          ) : (
            <link rel="preload" as="image" href={ollisanta} type="image/jpeg" />
          )}
        </Helmet>
      )}
      <span
        ref={spanRef}
        aria-hidden="true"
        className="shadow"
        style={shadowStyle}
      >
        <picture>
          <source srcSet={ollisanta} type="image/svg+xml" />
          <img
            aria-hidden="true"
            src={ollisantaPng}
            alt="Olli Santa"
            width={width}
            height="auto"
          />
        </picture>
      </span>
      <h1 ref={elementRef} className="tooltip-wrap" style={{ width: width }}>
        {location === "/" && !noShadow ? (
          <Image
            id="gif"
            className={`gif ${noShadow ? "" : ""}`}
            src={ollisantaGif}
            alt="Olli Santa name animation"
            title="Olli Santa"
            poster={ollisantaPng}
            sources={[{ srcSet: ollisantaWebP, type: "image/webp" }]}
            width={widthPlus}
            height="auto"
            animated
            loading="eager"
            onClick={() => {
              clickCounter < 2 ? setClickCounter(clickCounter + 1) : null
              setShadow(!noShadow)
            }}
          />
        ) : (
          <Image
            id="img"
            className="h1-img"
            // Serve svg where supported and fall back to png
            src={ollisantaPng}
            sources={[{ srcSet: ollisanta, type: "image/svg+xml" }]}
            alt="Olli Santa name"
            title="Olli Santa"
            width={width}
            height="auto"
            onClick={() => {
              clickCounter < 2 ? setClickCounter(clickCounter + 1) : null
              setShadow(!noShadow)
            }}
          />
        )}
        {!hasClickedTwice && (
          <span className="tooltip below narrow">{t("clickMeShadow")}</span>
        )}
        {heading && (
          <span id="hidden-heading" className="scr">
            {heading}
          </span>
        )}
      </h1>
      {location === "/" && (
        <p style={{ paddingTop: "0.3rem" }}>
          &mdash;&nbsp;{firstToLowerCase(t("compositions"))} &{" "}
          {firstToLowerCase(t("arrangements"))}&nbsp;&mdash;
        </p>
      )}
    </>
  )
}

export default Header
