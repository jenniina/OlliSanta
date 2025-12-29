import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { user } from "./utils"
import AboutPage from "./pages/AboutPage"
import LandingPage from "./pages/LandingPage"
import ContactPage from "./pages/ContactPage"
import Header from "./components/Header/Header"
import Nav from "./components/Nav/Nav"
import Footer from "./components/Footer/Footer"
import Notification from "./components/Notification/Notification"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import { useScrollbarWidth } from "./hooks/useScrollbarWidth"
import { useTheme } from "./contexts/useTheme"
import { useTranslation } from "./contexts/useTranslation"
import { ELang } from "./interfaces"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
// import RegisterPage from './pages/RegisterPage'
import Message from "./components/Message/Message"
import ChangePage from "./pages/ChangePage"

function App() {
  const darkMode = useTheme()
  const location = useLocation()
  const { t, language, setLanguage } = useTranslation()

  // set language from ?lang= query (single effect)

  const scrollbarWidth = useScrollbarWidth()
  const styleWrapper: CSSProperties = {
    ["--scrollbar-width" as string]: `${scrollbarWidth}px`,
  }
  const appRef = useRef<HTMLDivElement>(null)

  const [displayLocation, setDisplayLocation] = useState<
    typeof location | undefined
  >(location)
  const [transitionStage, setTransitionStage] = useState("fadeIn")

  const homePaths = useMemo(() => new Set(["/", "/en"]), [])

  useEffect(() => {
    document.body.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`)
  }, [scrollbarWidth])

  useEffect(() => {
    appRef.current?.classList.remove("tra")
    setTimeout(() => {
      appRef.current?.classList.add("tra")
    }, 500)
  }, [location, darkMode])

  useEffect(() => {
    appRef.current?.classList.add("fadeOut")
    setTimeout(() => {
      appRef.current?.classList.remove("fadeOut")
      appRef.current?.classList.add("fadeIn")
      darkMode
        ? appRef.current?.classList.add("dark")
        : appRef.current?.classList.remove("dark")
    }, 300)
  }, [darkMode])

  useEffect(() => {
    const hash = location.hash
    if (hash) {
      const id = decodeURIComponent(hash.startsWith("#") ? hash.slice(1) : hash)
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
        if (element instanceof HTMLElement) {
          element.focus({ preventScroll: true })
        }
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    if (displayLocation && location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut")
    }
  }, [location, displayLocation])

  // Backward-compat: support ?lang=fi|en by navigating to localized URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const lang = urlParams.get("lang") as ELang
    if (lang === ELang.fi || lang === ELang.en) {
      setLanguage(lang)
    }
  }, [setLanguage])

  return (
    <div
      ref={appRef}
      className={`app tra ${language} ${
        displayLocation?.pathname && homePaths.has(displayLocation.pathname)
          ? "home"
          : ""
      } ${transitionStage} ${language}`}
      style={styleWrapper}
      onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setTransitionStage("fadeIn")
          setDisplayLocation(location)
        }
      }}
    >
      <div className={`inner`}>
        <header>
          <Header location={displayLocation?.pathname ?? "/"} />
          <Nav location={displayLocation?.pathname ?? "/"} />
        </header>
        <main id="main-content">
          <Routes location={displayLocation}>
            <Route
              path="/login"
              element={<LoginPage heading={user ? t("logout") : t("login")} />}
            />
            {/* <Route
              path='/register'
              element={<RegisterPage heading={t('register')} />}
            /> */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute component={DashboardPage} requiredRole={2} />
              }
            />{" "}
            <Route path="/message" element={<Message />} />
            {/* Localized public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/en" element={<LandingPage />} />
            <Route
              path="/tietoa"
              element={<AboutPage heading={t("about")} />}
            />
            <Route
              path="/en/about"
              element={<AboutPage heading={t("about")} />}
            />
            <Route
              path="/yhteys/:type"
              element={<ContactPage heading={t("contact")} />}
            />
            <Route
              path="/yhteys"
              element={<ContactPage heading={t("contact")} />}
            />
            <Route
              path="/en/contact/:type"
              element={<ContactPage heading={t("contact")} />}
            />
            <Route
              path="/en/contact"
              element={<ContactPage heading={t("contact")} />}
            />
            {/* Legacy routes (redirect to canonical FI paths) */}
            <Route path="/about" element={<Navigate to="/tietoa" replace />} />
            <Route
              path="/contact"
              element={<Navigate to="/yhteys" replace />}
            />
            <Route
              path="/contact/:type"
              element={<Navigate to="/yhteys" replace />}
            />
            <Route
              path="/change"
              element={
                <ProtectedRoute
                  component={ChangePage}
                  heading={t("changeInfo")}
                />
              }
            />
            <Route path="*" element={<h2 className="center">404</h2>} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Notification />
    </div>
  )
}

export default App
