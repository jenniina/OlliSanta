import { createRef, CSSProperties, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { user } from './utils'
import AboutPage from './pages/AboutPage'
import LandingPage from './pages/LandingPage'
import ContactPage from './pages/ContactPage'
import Header from './components/Header/Header'
import Nav from './components/Nav/Nav'
import Footer from './components/Footer/Footer'
import Notification from './components/Notification/Notification'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { useScrollbarWidth } from './hooks/useScrollbarWidth'
import { useTheme } from './contexts/ThemeContext'
import { useTranslation } from './contexts/TranslationContext'
import { ELang } from './interfaces'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
// import RegisterPage from './pages/RegisterPage'
import Message from './components/Message/Message'
import ChangePage from './pages/ChangePage'

function App() {
  const darkMode = useTheme()
  const location = useLocation()
  const { t, language, setLanguage } = useTranslation()

  useEffect(() => {
    // set language from ?lang= query
    const url = new URL(window.location.href)
    const lang = url.searchParams.get('lang') as ELang
    if (lang) {
      setLanguage(lang)
    }
  }, [])

  const scrollbarWidth = useScrollbarWidth()
  const styleWrapper: CSSProperties = {
    ['--scrollbar-width' as string]: `${scrollbarWidth}px`,
  }
  const appRef = createRef<HTMLDivElement>()

  const [displayLocation, setDisplayLocation] = useState<typeof location | undefined>(
    location
  )
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
  }, [scrollbarWidth])

  useEffect(() => {
    appRef.current?.classList.remove('tra')
    setTimeout(() => {
      appRef.current?.classList.add('tra')
    }, 500)
  }, [location, darkMode])

  useEffect(() => {
    appRef.current?.classList.add('fadeOut')
    setTimeout(() => {
      appRef.current?.classList.remove('fadeOut')
      appRef.current?.classList.add('fadeIn')
      darkMode
        ? appRef.current?.classList.add('dark')
        : appRef.current?.classList.remove('dark')
    }, 300)
  }, [darkMode])

  useEffect(() => {
    const hash = location.hash
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        ;(element as HTMLElement).focus()
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
    if (displayLocation && location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut')
    }
  }, [location, displayLocation])

  // Set the document language and title
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = `document.documentElement.lang = '${language}';`
    document.head.appendChild(script)
    const headingElement = document.querySelector('#hidden-heading')
    const headingText = headingElement ? headingElement.textContent : ''
    document.title = `${t('composerAndArranger')} Olli Santa: ${headingText}`

    return () => {
      document.head.removeChild(script)
    }
  }, [language])

  // Set the language from ?lang=fi or ?lang=en
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const lang = urlParams.get('lang') as ELang
    if (lang) {
      setLanguage(lang)
    }
  }, [])

  return (
    <div
      ref={appRef}
      className={`app tra ${
        displayLocation?.pathname === '/' ? 'home' : ''
      } ${transitionStage} ${language}`}
      style={styleWrapper}
      onAnimationEnd={() => {
        if (transitionStage === 'fadeOut') {
          setTransitionStage('fadeIn')
          setDisplayLocation(location)
        }
      }}
    >
      <div className='inner'>
        <header>
          <Header location={displayLocation?.pathname ?? '/'} />
          <Nav location={displayLocation?.pathname ?? '/'} />
        </header>
        <main id='main-content'>
          <Routes location={displayLocation}>
            <Route
              path='/login'
              element={<LoginPage heading={user ? t('logout') : t('login')} />}
            />
            {/* <Route
              path='/register'
              element={<RegisterPage heading={t('register')} />}
            /> */}
            <Route
              path='/dashboard'
              element={<ProtectedRoute component={DashboardPage} requiredRole={2} />}
            />{' '}
            <Route path='/message' element={<Message />} />
            <Route path='/' element={<LandingPage />} />
            <Route path='/about' element={<AboutPage heading={t('about')} />} />
            <Route path='/contact' element={<ContactPage heading={t('contact')} />} />
            <Route
              path='/change'
              element={
                <ProtectedRoute component={ChangePage} heading={t('changeInfo')} />
              }
            />
            <Route path='*' element={<h2 className='center'>404</h2>} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Notification />
    </div>
  )
}

export default App
