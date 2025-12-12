import { useState } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../../services/auth"
import InputFData from "../Form/Input"
import { useNotification } from "../../contexts/useNotification"
import { useTranslation } from "../../contexts/useTranslation"

const Register = () => {
  const { t, language } = useTranslation()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    try {
      authService.register(username, email, password, language).then(() => {
        notify("Rekisteröityminen onnistui", false, 6)
        setIsSending(false)
        navigate("/login")
      })
    } catch (error: unknown) {
      const hasMsg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        // @ts-expect-error narrow axios-like error shape
        error.response?.data?.message
      if (hasMsg)
        // @ts-expect-error narrow axios-like error shape
        notify(error.response.data.message, true, 6)
      else notify(t("error"), true, 6)
      console.error("Error registering", error)
      setIsSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputFData
        type="text"
        name="username"
        value={username}
        onChange={() => setUsername}
        required
        label={t("username")}
      />
      <InputFData
        type="email"
        name="email"
        value={email}
        onChange={() => setEmail}
        required
        label={t("email")}
      />
      <InputFData
        type="password"
        name="password"
        value={password}
        onChange={() => setPassword}
        required
        label={t("password")}
      />
      <button disabled={isSending} type="submit">
        {t("submit")}
      </button>
    </form>
  )
}

export default Register
