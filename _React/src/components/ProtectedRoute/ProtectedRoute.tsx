import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { user } from '../../utils'

interface ProtectedRouteProps {
  component: React.ComponentType<any>
  requiredRole?: number
  [key: string]: any
}

const ProtectedRoute = ({
  component: Component,
  requiredRole = 1,
  ...rest
}: ProtectedRouteProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role < requiredRole) {
      navigate('/')
    }
  }, [user, requiredRole, navigate])

  if (user && user.role >= requiredRole) {
    return <Component {...rest} />
  } else {
    return <></>
  }
}

export default ProtectedRoute
