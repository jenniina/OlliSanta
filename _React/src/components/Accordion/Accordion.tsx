import { FC, ReactNode, useEffect, useRef, useState } from "react"
import styles from "./accordion.module.css"
import { useTheme } from "../../contexts/useTheme"
import { useLocation } from "react-router-dom"

interface AccordionProps {
  title: string
  children: ReactNode
  classNames: Array<string>
  flex?: boolean
}

const Accordion: FC<AccordionProps> = ({
  title,
  children,
  classNames,
  flex,
}) => {
  const darkMode = useTheme()
  const location = useLocation()
  const detailsRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  // control tab index of children
  useEffect(() => {
    const content = contentRef.current
    if (content) {
      const focusableElements = content.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
      focusableElements.forEach((element) => {
        element.tabIndex = open ? 0 : -1
      })
    }
  }, [open])

  useEffect(() => {
    detailsRef.current?.classList.remove(styles["tra"])
    setTimeout(() => {
      detailsRef.current?.classList.add(styles["tra"])
    }, 500)
  }, [location, darkMode])

  useEffect(() => {
    setTimeout(() => {
      darkMode
        ? detailsRef.current?.classList.add(styles["dark"])
        : detailsRef.current?.classList.remove(styles["dark"])
    }, 300)
  }, [darkMode])

  return (
    <button
      ref={detailsRef}
      tabIndex={0}
      onClick={() => {
        if (open) {
          setClosing(true)
          setTimeout(() => {
            setOpen(false)
            setClosing(false)
          }, 390)
        } else {
          setOpen(true)
        }
      }}
      aria-expanded={open}
      className={`${styles.details} ${classNames.map(
        (c) => styles[`${c}`]
      )} ${classNames.join(" ")} ${flex ? styles.flex : ""} ${
        open ? styles.open : styles.closed
      } ${closing ? styles.closing : ""} ${styles["tra"]}
      `}
    >
      <span className={styles.summary}>
        <span className={styles.triangle} aria-hidden="true" />
        {title}
      </span>
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
    </button>
  )
}

export default Accordion
