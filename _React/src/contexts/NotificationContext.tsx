import { FC, createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { notification } from '../interfaces'

interface NotificationContextType {
  notification: notification | null
  setNotification: (notification: notification | null) => void
  notify: (message: string, isError: boolean, duration: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<notification | null>(null)

  useEffect(() => {
    if (notification && notification.duration) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, notification.duration * 1000)

      return () => clearTimeout(timer)
    }
  }, [notification])

  const notify = (message: string, isError: boolean, duration: number) => {
    setNotification({ message, isError, duration })
  }

  return (
    <NotificationContext.Provider value={{ notification, setNotification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
