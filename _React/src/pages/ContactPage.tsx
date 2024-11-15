import { FC, FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiMailSendLine } from 'react-icons/ri'
import { GrStatusWarning } from 'react-icons/gr'
import '../components/Form/form.css'
import service from '../services'
import styles from './css/contact.module.css'
import { useTranslation } from '../contexts/TranslationContext'
import { useNotification } from '../contexts/NotificationContext'
import useLocalStorage from '../hooks/useStorage'
import FormWrapper from '../components/Form/FormWrapper'
import { Select, SelectOption } from '../components/Select/Select'
import InputFData, { maxFileSize } from '../components/Form/InputFData'
import Textarea from '../components/Form/Textarea'
import { FData } from '../interfaces'
import { getRandomLetters, getRandomMinMax } from '../utils'

interface Props {
  heading: string
}

const makeOrderID = () => {
  return `${Math.ceil(getRandomMinMax(100000, 999999))}-${getRandomLetters(2, true)}`
}

const ContactPage: FC<Props> = ({ heading }) => {
  const { t, language } = useTranslation()
  const { notify } = useNotification()
  const navigate = useNavigate()
  const subjectOptions: SelectOption[] = [
    { value: 'arrangement', label: t('arrangement') },
    { value: 'composition', label: t('composition') },
    { value: 'parts', label: t('partRecordings') },
    { value: 'notation', label: t('notation') },
    { value: 'other', label: t('other') },
  ]

  const [subject, setSubject] = useLocalStorage<SelectOption>(
    'OlliSanta_subject',
    subjectOptions[0]
  )
  const [data, setData] = useLocalStorage<FData>('OlliSanta_formData', {
    orderID: makeOrderID(),
    lang: language ?? 'fi',
    firstName: '',
    lastName: '',
    email: '',
    subject: subject.label,
    message: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    attachments: [],
    piece: '',
    ensemble: '',
    schedule: '',
  })

  const [attachments, setAttachments] = useState<FData['attachments']>([])

  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    setSubject(subjectOptions.find((o) => o.value === subject.value) ?? subjectOptions[0])
    setData((prevData) => ({
      ...prevData,
      lang: language,
      subject:
        subjectOptions.find((o) => o.value === subject.value)?.label ??
        subjectOptions[0].label,
    }))
  }, [language])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)
    service
      .sendMail(data, attachments)
      .then((response) => {
        notify(response.message, false, 5)
        if (!response.error) {
          setData({
            orderID: makeOrderID(),
            lang: language ?? 'fi',
            firstName: '',
            lastName: '',
            email: '',
            subject: subject.label,
            message: '',
            address: '',
            city: '',
            zip: '',
            country: '',
            attachments: [],
            piece: '',
            ensemble: '',
            schedule: '',
          })
          setAttachments([])
          setIsSending(false)
        } else setIsSending(false)
      })
      .catch((error) => {
        console.error(error)
        setIsSending(false)
        if (error.response?.data?.message) notify(error.response.data.message, true, 10)
        else notify(t('errorSendingMessage') + ': ' + error.message, true, 10)
      })
  }

  // if the address has ?type=arrangement, set the subject to arrangement etc.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const type = urlParams.get('type')
    if (type) {
      const option = subjectOptions.find((o) => o.value === type)
      if (option) {
        navigate('/contact')
        setSubject(option)
        setData((prevData) => ({ ...prevData, subject: option.label }))
      }
    }
  }, [])

  return (
    <section className='medium'>
      <h2>{heading}</h2>
      <FormWrapper
        className=''
        title={`${t('subject')}: ${subject.label}`}
        description={`${
          subject.value === 'notation'
            ? t('haveAHandwrittenScore')
            : subject.value === 'parts'
            ? t('partsIntro')
            : subject.value === 'composition'
            ? t('compositionIntro')
            : subject.value === 'arrangement'
            ? t('suitableArrangements')
            : ''
        }`}
      >
        <form onSubmit={handleSubmit}>
          <div className='input-container'>
            <Select
              options={subjectOptions}
              value={subject}
              onChange={(v) => {
                setSubject(v as SelectOption)
                setData((prevData) => {
                  if (!v) return prevData
                  return {
                    ...prevData,
                    subject: v.label as string,
                    ensemble:
                      v.value === 'composition' || v.value === 'arrangement'
                        ? prevData.ensemble
                        : '',
                    piece:
                      v.value === 'arrangement' ||
                      v.value === 'parts' ||
                      v.value === 'notation'
                        ? prevData.piece
                        : '',
                  }
                })
              }}
              className='subject'
              id='subject'
              instructions={t('changeSubjectHere')}
              z={10}
            />
            {(subject.value === 'arrangement' ||
              subject.value === 'parts' ||
              subject.value === 'notation') && (
              <InputFData
                value={data?.piece}
                type='text'
                name='piece'
                label={t('pieceName')}
                onChange={setData}
                required
              />
            )}
            {(subject.value === 'composition' || subject.value === 'arrangement') && (
              <InputFData
                value={data?.ensemble}
                type='text'
                name='ensemble'
                label={t('ensemble')}
                onChange={setData}
                required
              />
            )}
          </div>

          <Textarea
            value={data?.message}
            name='message'
            label={subject.value !== 'other' ? t('wishes') : t('yourMessage')}
            onChange={setData}
            required
          />
          <div className={`input-container`}>
            {subject.value !== 'other' && (
              <InputFData
                value={data?.schedule}
                type='text'
                name='schedule'
                label={t('scheduleRequest')}
                onChange={setData}
                required
              />
            )}
            <InputFData
              value={data?.firstName}
              type='text'
              name='firstName'
              label={t('firstName')}
              onChange={setData}
              required
            />
            <InputFData
              value={data?.lastName}
              type='text'
              name='lastName'
              label={t('lastName')}
              onChange={setData}
              required
            />
            <InputFData
              value={data?.email}
              type='email'
              name='email'
              label={t('email')}
              onChange={setData}
              required
            />
            {subject.value !== 'other' && (
              <>
                <InputFData
                  value={data?.address}
                  type='text'
                  name='address'
                  label={t('billingAddress')}
                  onChange={setData}
                  required
                />
                <InputFData
                  value={data?.zip}
                  type='text'
                  name='zip'
                  label={t('zip')}
                  onChange={setData}
                  required
                />
                <InputFData
                  value={data?.city}
                  type='text'
                  name='city'
                  label={t('city')}
                  onChange={setData}
                  required
                />
                <InputFData
                  value={data?.country}
                  type='text'
                  name='country'
                  label={t('country')}
                  onChange={setData}
                  required
                />
              </>
            )}
          </div>

          <div>
            <p>
              <big> {t('sendMaterials')} </big>
              <br />
              {t('maxFileSizeIs') + ': ' + maxFileSize / (1024 * 1024) + 'MB'} <br />
              {t('maxFiles10')}
            </p>
            <InputFData
              type='file'
              value={undefined}
              name='attachments'
              label={`${t('allowedFileTypes')}`}
              onChange={setData}
              updateAttachments={setAttachments}
              multiple
            />
          </div>
          <p>{t('files')}:</p>
          {attachments?.length < 1 && <p>{t('noFiles')}</p>}
          <div className={styles['file-preview-wrap']}>
            {attachments?.map((file, i) => (
              <div key={i} className={styles['file-preview']}>
                <a href={file.path} target='_blank' rel='noreferrer'>
                  {file.filename}
                </a>
                &nbsp;
                <button
                  className='small'
                  type='button'
                  onClick={() => {
                    if (window.confirm(t('confirmRemoveFile'))) {
                      setAttachments((prev) => prev.filter((_, index) => index !== i))
                    }
                  }}
                >
                  {t('remove')}
                </button>
              </div>
            ))}
          </div>
          <div className={styles['submit-wrap']}>
            <button disabled={isSending} className={`big ${styles.submit}`} type='submit'>
              <span>{t('submit')}</span>
              <RiMailSendLine />
            </button>
          </div>
        </form>
      </FormWrapper>
      <div className='empty-fields-wrap'>
        <button
          className='empty-fields-btn small m3top danger center'
          onClick={() => {
            if (window.confirm(t('emptyFieldsConfirmation'))) {
              setAttachments([])
              setData({
                orderID: makeOrderID(),
                lang: language ?? 'fi',
                firstName: '',
                lastName: '',
                email: '',
                subject: subject.label,
                message: '',
                address: '',
                city: '',
                zip: '',
                country: '',
                attachments: [],
                piece: '',
                ensemble: '',
                schedule: '',
              })
            }
          }}
        >
          <GrStatusWarning />
          <span>{t('emptyFields')}</span>
          <GrStatusWarning />
        </button>
      </div>
    </section>
  )
}

export default ContactPage
