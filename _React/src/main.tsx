import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import { ThemeProvider } from "./contexts/ThemeContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import { TranslationProvider } from "./contexts/TranslationContext"
import { BrowserRouter as Router } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <TranslationProvider>
        <Router>
          <ThemeProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </ThemeProvider>
        </Router>
      </TranslationProvider>
    </HelmetProvider>
  </StrictMode>
)
