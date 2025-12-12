type ApiError = { response?: { data?: { message?: string } } }
const isApiError = (e: unknown): e is ApiError =>
  typeof e === "object" && e !== null && "response" in e
import emailService from "../../services"
import { user } from "../../utils"
import { FData } from "../../interfaces"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useNotification } from "../../contexts/useNotification"
import { formatDate } from "../../utils"
import { useTranslation } from "../../contexts/useTranslation"
import { GrStatusWarning } from "react-icons/gr"
import { split } from "../../utils/split"

const Message = () => {
  const { notify } = useNotification()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [data, setData] = useState<FData | null>(null)
  const [edited, setEdited] = useState(false)
  const [refetch, setRefetch] = useState(false)

  useEffect(() => {
    // get orderID from ?id= query
    const url = new URL(window.location.href)
    const orderID = url.searchParams.get("id")

    if (!orderID) return
    const fetchData = async () => {
      try {
        const res = await emailService.getSingleData(orderID)
        setData(res)
      } catch (error: unknown) {
        if (isApiError(error) && error.response?.data?.message)
          notify(error.response.data.message, true, 4)
        else notify(t("error"), true, 4)
        console.error(t("error"), error)
      }
    }
    fetchData()
  }, [refetch, notify, t])

  const deleteFile = async (filename: string) => {
    try {
      setData(
        data && {
          ...data,
          attachments: data.attachments?.filter((a) => a.filename !== filename),
        }
      )
      setEdited(true)
    } catch (error: unknown) {
      if (isApiError(error) && error.response?.data?.message)
        notify(error.response.data.message, true, 4)
      else notify(t("error"), true, 4)
      console.error(t("error"), error)
    }
  }

  useEffect(() => {
    if (edited && data) {
      emailService
        .editData(data)
        .then(() => {
          notify(t("messageEdited"), false, 3)
        })
        .catch((error) => {
          if (error.response?.data?.message)
            notify(error.response.data.message, true, 4)
          else notify(t("errorChangingMessage"), true, 4)
          console.error(t("errorChangingMessage"), error)
        })
        .finally(() => {
          setEdited(false)
          setRefetch(!refetch)
        })
    }
  }, [edited, data, notify, t, refetch])

  const deleteMessage = async (orderID: FData["orderID"]) => {
    if (window.confirm(t("confirmRemoveMessage"))) {
      emailService
        .deleteData(orderID)
        .then(() => {
          notify(t("messageRemoved"), false, 3)
        })
        .catch((error) => {
          if (error.response?.data?.message)
            notify(error.response.data.message, true, 4)
          else notify(t("errorRemovingMessage"), true, 4)
          console.error(t("errorRemovingMessage"), error)
        })
        .finally(() => {
          user ? navigate("/dashboard") : navigate("/")
        })
    }
  }

  if (!data) return <div className="center">No data</div>

  return (
    <div>
      <h2>{data.orderID}</h2>
      <p>
        {data.createdAt ? (
          <>
            {t("received")}: {`${formatDate(data.createdAt)}`}
          </>
        ) : (
          ""
        )}
        {data.updatedAt ? (
          <>
            <br />
            {t("updated")}: {`${formatDate(data.updatedAt)}`}
          </>
        ) : (
          ""
        )}
      </p>
      <p>
        <strong>
          <big>
            {data.firstName} {data.lastName}
          </big>
          <br />
          {data.email}
        </strong>
      </p>

      {data && data.piece.trim() !== "" && (
        <p>
          <strong>{t("pieceName")}:</strong> {data.piece}
        </p>
      )}
      {data && data.ensemble.trim() !== "" && (
        <p>
          <strong>{t("ensemble")}:</strong> {data.ensemble}
        </p>
      )}
      {data && data.schedule.trim() !== "" && (
        <p>
          <strong>{t("schedule")}:</strong> {data.schedule}
        </p>
      )}
      <p>
        <strong>{t("subject")}:</strong> {data.subject}
      </p>
      <p>{split(data.message)}</p>
      <h3>{t("contactInfo")}</h3>
      <div className="flex column margin0auto max-content">
        <p>
          {data.firstName}
          <br />
          {data.lastName}
          <br />
          {data.email}
          {data.address && data.address.trim() !== "" && (
            <>
              <br />
              <br />
              {data.address}
            </>
          )}
          {data.zip && data.zip.trim() !== "" && (
            <>
              <br />
              {data.zip}
            </>
          )}
          {data.city && data.city.trim() !== "" && (
            <>
              <br />
              {data.city}
            </>
          )}
          {data.country && data.country.trim() !== "" && (
            <>
              <br />
              {data.country}
            </>
          )}
        </p>
      </div>

      <h3>{t("attachments")}:</h3>
      {data && data.attachments && data.attachments.length > 0 ? (
        <ul className="flex column gap">
          {data.attachments.map((attachment) => (
            <li className="flex center gap05" key={attachment.filename}>
              <a href={`/uploads/${attachment.filename}`} download>
                {attachment.filename}
              </a>
              <button
                className="small danger"
                onClick={() => {
                  if (window.confirm(t("confirmRemoveFile")))
                    deleteFile(attachment.filename)
                }}
              >
                <GrStatusWarning />
                <span>{t("remove")}</span>
                <GrStatusWarning />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="center">[ {t("noAttachments")} ]</p>
      )}

      <button
        className="m2top danger"
        onClick={() => deleteMessage(data.orderID)}
      >
        <GrStatusWarning />
        <span>
          {t("removeMessage")} {data.orderID}
        </span>
        <GrStatusWarning />
      </button>
      <div className="m2top">
        <Link to="/dashboard">{t("back")}</Link>
      </div>
    </div>
  )
}

export default Message
