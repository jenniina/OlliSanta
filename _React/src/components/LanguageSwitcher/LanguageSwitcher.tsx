import { FC } from 'react'
import { useTranslation } from '../../contexts/TranslationContext'
import useWindowSize from '../../hooks/useWindowSize'
import { ELang } from '../../interfaces'

const LanguageSwitcher: FC = () => {
  const { language, setLanguage } = useTranslation()
  const { t } = useTranslation()
  const { windowWidth } = useWindowSize()

  return (
    <>
      {language === 'fi' ? (
        <button
          className='link tooltip-wrap'
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setLanguage(ELang.en)}
        >
          <span>English</span>
          <span className={`tooltip below ${windowWidth > 350 ? 'left' : ''} narrow`}>
            {t('toggleLanguage')}
          </span>
        </button>
      ) : (
        <button
          className='link tooltip-wrap'
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setLanguage(ELang.fi)}
        >
          <span>Suomi</span>
          <span className='tooltip below narrow'>{t('toggleLanguage')}</span>
        </button>
      )}
    </>
  )
}

export default LanguageSwitcher
