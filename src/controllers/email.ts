import { Request, Response } from 'express'
import fs from 'fs'
import Email from '../models/email'
import path from 'path'
const sanitizeHtml = require('sanitize-html')
const nodemailer = require('nodemailer')
import {
  FData,
  ELang,
  EMessageSentSuccessfully,
  EOrderID,
  EMessage,
  EPiece,
  EEnsemble,
  ESchedule,
  EThankYouForYourMessage,
  EIWillSoonBeInTouch,
  EPleaseNotify,
} from '../interfaces'

const getConfiguredPort = (): number => {
  const fromEnv = Number(process.env.NODEMAILER_PORT)
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : 587
}

const getConfiguredSecure = (port: number): boolean => {
  const fromEnv = process.env.NODEMAILER_SECURE
  if (typeof fromEnv === 'string') {
    return ['1', 'true', 'yes', 'on'].includes(fromEnv.toLowerCase())
  }
  return port === 465
}

const getSenderAddress = (): string => {
  return process.env.NODEMAILER_SENDER ?? process.env.NODEMAILER_USER ?? ''
}

const resolveLang = (value: unknown): ELang => {
  return value === ELang.fi ? ELang.fi : ELang.en
}

const withNotifyMessage = (message: string, lang: ELang): string => {
  return `${message} ${EPleaseNotify[lang]} ${getSenderAddress() || '-'}`
}

type MailerLikeError = Error & {
  code?: string
  command?: string
  responseCode?: number
  response?: string
}

const shouldIncludeNotify = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false

  const e = error as MailerLikeError
  const code = String(e.code ?? '').toUpperCase()
  const command = String(e.command ?? '').toUpperCase()
  const responseCode =
    typeof e.responseCode === 'number' ? e.responseCode : undefined
  const text = `${e.message ?? ''} ${e.response ?? ''}`.toLowerCase()

  // Typical nodemailer/SMTP transport and auth failures.
  const smtpCodes = new Set([
    'EAUTH',
    'ECONNECTION',
    'ESOCKET',
    'ETIMEDOUT',
    'EENVELOPE',
    'EMESSAGE',
  ])

  if (smtpCodes.has(code)) return true
  if (command.includes('AUTH')) return true
  if (typeof responseCode === 'number' && responseCode >= 500) return true

  return (
    text.includes('smtp') ||
    text.includes('authentication') ||
    text.includes('invalid login') ||
    text.includes('username and password not accepted')
  )
}

const buildErrorMessage = (
  message: string,
  lang: ELang,
  error: unknown
): string => {
  if (shouldIncludeNotify(error)) {
    return withNotifyMessage(message, lang)
  }
  return message
}

const mailPort = getConfiguredPort()
const mailSecure = getConfiguredSecure(mailPort)

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: mailPort,
  secure: mailSecure,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
})

const sanitizeText = (value: unknown): string => {
  return sanitizeHtml(String(value ?? ''), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim()
}

const resolveUploadsDir = (): string => {
  if (process.env.UPLOADS_DIR) {
    return path.resolve(process.env.UPLOADS_DIR)
  }
  return path.resolve(__dirname, '..', '..', 'uploads')
}

const uploadsDir = resolveUploadsDir()
const safeUploadPath = (filename: string): string => {
  const safeName = path.basename(filename)
  return path.resolve(uploadsDir, safeName)
}

const stripAttachmentPaths = (doc: any) => {
  if (!doc) return doc
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc
  if (!raw || !raw.attachments) return raw
  return {
    ...raw,
    attachments: Array.isArray(raw.attachments)
      ? raw.attachments.map((a: any) => ({ filename: a?.filename }))
      : raw.attachments,
  }
}

export const sendMail = (
  subject: string,
  message: string,
  email: string | undefined,
  attachments: FData['attachments']
) => {
  const fromAddress = getSenderAddress()

  if (!fromAddress) {
    return Promise.reject(
      new Error(
        'Email sender is not configured. Set NODEMAILER_SENDER or NODEMAILER_USER.'
      )
    )
  }

  if (!email) {
    return Promise.reject(new Error('Email recipient is missing.'))
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: fromAddress,
        to: email,
        subject: subject,
        text: `${message}\n\n`,
        attachments:
          attachments.length > 0
            ? attachments?.map((attachment) => ({
                filename: attachment.filename,
                path: safeUploadPath(attachment.filename),
              }))
            : undefined,
      },
      (error: Error, info: { response: unknown }) => {
        if (error) {
          console.error(error)
          reject(error)
        } else {
          console.log('Email sent: ' + info.response)
          resolve(info.response)
        }
      }
    )
  })
}

export const send = async (req: Request, res: Response) => {
  const responseLang = resolveLang(req.body.lang)
  try {
    const sanitizedOrderID = sanitizeText(req.body.orderID)
    const lang = (req.body.lang as ELang) ?? 'fi'
    const sanitizedEmail = sanitizeText(req.body.email)
    const sanitizedFirstName = sanitizeText(req.body.firstName)
    const sanitizedLastName = sanitizeText(req.body.lastName)
    const sanitizedAddress = sanitizeText(req.body.address)
    const sanitizedCity = sanitizeText(req.body.city)
    const sanitizedZip = sanitizeText(req.body.zip)
    const sanitizedPiece = sanitizeText(req.body.piece)
    const sanitizedEnsemble = sanitizeText(req.body.ensemble)
    const sanitizedSchedule = sanitizeText(req.body.schedule)
    const sanitizedCountry = sanitizeText(req.body.country)
    const sanitizedSubject = sanitizeText(req.body.subject)
    const sanitizedMessage = sanitizeText(req.body.message)

    const attachments = req.files
      ? (req.files as Express.Multer.File[])?.map((file) => ({
          filename: file.filename,
          path: safeUploadPath(file.filename),
          file: file,
        }))
      : []

    const email = new Email({
      orderID: sanitizedOrderID,
      lang: lang ?? 'fi',
      email: sanitizedEmail,
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      address: sanitizedAddress,
      city: sanitizedCity,
      zip: sanitizedZip,
      country: sanitizedCountry,
      piece: sanitizedPiece,
      ensemble: sanitizedEnsemble,
      schedule: sanitizedSchedule,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      attachments: attachments,
    })

    await email.save()

    const message = `${EOrderID[lang ?? 'fi']}: ${sanitizedOrderID} \n\n
    ${
      sanitizedPiece !== ''
        ? `${EPiece[lang ?? 'fi']}: ${sanitizedPiece} \n\n`
        : ''
    } ${
      sanitizedEnsemble !== ''
        ? `${EEnsemble[lang ?? 'fi']}: ${sanitizedEnsemble} \n\n`
        : ''
    }${
      sanitizedSchedule !== ''
        ? `${ESchedule[lang ?? 'fi']}: ${sanitizedSchedule} \n`
        : ''
    }
      ${EMessage[lang ?? 'fi']}: \n
      ${sanitizedMessage} \n\n${sanitizedFirstName} ${sanitizedLastName}: ${sanitizedEmail}\n\n${sanitizedAddress}\n${sanitizedZip} ${sanitizedCity}\n${sanitizedCountry}`

    await sendMail(
      `Uusi viesti: ${sanitizedSubject} (${sanitizedFirstName} ${sanitizedLastName})`,
      message,
      getSenderAddress(),
      attachments
    )

    // Send confirmation email to the user. If it fails, do not fail the whole request.
    try {
      await sendMail(
        EThankYouForYourMessage[lang ?? 'fi'],
        `${EIWillSoonBeInTouch[lang ?? 'fi']} \n\n${sanitizedSubject} \n\n${message}`,
        sanitizedEmail,
        []
      )
    } catch (confirmationError) {
      console.error('Confirmation email failed:', confirmationError)
    }

    return res.status(200).json({
      success: true,
      message: `${EMessageSentSuccessfully[(req.body.lang as ELang) ?? 'fi']}`,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: buildErrorMessage(
        `${(error as Error).message}`,
        responseLang,
        error
      ),
      error: error,
    })
  }
}

export const getEmails = async (req: Request, res: Response) => {
  const responseLang = resolveLang(req.query.lang)
  try {
    const emails = await Email.find()
    return res.status(200).json(emails.map(stripAttachmentPaths))
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: buildErrorMessage(
        `${(error as Error).message}`,
        responseLang,
        error
      ),
      error: error,
    })
  }
}

export const getEmail = async (req: Request, res: Response) => {
  const responseLang = resolveLang(req.query.lang)
  try {
    const email = await Email.findOne({ orderID: req.params.orderID })
    return res.status(200).json(stripAttachmentPaths(email))
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: buildErrorMessage(
        `${(error as Error).message}`,
        responseLang,
        error
      ),
      error: error,
    })
  }
}

export const deleteEmail = async (req: Request, res: Response) => {
  const responseLang = resolveLang(req.query.lang)
  try {
    const email = await Email.findOne({ orderID: req.params.orderID })
    if (!email) {
      return res.status(404).json({ message: 'Message not found' })
    }

    // Delete associated files
    if (email.attachments && email.attachments.length > 0) {
      email.attachments.forEach((attachment) => {
        const filePath = safeUploadPath(String(attachment.filename ?? ''))
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${attachment.filename}:`, err)
          }
        })
      })
    }
    await Email.deleteOne({ orderID: req.params.orderID })
    return res
      .status(200)
      .json({ message: 'Message and associated files deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: buildErrorMessage(
        `${(error as Error).message}`,
        responseLang,
        error
      ),
      error: error,
    })
  }
}

export const editEmail = async (req: Request, res: Response) => {
  const responseLang = resolveLang(req.body.lang)
  try {
    const email = await Email.findOne({ orderID: req.params.orderID })
    if (!email) {
      return res.status(404).json({ message: 'Message not found' })
    }

    const sanitizedOrderID = sanitizeHtml(req.body.orderID)
    const lang = (req.body.lang as ELang) ?? 'fi'
    const sanitizedEmail = sanitizeHtml(req.body.email)
    const sanitizedFirstName = sanitizeHtml(req.body.firstName)
    const sanitizedLastName = sanitizeHtml(req.body.lastName)
    const sanitizedAddress = sanitizeHtml(req.body.address)
    const sanitizedCity = sanitizeHtml(req.body.city)
    const sanitizedZip = sanitizeHtml(req.body.zip)
    const sanitizedPiece = sanitizeHtml(req.body.piece)
    const sanitizedEnsemble = sanitizeHtml(req.body.ensemble)
    const sanitizedSchedule = sanitizeHtml(req.body.schedule)
    const sanitizedCountry = sanitizeHtml(req.body.country)
    const sanitizedSubject = sanitizeHtml(req.body.subject)
    const sanitizedMessage = sanitizeHtml(req.body.message)

    const attachments = req.files
      ? (req.files as Express.Multer.File[])?.map((file) => ({
          filename: file.filename,
          path: path.join(__dirname, '..', '..', 'uploads', file.filename),
          file: file,
        }))
      : []

    // Delete attachments that are missing from the updated email
    const existingAttachments = email.attachments.map(
      (attachment) => attachment.filename
    )
    const updatedAttachments = attachments.map(
      (attachment) => attachment.filename
    )
    const attachmentsToDelete = existingAttachments.filter(
      (filename) => !updatedAttachments.includes(filename)
    )

    attachmentsToDelete.forEach((filename) => {
      const filePath = path.join(__dirname, '..', '..', 'uploads', filename)
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filename}:`, err)
        }
      })
    })

    // Remove mentions of deleted files from the email
    email.attachments = email.attachments.filter(
      (attachment) => !attachmentsToDelete.includes(attachment.filename)
    )

    email.orderID = sanitizedOrderID
    email.lang = lang ?? 'fi'
    email.email = sanitizedEmail
    email.firstName = sanitizedFirstName
    email.lastName = sanitizedLastName
    email.address = sanitizedAddress
    email.city = sanitizedCity
    email.zip = sanitizedZip
    email.country = sanitizedCountry
    email.piece = sanitizedPiece
    email.ensemble = sanitizedEnsemble
    email.schedule = sanitizedSchedule
    email.subject = sanitizedSubject
    email.message = sanitizedMessage
    email.attachments = attachments

    await email.save()

    return res.status(200).json({ message: 'Message updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: buildErrorMessage(
        `${(error as Error).message}`,
        responseLang,
        error
      ),
      error: error,
    })
  }
}

// export const deleteAllEmails = async (req: Request, res: Response) => {
//   try {
//     await Email.deleteMany({})
//     return res.status(200).json({ message: 'All emails deleted successfully' })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ message: `${(error as Error).message}`, error: error })
//   }
// }
