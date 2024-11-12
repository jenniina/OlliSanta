import axios from 'axios'
import { ELang } from '../interfaces'

const baseURL = '/api'

const login = async (email: string, password: string, lang: ELang) => {
  try {
    const response = await axios.post(`${baseURL}/login`, { email, password, lang })
    localStorage.setItem('OlliSanta_token', response.data.token)
    return response.data
  } catch (error) {
    console.error('Error logging in', error)
  }
}
const register = async (
  username: string,
  email: string,
  password: string,
  lang: ELang
) => {
  try {
    const response = await axios.post(`${baseURL}/register`, {
      username,
      email,
      password,
      lang,
    })
    localStorage.setItem('OlliSanta_token', response.data.token)
  } catch (error) {
    console.error('Error logging in', error)
  }
}

const isLoggedIn = () => {
  return !!localStorage.getItem('OlliSanta_token')
}

const logout = () => {
  localStorage.removeItem('OlliSanta_token')
}

const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
  lang: ELang
) => {
  try {
    const response = await axios.post(`${baseURL}/user/password`, {
      email,
      oldPassword,
      newPassword,
      lang,
    })
    return response.data
  } catch (error) {
    console.error('Error changing password', error)
  }
}

const changeUsername = async (
  email: string,
  password: string,
  username: string,
  lang: ELang
) => {
  try {
    const response = await axios.post(`${baseURL}/user/username`, {
      email,
      password,
      username,
      lang,
    })
    return response.data
  } catch (error) {
    console.error('Error changing username', error)
  }
}

const refreshToken = async (email: string, password: string, lang: ELang) => {
  try {
    const response = await axios.post(`${baseURL}/refresh`, { email, password, lang })
    localStorage.setItem('OlliSanta_token', response.data.token)
  } catch (error) {
    console.error('Error refreshing token', error)
  }
}

export default {
  login,
  register,
  isLoggedIn,
  logout,
  refreshToken,
  changePassword,
  changeUsername,
}
