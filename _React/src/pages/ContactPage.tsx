import { FC, FormEvent, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { RiMailSendLine } from "react-icons/ri"
import { GrStatusWarning } from "react-icons/gr"
import "../components/Form/form.css"
import service from "../services"
import styles from "./css/contact.module.css"
import { useTranslation } from "../contexts/useTranslation"
import { useNotification } from "../contexts/useNotification"
import useLocalStorage from "../hooks/useStorage"
import FormWrapper from "../components/Form/FormWrapper"
import { Select, SelectOption } from "../components/Select/Select"
import InputFData, { maxFileSize } from "../components/Form/InputFData"
import Textarea from "../components/Form/Textarea"
import { FData } from "../interfaces"
import { getRandomLetters, getRandomMinMax } from "../utils"
import { getBreadcrumbJsonLd, getOrganizationJsonLd } from "../utils"
import JsonLdScript from "../utils/JsonLd"
import SEO from "../components/SEO/SEO"
import Input from "../components/Form/Input"

interface Props {
  heading: string
}

const makeOrderID = () => {
  return `${Math.ceil(getRandomMinMax(100000, 999999))}-${getRandomLetters(
    2,
    true
  )}`
}

const ContactPage: FC<Props> = ({ heading }) => {
  const { t, language } = useTranslation()
  const { notify } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()
  const { type: typeParam } = useParams()

  const allowedTypeValues = useMemo(
    () => ["arrangement", "composition", "parts", "notation", "other"],
    []
  )

  const subjectOptions: SelectOption[] = useMemo(
    () => [
      { value: "arrangement", label: t("arrangement") },
      { value: "composition", label: t("composition") },
      { value: "parts", label: t("partRecordings") },
      { value: "notation", label: t("notation") },
      { value: "other", label: t("other") },
    ],
    [t]
  )

  const typeFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get("type")
  }, [location.search])

  const typeFromUrl = (typeParam ?? typeFromQuery)?.toLowerCase() ?? null
  const normalizedType =
    typeFromUrl && allowedTypeValues.includes(typeFromUrl) ? typeFromUrl : null
  const canonicalPath = normalizedType
    ? `/contact/${normalizedType}`
    : "/contact"
  const canonicalUrl = `https://ollisanta.fi${canonicalPath}`
  const subjectFromUrl =
    (typeFromUrl
      ? subjectOptions.find((o) => o.value === typeFromUrl)
      : undefined) ?? undefined

  const [subject, setSubject] = useState<SelectOption>(() => {
    if (subjectFromUrl) return subjectFromUrl

    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("OlliSanta_subject")
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SelectOption>
          if (typeof parsed.value === "string") {
            const match = subjectOptions.find((o) => o.value === parsed.value)
            if (match) return match
          }
        }
      } catch {
        // ignore
      }
    }

    return subjectOptions[0]
  })

  const [data, setData] = useLocalStorage<FData>("OlliSanta_formData", {
    orderID: makeOrderID(),
    lang: language ?? "fi",
    firstName: "",
    lastName: "",
    email: "",
    subject: subject.label,
    message: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    attachments: [],
    piece: "",
    ensemble: "",
    schedule: "",
  })
  const [other, setOther] = useState("")

  const [attachments, setAttachments] = useState<FData["attachments"]>([])

  const [isSending, setIsSending] = useState(false)

  // Persist subject to localStorage (client only)
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(
        "OlliSanta_subject",
        JSON.stringify({ value: subject.value })
      )
    } catch {
      // ignore
    }
  }, [subject.value])

  // Initialize/override subject from URL (SSR-safe)
  useEffect(() => {
    if (!subjectFromUrl) return
    setSubject(subjectFromUrl)
    setData((prev) => ({
      ...prev,
      subject:
        subjectFromUrl.value === "other"
          ? subjectFromUrl.label + ": " + other
          : subjectFromUrl.label,
    }))

    // If old query-based URL was used, canonicalize to /contact/:type on the client.
    if (!typeParam && typeFromQuery && typeof window !== "undefined") {
      navigate(`/contact/${subjectFromUrl.value}`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectFromUrl?.value])

  useEffect(() => {
    const updated =
      subjectOptions.find((o) => o.value === subject.value) ?? subjectOptions[0]
    setSubject(updated)
    setData((prevData) => ({
      ...prevData,
      lang: language,
      subject:
        updated.value === "other"
          ? updated.label + ": " + other
          : updated.label ?? "other",
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, other, subject.value])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)
    service
      .sendMail(data, attachments)
      .then((response) => {
        notify(response.message, false, 5)
        if (response.success == true) {
          setData({
            orderID: makeOrderID(),
            lang: language ?? "fi",
            firstName: "",
            lastName: "",
            email: "",
            subject: subject.label,
            message: "",
            address: "",
            city: "",
            zip: "",
            country: "",
            attachments: [],
            piece: "",
            ensemble: "",
            schedule: "",
          })
          setAttachments([])
          setOther("")
          setIsSending(false)
        } else setIsSending(false)
      })
      .catch((error) => {
        console.error(error)
        setIsSending(false)
        if (error.response?.data?.message)
          notify(error.response.data.message, true, 10)
        else notify(t("errorSendingMessage") + ": " + error.message, true, 10)
      })
  }

  // (Old window.location.search logic removed; handled via useLocation/useParams)

  return (
    <>
      <SEO
        title={t("contact") + " - Olli Santa"}
        description={t("contactInfo")}
        canonical={canonicalUrl}
        ogUrl={canonicalUrl}
        keywords={[
          "contact",
          "arrangement",
          "composition",
          "notation",
          "parts",
        ]}
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: t("homePage"),
              item: "https://ollisanta.fi/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: t("contact"),
              item: canonicalUrl,
            },
          ],
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Olli Santa",
          url: "https://ollisanta.fi",
          logo: "https://ollisanta.fi/OlliSanta_x3.png",
        })}
      </script>
      <JsonLdScript data={getOrganizationJsonLd()} />
      <JsonLdScript
        data={getBreadcrumbJsonLd([
          { name: t("homePage"), url: "https://ollisanta.fi/" },
          { name: t("contact"), url: canonicalUrl },
        ])}
      />
      <section className="medium">
        <h2>{heading}</h2>
        <FormWrapper
          className=""
          title={`${t("subject")}: ${subject.label}`}
          description={`${
            subject.value === "notation"
              ? t("haveAHandwrittenScore")
              : subject.value === "parts"
              ? t("partsIntro")
              : subject.value === "composition"
              ? t("compositionIntro")
              : subject.value === "arrangement"
              ? t("suitableArrangements")
              : ""
          }`}
        >
          <form onSubmit={handleSubmit}>
            <div
              className={`input-container ${
                subject.value !== "parts" ? "" : "wide"
              }`}
            >
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
                        v.value === "composition" || v.value === "arrangement"
                          ? prevData.ensemble
                          : "",
                      piece:
                        v.value === "arrangement" ||
                        v.value === "parts" ||
                        v.value === "notation"
                          ? prevData.piece
                          : "",
                    }
                  })
                }}
                className="subject"
                id="subject"
                instructions={t("changeSubjectHere")}
                z={10}
              />
              {(subject.value === "arrangement" ||
                subject.value === "parts" ||
                subject.value === "notation") && (
                <InputFData
                  value={data?.piece}
                  type="text"
                  name="piece"
                  label={t("pieceName")}
                  onChange={setData}
                  required
                />
              )}
              {(subject.value === "composition" ||
                subject.value === "arrangement") && (
                <InputFData
                  value={data?.ensemble}
                  type="text"
                  name="ensemble"
                  label={t("ensemble")}
                  onChange={setData}
                  required
                />
              )}
              {subject.value === "other" && (
                <Input
                  value={other}
                  type="text"
                  name="otherSubject"
                  label={t("subject")}
                  onChange={setOther}
                  required
                />
              )}
            </div>

            <Textarea
              value={data?.message}
              name="message"
              label={subject.value !== "other" ? t("wishes") : t("yourMessage")}
              onChange={setData}
              required
            />
            <div className={`input-container`}>
              {subject.value !== "other" && (
                <InputFData
                  value={data?.schedule}
                  type="text"
                  name="schedule"
                  label={t("scheduleRequest")}
                  onChange={setData}
                  required
                />
              )}
              <InputFData
                value={data?.firstName}
                type="text"
                name="firstName"
                label={t("firstName")}
                onChange={setData}
                required
              />
              <InputFData
                value={data?.lastName}
                type="text"
                name="lastName"
                label={t("lastName")}
                onChange={setData}
                required
              />
              <InputFData
                value={data?.email}
                type="email"
                name="email"
                label={t("email")}
                onChange={setData}
                required
              />
              {subject.value !== "other" && (
                <>
                  <InputFData
                    value={data?.address}
                    type="text"
                    name="address"
                    label={t("billingAddress")}
                    onChange={setData}
                    required
                  />
                  <InputFData
                    value={data?.zip}
                    type="text"
                    name="zip"
                    label={t("zip")}
                    onChange={setData}
                    required
                  />
                  <InputFData
                    value={data?.city}
                    type="text"
                    name="city"
                    label={t("city")}
                    onChange={setData}
                    required
                  />
                  <InputFData
                    value={data?.country}
                    type="text"
                    name="country"
                    label={t("country")}
                    onChange={setData}
                    required
                  />
                </>
              )}
            </div>

            <div className="file-upload-container">
              <p>
                <big> {t("sendMaterials")} </big>
                <br />
                {t("maxFileSizeIs") +
                  ": " +
                  maxFileSize / (1024 * 1024) +
                  "MB"}{" "}
                <br />
                {t("maxFiles10")}
              </p>
              <InputFData
                type="file"
                value={undefined}
                name="attachments"
                label={`${t("allowedFileTypes")}`}
                onChange={setData}
                updateAttachments={setAttachments}
                multiple
              />
            </div>
            <p>
              <big>{t("files")}:</big>
            </p>
            {attachments?.length < 1 && <p>[ {t("noFiles")} ]</p>}
            <div className={styles["file-preview-wrap"]}>
              {attachments?.map((file, i) => (
                <div key={i} className={styles["file-preview"]}>
                  <a href={file.path} target="_blank" rel="noreferrer">
                    {file.filename}
                  </a>
                  &nbsp;
                  <button
                    className="small"
                    type="button"
                    onClick={() => {
                      if (window.confirm(t("confirmRemoveFile"))) {
                        setAttachments((prev) =>
                          prev.filter((_, index) => index !== i)
                        )
                      }
                    }}
                  >
                    {t("remove")}
                  </button>
                </div>
              ))}
            </div>
            <div className={styles["submit-wrap"]}>
              <button
                disabled={isSending}
                className={`big ${styles.submit}`}
                type="submit"
              >
                <span>{t("submit")}</span>
                <RiMailSendLine />
              </button>
            </div>
          </form>
        </FormWrapper>
        <div className="empty-fields-wrap">
          <button
            className="empty-fields-btn small m3top danger center"
            onClick={() => {
              if (window.confirm(t("emptyFieldsConfirmation"))) {
                setAttachments([])
                setData({
                  orderID: makeOrderID(),
                  lang: language ?? "fi",
                  firstName: "",
                  lastName: "",
                  email: "",
                  subject: subject.label,
                  message: "",
                  address: "",
                  city: "",
                  zip: "",
                  country: "",
                  attachments: [],
                  piece: "",
                  ensemble: "",
                  schedule: "",
                })
              }
            }}
          >
            <GrStatusWarning />
            <span>{t("emptyFields")}</span>
            <GrStatusWarning />
          </button>
        </div>
      </section>
    </>
  )
}

export default ContactPage
