import { FC } from 'react'
import Login from '../components/Login/Login'

interface Props {
  heading: string
}

const LoginPage: FC<Props> = ({ heading }) => {
  return (
    <div className='login-page'>
      <section className='medium'>
        <h2>{heading}</h2>
        <Login />
      </section>
    </div>
  )
}

export default LoginPage
