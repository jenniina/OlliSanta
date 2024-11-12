import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { TranslationProvider } from './contexts/TranslationContext'
import { BrowserRouter as Router } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TranslationProvider>
      <Router>
        <ThemeProvider key={null} type={''} props={undefined}>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ThemeProvider>
      </Router>
    </TranslationProvider>
  </StrictMode>
)
