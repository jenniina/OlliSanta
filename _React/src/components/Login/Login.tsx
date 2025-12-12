import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import authService from "../../services/auth"
import InputFData from "../Form/Input"
import { useTranslation } from "../../contexts/useTranslation"
import { useNotification } from "../../contexts/useNotification"
import { user } from "../../utils"

const Login = () => {
  const { t, language } = useTranslation()
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    authService
      .login(email, password, language)
      .then(() => {
        setIsSending(false)
        user && user.role > 1 ? navigate("/dashboard") : navigate("/change")
      })
      .catch((error) => {
        if (error.response?.data?.message)
          notify(error.response.data.message, true, 6)
        else notify(t("errorLoggingIn"), true, 6)
        console.error(t("errorLoggingIn"), error)
        setIsSending(false)
      })
  }
  if (user) {
    return (
      <>
        <div className="flex column gap center margin0auto">
          {user.role > 1 ? (
            <Link to="/dashboard" className="margin0auto">
              {t("messages")}
            </Link>
          ) : (
            <></>
          )}
          <Link to="/change">{t("changeInfo")}</Link>
          <button
            onClick={() => {
              if (window.confirm(t("logoutConfirmation"))) {
                authService.logout
              }
            }}
          >
            {t("logout")}
          </button>
        </div>
      </>
    )
  } else
    return (
      <>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" disabled={isSending}>
            {t("login")}
          </button>
        </form>
        <Link className="m3top center margin0auto" to="/register">
          {t("register")}
        </Link>
      </>
    )
}

export default Login
