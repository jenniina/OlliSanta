import { FC, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import authService from "../services/auth"
import Input from "../components/Form/Input"
import useUser from "../hooks/useUser"
import { useTranslation } from "../contexts/useTranslation"
import { useNotification } from "../contexts/useNotification"
import FormWrapper from "../components/Form/FormWrapper"
import { AnyProps, IUser } from "../interfaces"

interface Props extends AnyProps {
  heading: string
}

const ChangePage: FC<Props> = ({ heading }) => {
  const { notify } = useNotification()
  const navigate = useNavigate()
  const user = useUser<{ email?: string; username?: string; role?: number }>()
  const email = user?.email
  const [oldPassword, setOldPassword] = useState<IUser["password"]>("")
  const [newPassword, setNewPassword] = useState<IUser["password"]>("")
  const [newPasswordAgain, setNewPasswordAgain] =
    useState<IUser["password"]>("")
  const [password, setPassword] = useState<IUser["password"]>("")
  const [newUsername, setNewUsername] = useState<IUser["username"]>("")
  const [isSending, setIsSending] = useState(false)
  const { t, language } = useTranslation()

  useEffect(() => {
    if (!newUsername && user?.username) {
      setNewUsername(user.username)
    }
  }, [user?.username, newUsername])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    const emailValue = email
    if (!emailValue) {
      notify(t("errorChangingPassword"), true, 6)
      setIsSending(false)
      return
    }

    //Check if newPassword and newPasswordAgain are the same
    if (newPassword !== newPasswordAgain) {
      notify(t("passwordsDoNotMatch"), true, 6)
      setIsSending(false)
      return
    }

    authService
      .changePassword(emailValue, oldPassword, newPassword, language)
      .then(() => notify(t("passwordChangedSuccessfully"), false, 6))
      .catch((error) => {
        if (error.response?.data?.message)
          notify(error.response.data.message, true, 6)
        else notify(t("errorChangingPassword"), true, 6)
        console.error(t("errorChangingPassword"), error)
        setIsSending(false)
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    const emailValue = email
    if (!emailValue) {
      notify(t("errorChangingUsername"), true, 6)
      setIsSending(false)
      return
    }

    authService
      .changeUsername(emailValue, password, newUsername, language)
      .then(() => authService.refreshToken(emailValue, password, language))
      .then(() => {
        setIsSending(false)
        notify(t("usernameChangedSuccessfully"), false, 3)
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      })
      .catch((error) => {
        if (error.response?.data?.message)
          notify(error.response.data.message, true, 6)
        else notify(t("errorChangingUsername"), true, 6)
        console.error(t("errorChangingUsername"), error)
        setIsSending(false)
      })
  }

  return (
    <section className="medium">
      <h2>{heading}</h2>

      <p>
        {t("username")}: {user?.username}
      </p>
      <p>
        {t("email")}: {user?.email}
      </p>
      <FormWrapper title={t("changePassword")} description="" className="m2top">
        <form onSubmit={handlePasswordSubmit}>
          <Input
            value={oldPassword}
            type="password"
            name="oldPassword"
            label={t("oldPassword")}
            onChange={setOldPassword}
            required
          />
          <Input
            value={newPassword}
            type="password"
            name="newPassword"
            label={t("newPassword")}
            onChange={setNewPassword}
            required
          />
          <Input
            value={newPasswordAgain}
            type="password"
            name="newPasswordAgain"
            label={t("newPasswordAgain")}
            onChange={setNewPasswordAgain}
            required
          />

          <button type="submit" disabled={isSending}>
            {t("changePassword")}
          </button>
        </form>
      </FormWrapper>

      <FormWrapper title={t("changeUsername")} description="" className="m2top">
        <form onSubmit={handleUsernameSubmit}>
          <Input
            value={newUsername}
            type="text"
            name="username"
            label={t("newUsername")}
            onChange={setNewUsername}
            required
          />
          <Input
            value={password}
            type="password"
            name="password"
            label={t("password")}
            onChange={setPassword}
            required
          />
          <button type="submit" disabled={isSending}>
            {t("changeUsername")}
          </button>
        </form>
      </FormWrapper>
      <div className="m3top margin0auto flex column center gap">
        {(user?.role ?? 0) > 1 && (
          <Link to="/dashboard" className="margin0auto">
            {t("messages")}
          </Link>
        )}
        <button
          className="m1top margin0auto"
          onClick={() => {
            if (window.confirm(t("logoutConfirmation"))) {
              authService.logout
              navigate("/")
            }
          }}
        >
          {t("logout")}
        </button>
      </div>
    </section>
  )
}

export default ChangePage
