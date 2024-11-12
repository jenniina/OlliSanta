import emailService from '../../services'
import { user } from '../../utils'
import { FData } from '../../interfaces'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../contexts/TranslationContext'
import { formatDate } from '../../utils'

const Dashboard = () => {
  const [data, setData] = useState<FData[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await emailService.getData()
        setData(res)
      } catch (error) {
        console.error('Error fetching data', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2>{t('messages')}</h2>
      <ul>
        {data &&
          data?.map((item) => (
            <li key={item.orderID}>
              <Link to={`/message?id=${item.orderID}`}>
                {item.firstName} {item.lastName}, {item.email}, {item.orderID}
              </Link>
              {item.createdAt ? (
                <>
                  <br />
                  {t('received')}: {`${formatDate(item.createdAt)}`}
                </>
              ) : (
                ''
              )}
              {item.updatedAt ? (
                <>
                  <br />
                  {t('updated')}: {`${formatDate(item.updatedAt)}`}
                </>
              ) : (
                ''
              )}
            </li>
          ))}
      </ul>
      <h2>{t('userInfo')}</h2>
      <p className='max-content margin0auto'>
        <strong>{t('username')}:</strong> {user?.username}
        <br />
        <strong>{t('email')}:</strong> {user?.email}
        <br />
        <strong>
          {t('role')} ({user?.role}):
        </strong>{' '}
        {user?.role > 2 ? 'Admin' : 'Moderaattori'}
      </p>
      <Link to='/change' className='m2top max-content margin0auto block'>
        {t('changeInfo')}
      </Link>
    </div>
  )
}

export default Dashboard
