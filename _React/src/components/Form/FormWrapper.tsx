import { ReactNode } from 'react'

type FormWrapperProps = {
  title: string
  description: string
  className: string
  children: ReactNode
}

export default function FormWrapper({
  title,
  description,
  className,
  children,
}: FormWrapperProps) {
  return (
    <fieldset className={className}>
      <legend>
        {' '}
        {title}
        <p> {description} </p>
      </legend>
      {children}
    </fieldset>
  )
}
