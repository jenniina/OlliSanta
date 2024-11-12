import { ChangeEvent, Dispatch, SetStateAction } from 'react'

type FormProps = {
  checked: boolean
  value: string
  name: string
  type: 'checkbox' | 'radio'
  label: string
  required?: boolean
  onChange: Dispatch<SetStateAction<boolean>> | Dispatch<SetStateAction<boolean[]>>
}

export default function Input({
  checked,
  value,
  label,
  name,
  type,
  required,
  onChange,
}: FormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value as string & number)
  }

  return (
    <div
      className={`boolean-wrap ${!required ? 'not-required' : ''} ${
        !required && checked === true ? 'filled' : 'not-filled'
      }`}
    >
      <label>
        <input
          required={required}
          type={type}
          name={name}
          autoComplete={name}
          checked={checked}
          value={value}
          onChange={handleChange}
        />
        <span>
          {label}{' '}
          {required && (
            <i className='required' aria-hidden='true'>
              *
            </i>
          )}
        </span>
      </label>
    </div>
  )
}
