import { useEffect, useState } from 'react'
import { useTranslation } from '../../contexts/TranslationContext'
import { useNotification } from '../../contexts/NotificationContext'

const Notification = () => {
  const { t } = useTranslation()
  const { notification } = useNotification()
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    setClosed(false)
  }, [notification])

  if (notification === null || notification === undefined || closed) {
    return null
  }

  return (
    <div
      className={`notification ${notification.isError ? 'error' : ''}`}
      aria-live='assertive'
      role='alert'
      tabIndex={-1}
    >
      <p>
        {notification.message}{' '}
        <button
          type='button'
          className='close'
          aria-label={t('close')}
          onClick={() => {
            setClosed(true)
          }}
        >
          <span aria-hidden='true' className='times'>
            &times;
          </span>
        </button>
      </p>
    </div>
  )
}

export default Notification
