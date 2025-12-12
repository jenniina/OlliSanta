import { useContext } from "react"
import {
  NotificationValueContext,
  type NotificationContextType,
} from "./NotificationValueContext"

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationValueContext)
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    )
  }
  return context
}
