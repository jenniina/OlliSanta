import { Request, Response } from 'express'
import fs from 'fs'
import Email from '../models/email'
import { deleteFile } from './delete'
import path from 'path'
const { validationResult } = require('express-validator')
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
} from '../interfaces'

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
})

export const sendMail = (
  subject: string,
  message: string,
  email: string | undefined,
  attachments: FData['attachments']
) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.NODEMAILER_SENDER,
        to: email,
        subject: subject,
        text: `${message}\n\n`,
        attachments:
          attachments.length > 0
            ? attachments?.map((attachment) => ({
                filename: attachment.filename,
                path: path.join(__dirname, '..', '..', 'uploads', attachment.filename),
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
  try {
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
    ${sanitizedPiece !== '' ? `${EPiece[lang ?? 'fi']}: ${sanitizedPiece} \n\n` : ''} ${
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
      process.env.NODEMAILER_SENDER,
      attachments
    )

    //send confirmation email to the user
    await sendMail(
      EThankYouForYourMessage[lang ?? 'fi'],
      `${EIWillSoonBeInTouch[lang ?? 'fi']} \n\n${message}`,
      sanitizedEmail,
      []
    )

    return res.status(200).json({
      message: `${EMessageSentSuccessfully[(req.body.lang as ELang) ?? 'fi']}`,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: `${(error as Error).message}`, error: error })
  }
}

export const getEmails = async (req: Request, res: Response) => {
  try {
    const emails = await Email.find()
    return res.status(200).json(emails)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: `${(error as Error).message}`, error: error })
  }
}

export const getEmail = async (req: Request, res: Response) => {
  try {
    const email = await Email.findOne({ orderID: req.params.orderID })
    return res.status(200).json(email)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: `${(error as Error).message}`, error: error })
  }
}

export const deleteEmail = async (req: Request, res: Response) => {
  try {
    const email = await Email.findOne({ orderID: req.params.orderID })
    if (!email) {
      return res.status(404).json({ message: 'Message not found' })
    }

    // Delete associated files
    if (email.attachments && email.attachments.length > 0) {
      email.attachments.forEach((attachment) => {
        const filePath = path.join(__dirname, '..', '..', 'uploads', attachment.filename)
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
    return res.status(500).json({ message: `${(error as Error).message}`, error: error })
  }
}

export const editEmail = async (req: Request, res: Response) => {
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
    const existingAttachments = email.attachments.map((attachment) => attachment.filename)
    const updatedAttachments = attachments.map((attachment) => attachment.filename)
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
    return res.status(500).json({ message: `${(error as Error).message}`, error: error })
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
