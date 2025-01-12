import { FC, useEffect, useRef, useState } from 'react'
import { TfiAngleDoubleDown, TfiAngleDoubleRight } from 'react-icons/tfi'
import { firstToLowerCase, scrollIntoView } from '../utils'
import styles from './css/about.module.css'
import olli from '../assets/Olli-kuva-original.jpg'
import olli2 from '../assets/olli_santa.jpg'
import { useTranslation } from '../contexts/TranslationContext'
import { sanitize, split } from '../utils'
import { useTheme } from '../contexts/ThemeContext'
import Accordion from '../components/Accordion/Accordion'
import { Link, useLocation } from 'react-router-dom'

interface Props {
  heading: string
}

interface Video {
  id: string
  title: string
  url: string
  url2: string
  description: string
}

const AboutPage: FC<Props> = ({ heading }) => {
  const darkMode = useTheme()
  const { t } = useTranslation()
  const location = useLocation()
  const divRef = useRef<HTMLDivElement>(null)

  const videos: Partial<Video>[] = [
    {
      title: `Taas kaikki kauniit muistot`,
      url: 'https://www.youtube.com/embed/Y4XaeaOnwd8',
      url2: 'https://youtu.be/Y4XaeaOnwd8',
      description: `Jyväskylän Salonkiorkesteri ${t(
        'and'
      )} Jyväskylän Puhallinorkesteri, ${t('kuokkalaChurch')} 20.12.2021 \n${t(
        'lyr'
      )} Viljo Kojo \n${t('comp')} Olli Santa \n${t('solist')} Olli Santa`,
    },
    {
      title: `${t('greatWesternTitle3')}`,
      url: 'https://www.youtube.com/embed/21abpPW9ZMw',
      url2: 'https://youtu.be/21abpPW9ZMw',
      description: `${t('greatWesternText3')} \n${t('comp')} Olli Santa`,
    },
    {
      title: `${t('greatWesternTitle2')}`,
      url: 'https://www.youtube.com/embed/3a_yBpMX0DM',
      url2: 'https://youtu.be/3a_yBpMX0DM',
      description: `${t('comp')} Olli Santa`,
    },
    {
      title: `${t('greatWesternTitle1')}`,
      url: 'https://www.youtube.com/embed/Jy-hBuXrnoQ',
      url2: 'https://youtu.be/Jy-hBuXrnoQ',
      description: `${t('greatWesternText1')} \n${t('comp')} Olli Santa`,
    },
    {
      title: `Hän kulkevi kuin yli kukkien`,
      url: 'https://www.youtube.com/embed/0EkdsV4qTuw',
      url2: 'https://youtu.be/0EkdsV4qTuw',
      description: `${t('comp')} Olli Santa, ${t('lyr')} Eino Leino`,
    },
  ]

  const videosWithID = videos?.map((video) => ({
    ...video,
    id: sanitize(video.title ?? 'default'),
  })) as Video[]

  useEffect(() => {
    divRef.current?.classList.remove(styles['tra'])
    setTimeout(() => {
      divRef.current?.classList.add(styles['tra'])
    }, 500)
  }, [location, darkMode])

  useEffect(() => {
    setTimeout(() => {
      darkMode
        ? divRef.current?.classList.add(styles['dark'])
        : divRef.current?.classList.remove(styles['dark'])
    }, 300)
  }, [darkMode])

  const [currentImage, setCurrentImage] = useState(darkMode ? olli2 : olli)
  const [currentClass, setCurrentClass] = useState(
    darkMode ? `${styles['olli']} ${styles['olli2']}` : styles['olli']
  )
  const [isHidden, setIsHidden] = useState(false)

  const handleImageClick = () => {
    setIsHidden(true)
    setTimeout(() => {
      setCurrentImage((prevImage) => {
        if (prevImage === olli) {
          setCurrentClass(`${styles['olli']} ${styles['olli2']}`)
          return olli2
        } else {
          setCurrentClass(styles['olli'])
          return olli
        }
      })
      setIsHidden(false)
    }, 300) // Match the transition duration!
  }

  useEffect(() => {
    setIsHidden(true)
    if (darkMode) {
      setTimeout(() => {
        setCurrentImage(olli2)
        setCurrentClass(`${styles['olli']} ${styles['olli2']}`)
      }, 300)
    } else {
      setTimeout(() => {
        setCurrentImage(olli)
        setCurrentClass(styles['olli'])
      }, 300)
    }
    setTimeout(() => {
      setIsHidden(false)
    }, 400)
  }, [darkMode])

  return (
    <div ref={divRef} className={`${styles['tra']}`}>
      <section>
        <h2>{heading}</h2>
        <div className={styles['intro-wrap']}>
          <img
            src={currentImage}
            alt='Olli Santa'
            title='Olli Santa'
            className={`${currentClass} ${isHidden ? styles['hidden'] : ''}`}
            onClick={handleImageClick}
          />
          <div className={styles['intro-text']}>
            <p>{t('introText1')}</p>
            <p>{t('introText2')}</p>
            <Accordion title={t('choirs')} classNames={['left']} flex>
              <ul>
                <li>
                  <a href='https://ilmonet.fi/course/E242012'>
                    Seniorikuoro Ruusut ja Ritarit
                  </a>
                </li>
                <li>
                  <a href='https://www.vantaannaislaulajat.net'>Vantaan Naislaulajat</a>
                </li>
                <li>
                  <a href='https://www.oltermannit.net'>Vantaan Laulun Oltermannit</a>
                </li>
                <li>
                  <a href='https://rekolansekakuoro.com'>Rekolan Sekakuoro</a>
                </li>
              </ul>
            </Accordion>
          </div>
        </div>
      </section>
      <section>
        <h3 className={styles['heading3']}>{t('services')}</h3>
        <div className={`btn-wrap btn-4`}>
          <button
            onClick={() => {
              scrollIntoView('arrangements')
              ;(document.activeElement as HTMLButtonElement)?.blur()
            }}
          >
            {t('arrangements')} <TfiAngleDoubleDown style={{ fontSize: '0.8em' }} />
          </button>
          <button
            onClick={() => {
              scrollIntoView('compositions')
              ;(document.activeElement as HTMLButtonElement)?.blur()
            }}
          >
            {t('compositions')} <TfiAngleDoubleDown style={{ fontSize: '0.8em' }} />
          </button>
          <button
            onClick={() => {
              scrollIntoView('parts')
              ;(document.activeElement as HTMLButtonElement)?.blur()
            }}
          >
            {t('partRecordings')} <TfiAngleDoubleDown style={{ fontSize: '0.8em' }} />
          </button>
          <button
            onClick={() => {
              scrollIntoView('notation')
              ;(document.activeElement as HTMLButtonElement)?.blur()
            }}
          >
            {t('notation')} <TfiAngleDoubleDown style={{ fontSize: '0.8em' }} />
          </button>
        </div>
        <div className='middle-wrap m3top flex center column'>
          <big>{t('howToOrderProduct')}</big>
          <span>{t('contactThroughForm')}: </span>
          <Link to='/contact'>
            <span>{t('contactMe')}</span>
          </Link>
        </div>
        <div className='middle-wrap'>
          <div className='middle-size'>
            <h4 id='arrangements'>{t('arrangements')}</h4>

            <p className='tleft'>{t('suitableArrangements')}</p>
            <p id='howto1' className='tleft margin0 w100'>
              {t('howToOrder')}:
            </p>
            <ol aria-labelledby='howto1' className='fgrow'>
              <li>{t('whichPiece')}</li>
              <li>{t('whatEnsemble')}</li>
              <li>{t('scheduleRequestLong')}</li>
              <li>{t('addContactInfo')}</li>
              <li>
                {t('sendSheetMusicInstructions')} {t('allowedFileTypes')}
              </li>
              <li>
                {t('youWillReceiveAnOffer')} {t('eachOrderIndividual')}
              </li>
            </ol>
            <Link to='/contact?type=arrangement'>
              <span>
                {t('order')} {firstToLowerCase(t('arrangement'))}{' '}
                <TfiAngleDoubleRight
                  style={{
                    fontSize: '0.8em',
                    WebkitTransform: 'translateY(0.2em)',
                    OTransform: 'translateY(0.2em)',
                    MozTransform: 'translateY(0.2em)',
                    msTransform: 'translateY(0.2em)',
                    transform: 'translateY(0.2em)',
                  }}
                />
              </span>
            </Link>
          </div>
          <div className='middle-size'>
            <h4 id='compositions'>{t('compositions')}</h4>
            <p className='tleft'>{t('compositionIntro')}</p>
            <p id='howto2' className='tleft margin0 w100'>
              {t('howToOrder')}:
            </p>
            <ol aria-labelledby='howto2' className='fgrow'>
              <li>{t('compositionInstructions')}</li>
              <li>{t('whatEnsemble')}</li>
              <li>{t('scheduleRequestLong')}</li>
              <li>{t('addContactInfo')}</li>
              <li>
                {t('youWillReceiveAnOffer')} {t('eachOrderIndividual')}
              </li>
            </ol>
            <Link to='/contact?type=composition'>
              <span>
                {t('order')} {firstToLowerCase(t('composition'))}{' '}
                <TfiAngleDoubleRight
                  style={{
                    fontSize: '0.8em',
                    WebkitTransform: 'translateY(0.2em)',
                    OTransform: 'translateY(0.2em)',
                    MozTransform: 'translateY(0.2em)',
                    msTransform: 'translateY(0.2em)',
                    transform: 'translateY(0.2em)',
                  }}
                />
              </span>
            </Link>
          </div>
          <div className='middle-size'>
            <h4 id='parts'>{t('partRecordings')}</h4>
            <p className='tleft'>{t('partsIntro')}</p>
            <p id='parts-info' className='tleft margin0 w100'>
              {t('partsInstructions0')}
            </p>
            <ul aria-labelledby='parts-info'>
              <li>{t('partsInstructions1')}</li>
              <li>{t('partsInstructions2')}</li>
              <li>{t('partsInstructions3')}</li>
            </ul>
            <p id='howto3' className='tleft margin0 w100'>
              {t('howToOrder')}:
            </p>
            <ol aria-labelledby='howto3' className='fgrow'>
              <li>{t('whichPiece')}</li>
              <li>{t('scheduleRequestLong')}</li>
              <li>{t('addContactInfo')}</li>
              <li>{t('sendMaterials')}</li>
              <li>
                {t('youWillReceiveAnOffer')} {t('eachOrderIndividual')}
              </li>
            </ol>
            <Link to='/contact?type=parts'>
              <span>
                {t('order')} {t('partRecordings').toLowerCase()}{' '}
                <TfiAngleDoubleRight
                  style={{
                    fontSize: '0.8em',
                    WebkitTransform: 'translateY(0.2em)',
                    OTransform: 'translateY(0.2em)',
                    MozTransform: 'translateY(0.2em)',
                    msTransform: 'translateY(0.2em)',
                    transform: 'translateY(0.2em)',
                  }}
                />
              </span>
            </Link>
          </div>
          <div className='middle-size no-stretch'>
            <h4 id='notation'>{t('notation')}</h4>
            <p>{t('haveAHandwrittenScore')}</p>
            <p id='howto3' className='tleft margin0 w100'>
              {t('howToOrder')}:
            </p>
            <ol aria-labelledby='howto3' className='fgrow'>
              <li>{t('addContactInfo')}</li>
              <li>{t('sendByMailOrAttachment')}</li>
              <li>{t('receiveBack')}</li>
            </ol>
            <Link to='/contact?type=notation'>
              <span>
                {t('order')} {t('notation').toLowerCase()}{' '}
                <TfiAngleDoubleRight
                  style={{
                    fontSize: '0.8em',
                    WebkitTransform: 'translateY(0.2em)',
                    OTransform: 'translateY(0.2em)',
                    MozTransform: 'translateY(0.2em)',
                    msTransform: 'translateY(0.2em)',
                    transform: 'translateY(0.2em)',
                  }}
                />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section>
        <h3 className={styles['heading3']}>{t('videos')}</h3>
        <div className={styles['video-wrap']}>
          {videosWithID?.map((video) => (
            <div key={video.id} id={video.id} className={styles['video']}>
              <h4>{video.title}</h4>
              <iframe
                width='100%'
                height='250'
                src={video.url}
                title={video.title}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                referrerPolicy='strict-origin-when-cross-origin'
                aria-label={`${t('videoTitled')} ${video.title}`}
              ></iframe>
              {video.description.trim() !== '' && (
                <p>
                  {split(video.description)}
                  <br />
                  <a href={video.url2}>{t('linkToVideo')}</a>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
