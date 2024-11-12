import { ChangeEvent, Dispatch, SetStateAction } from 'react'

type FormProps = {
  value: string | number | undefined
  name: string
  label: string
  type: string
  required?: boolean
  onChange:
    | Dispatch<SetStateAction<string>>
    | Dispatch<SetStateAction<number>>
    | Dispatch<SetStateAction<string[]>>
    | Dispatch<SetStateAction<number[]>>
}

export default function Input({
  value,
  label,
  name,
  type,
  required,
  onChange,
}: FormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = type === 'number' ? parseInt(e.target.value) : e.target.value
    if (typeof target === 'string' || typeof target === 'number') {
      onChange(target as string & number)
    }
  }

  return (
    <div
      className={`input-wrap ${!required ? 'not-required' : ''} ${
        !required && typeof value === 'string' && value?.trim() !== ''
          ? 'filled'
          : 'not-filled'
      }`}
    >
      <label>
        <input
          required={required}
          type={type}
          name={name}
          autoComplete={name}
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
