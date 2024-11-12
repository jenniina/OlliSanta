import Register from '../components/Register/Register'
import { FC } from 'react'

interface Props {
  heading: string
}

const RegisterPage: FC<Props> = ({ heading }) => {
  return (
    <div className='register-page'>
      <section className='medium'>
        <h2>{heading}</h2>
        <Register />
      </section>
    </div>
  )
}

export default RegisterPage
