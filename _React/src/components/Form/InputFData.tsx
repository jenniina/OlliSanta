import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { FData } from '../../interfaces'
import { PiUploadSimple } from 'react-icons/pi'
import { useTranslation } from '../../contexts/TranslationContext'
import { useNotification } from '../../contexts/NotificationContext'

type FormProps = {
  value: string | number | undefined
  name: string
  label: string
  type: string
  required?: boolean
  multiple?: boolean
  onChange: Dispatch<SetStateAction<FData>>
  updateAttachments?: Dispatch<SetStateAction<FData['attachments']>>
}

const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

export const maxFileSize = 5 * 1024 * 1024 // 5 MB

export default function InputFData({
  value,
  label,
  name,
  type,
  required,
  multiple,
  onChange,
  updateAttachments,
}: FormProps) {
  const { t } = useTranslation()
  const { notify } = useNotification()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const validFiles = filesArray.filter((file) => {
        if (file.size > maxFileSize) {
          notify(
            t('fileSizeExceeded') + ': ' + maxFileSize / (1024 * 1024) + 'MB',
            true,
            8
          )
          return false
        } else if (!allowedFileTypes.includes(file.type)) {
          notify(t('allowedFileTypes'), true, 8)
          return false
        }

        return true
      })

      if (validFiles.length !== filesArray.length) {
        notify(t('allowedFileTypes'), true, 8)
        return
      }

      const totalFiles =
        (updateAttachments ? updateAttachments.length : 0) + validFiles.length
      if (totalFiles > 10) {
        notify(t('maxFiles10'), true, 6)
        return
      }

      updateAttachments &&
        updateAttachments((prev) => {
          return [
            ...(prev || []),
            ...validFiles?.map((file) => ({
              file: file,
              filename: file.name,
              path: URL.createObjectURL(file),
            })),
          ]
        })
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (type === 'file') {
      handleFileChange(e)
    } else {
      onChange((prev) => ({ ...prev, [name]: e.target.value }))
    }
  }

  return (
    <div
      className={`${type === 'file' ? 'file-wrap' : 'input-wrap'} ${
        !required ? 'not-required' : ''
      } ${
        !required && typeof value === 'string' && value?.trim() !== ''
          ? 'filled'
          : 'not-filled'
      }`}
    >
      <label>
        <input
          required={required}
          multiple={multiple}
          type={type}
          name={name}
          autoComplete={name}
          accept={type === 'file' ? allowedFileTypes.join(',') : undefined}
          value={type !== 'file' ? value : undefined}
          onChange={handleChange}
        />
        <span>
          {type === 'file' && <PiUploadSimple />} {label}{' '}
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
