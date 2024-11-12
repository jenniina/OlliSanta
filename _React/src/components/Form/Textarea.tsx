import { SetStateAction, Dispatch } from 'react'
import { FData } from '../../interfaces'

type FormProps = {
  value: string | undefined
  name: string
  label: string
  required?: boolean
  rows?: number
  onChange: Dispatch<SetStateAction<FData>>
}

export default function Textarea({
  value,
  label,
  name,
  rows,
  required,
  onChange,
}: FormProps) {
  return (
    <label className={`textarea-wrap`}>
      <span>
        {label}{' '}
        {required && (
          <i className='required' aria-hidden='true'>
            *
          </i>
        )}
      </span>
      <textarea
        required={required}
        name={name}
        value={value}
        rows={rows ?? 5}
        onChange={(e) => onChange((prev) => ({ ...prev, [name]: e.target.value }))}
      />
    </label>
  )
}
