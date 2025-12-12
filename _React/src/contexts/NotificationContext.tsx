import { FC, useState, ReactNode, useEffect } from "react"
import type { notification } from "../interfaces"
import { NotificationValueContext } from "./NotificationValueContext"

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
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
    <NotificationValueContext.Provider
      value={{ notification, setNotification, notify }}
    >
      {children}
    </NotificationValueContext.Provider>
  )
}

// Hook moved to ./useNotification
