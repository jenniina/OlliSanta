import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { ELang, IUser } from '../interfaces'

export enum EUserRegisteredSuccessfully {
  en = 'User registered successfully',
  fi = 'Käyttäjä rekisteröity onnistuneesti',
}
export enum EErrorRegisteringUser {
  en = 'Error registering user',
  fi = 'Virhe käyttäjää rekisteröidessä',
}
export enum EInvalidEmailOrPassword {
  en = 'Invalid email or password',
  fi = 'Virheellinen sähköpostiosoite tai salasana',
}
export enum EErrorLoggingIn {
  en = 'Error logging in',
  fi = 'Virhe kirjautumisessa',
}
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body
  const lang = (req.body.lang as ELang) ?? 'fi'

  try {
    const user = new User({ username, role: 1, email, password })
    await user.save()
    res.status(201).json({ message: EUserRegisteredSuccessfully[lang] })
  } catch (error) {
    res.status(500).json({ message: EErrorRegisteringUser[lang], error })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const lang = (req.body.lang as ELang) ?? 'fi'

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: EInvalidEmailOrPassword[lang] })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: EInvalidEmailOrPassword[lang] })
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d',
      }
    )

    res.status(200).json({ token })
  } catch (error) {
    const lang = (req.body.lang as ELang) ?? 'fi'
    console.error(error)
    res.status(500).json({ message: EErrorLoggingIn[lang], error })
  }
}

export const changePassword = async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body
  const lang = (req.body.lang as ELang) ?? 'fi'

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: EInvalidEmailOrPassword[lang] })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: EInvalidEmailOrPassword[lang] })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()
    res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error changing password', error })
  }
}

export const changeUsername = async (req: Request, res: Response) => {
  const { email, password, username } = req.body
  const lang = (req.body.lang as ELang) ?? 'fi'

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: EInvalidEmailOrPassword[lang] })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: EInvalidEmailOrPassword[lang] })
    }

    user.username = username
    await user.save()
    res.status(200).json({ message: 'Username changed successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error changing username', error })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const lang = (req.body.lang as ELang) ?? 'fi'

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: EInvalidEmailOrPassword[lang] })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: EInvalidEmailOrPassword[lang] })
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d',
      }
    )

    res.status(200).json({ token })
  } catch (error) {
    const lang = (req.body.lang as ELang) ?? 'fi'
    console.error(error)
    res.status(500).json({ message: EErrorLoggingIn[lang], error })
  }
}
