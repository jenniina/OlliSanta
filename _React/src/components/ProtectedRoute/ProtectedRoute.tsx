import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { user } from "../../utils"
import { AnyProps, ProtectedRouteProps } from "../../interfaces"

const ProtectedRoute = <T extends AnyProps>({
  component: Component,
  requiredRole = 1,
  ...rest
}: ProtectedRouteProps<T> & T) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role < requiredRole) {
      navigate("/")
    }
    // Only depend on navigate and requiredRole; `user` is a mutable external value
    // and doesn't trigger rerenders. Checking it inside the effect is sufficient.
  }, [requiredRole, navigate])

  if (user && user.role >= requiredRole) {
    return <Component {...(rest as unknown as T)} />
  } else {
    return <></>
  }
}

export default ProtectedRoute
