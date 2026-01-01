import { useEffect, useState } from "react"
import { getUserFromStorage } from "../utils"

export default function useUser<TUser = unknown>() {
  const [user, setUser] = useState<TUser | null>(null)

  useEffect(() => {
    setUser(getUserFromStorage() as TUser | null)
  }, [])

  return user
}
