import { StrictMode } from 'react'
import App from '../App'
import '../index.css'

import { ThemeProvider } from '../contexts/ThemeContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import { TranslationProvider } from '../contexts/TranslationContext'

export default function Page() {
  return (
    <StrictMode>
      <TranslationProvider>
        <ThemeProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ThemeProvider>
      </TranslationProvider>
    </StrictMode>
  )
}
