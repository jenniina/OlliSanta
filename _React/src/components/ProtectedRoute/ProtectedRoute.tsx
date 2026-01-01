import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useUser from "../../hooks/useUser"
import { AnyProps, ProtectedRouteProps } from "../../interfaces"

const ProtectedRoute = <T extends AnyProps>({
  component: Component,
  requiredRole = 1,
  ...rest
}: ProtectedRouteProps<T> & T) => {
  const navigate = useNavigate()
  const user = useUser<{ role?: number }>()

  useEffect(() => {
    if (!user || (user.role ?? 0) < requiredRole) {
      navigate("/")
    }
  }, [requiredRole, navigate, user])

  if (user && (user.role ?? 0) >= requiredRole) {
    return <Component {...(rest as unknown as T)} />
  } else {
    return <></>
  }
}

export default ProtectedRoute
