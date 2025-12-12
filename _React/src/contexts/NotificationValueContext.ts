import { createContext } from "react"
import type { notification } from "../interfaces"

export type NotificationContextType = {
  notification: notification | null
  setNotification: (notification: notification | null) => void
  notify: (message: string, isError: boolean, duration: number) => void
}

export const NotificationValueContext = createContext<
  NotificationContextType | undefined
>(undefined)
