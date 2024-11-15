import { FC, useEffect, useRef, useState, CSSProperties } from 'react'
import ollisanta from '../../assets/ollisanta.svg'
import ollisantaGif from '../../assets/olli-santa-nimi.gif'
import useShadow from '../../hooks/useShadow'
import useWindowSize from '../../hooks/useWindowSize'
import { useTheme } from '../../contexts/ThemeContext'
import { useTranslation } from '../../contexts/TranslationContext'
import { firstToLowerCase } from '../../utils'

interface Props {
  location: string
}

const Header: FC<Props> = ({ location }) => {
  const { t } = useTranslation()
  const darkMode = useTheme()
  const heading =
    location === '/contact'
      ? t('contact')
      : location === '/about'
      ? t('about')
      : t('homePage')
  const { windowWidth } = useWindowSize()
  const [clickCounter, setClickCounter] = useState(0)
  const [hasClickedTwice, setClickedTwice] = useState(false)
  const [noShadow, setShadow] = useState(false)
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
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
    location !== '/'
      ? '130px'
      : windowWidth < 200
      ? '150px'
      : windowWidth < 300
      ? '200px'
      : windowWidth < 400
      ? '300px'
      : windowWidth < 500
      ? '350px'
      : windowWidth < 700
      ? '390px'
      : windowWidth < 1000
      ? '400px'
      : '420px'

  const widthPlus = parseInt(width) + 7 + 'px'

  useEffect(() => {
    const img1 = spanRef.current?.querySelector('img')
    const img2 = elementRef.current?.querySelector('img')

    setTimeout(() => {
      if (!darkMode) {
        img1?.setAttribute('style', 'filter: invert(0.4); opacity: 0.7')
        img2?.setAttribute('style', 'filter: invert(0.2)')
      } else {
        img1?.setAttribute('style', 'filter: none; opacity: 1')
        img2?.setAttribute('style', 'filter: invert(0.9)')
      }
    }, 300)
  }, [darkMode])

  return (
    <>
      <span ref={spanRef} aria-hidden='true' className='shadow' style={shadowStyle}>
        <img
          aria-hidden='true'
          src={ollisanta}
          alt='Olli Santa'
          width={width}
          height='auto'
        />
      </span>
      <h1 ref={elementRef} className='tooltip-wrap' style={{ width: width }}>
        {location === '/' && !noShadow ? (
          <img
            id='gif'
            className='gif'
            src={ollisantaGif}
            alt='Olli Santa name animation'
            width={widthPlus}
            height='auto'
            onClick={() => {
              clickCounter < 2 ? setClickCounter(clickCounter + 1) : null
              setShadow(!noShadow)
            }}
          />
        ) : (
          <img
            id='img'
            className='h1-img'
            src={ollisanta}
            alt='Olli Santa name'
            width={width}
            height='auto'
            onClick={() => {
              clickCounter < 2 ? setClickCounter(clickCounter + 1) : null
              setShadow(!noShadow)
            }}
          />
        )}
        {!hasClickedTwice && (
          <span className='tooltip below narrow'>{t('clickMeShadow')}</span>
        )}
        {heading && (
          <span id='hidden-heading' className='scr'>
            {heading}
          </span>
        )}
      </h1>
      {location === '/' && (
        <p style={{ paddingTop: '0.3rem' }}>
          &mdash;&nbsp;{firstToLowerCase(t('compositions'))} &{' '}
          {firstToLowerCase(t('arrangements'))}&nbsp;&mdash;
        </p>
      )}
    </>
  )
}

export default Header
