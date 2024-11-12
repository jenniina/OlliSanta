import { model, Mongoose, Schema } from 'mongoose'
import { EInvalidFileType, ELang, FData } from '../interfaces'

const getFinnishTime = (): Date => {
  const now = new Date()
  const utcOffset = now.getTimezoneOffset() * 60000
  const finnishOffset = 2 * 60 * 60000 // Finland is UTC+2
  return new Date(now.getTime() + utcOffset + finnishOffset)
}

const allowedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png']

const validateFileType = (attachments: { filename: string; path: string }[]) => {
  return attachments.every((attachment) => {
    const ext = attachment.filename.split('.').pop()?.toLowerCase()
    return allowedFileTypes.includes(`.${ext}`)
  })
}

const orderIDPattern = /^[0-9]{6}-[A-Za-z]{2}$/

const emailSchema = new Schema<FData>({
  orderID: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return orderIDPattern.test(v)
      },
      message: (props: any) =>
        `${props.value} is not a valid orderID! It should follow the format 123456-AB.`,
    },
  },
  lang: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  piece: { type: String },
  ensemble: { type: String },
  schedule: { type: String },
  address: { type: String },
  city: { type: String },
  zip: { type: String },
  country: { type: String },
  attachments: [
    {
      filename: { type: String },
      path: { type: String },
    },
  ],
  createdAt: { type: Date, default: getFinnishTime() },
  updatedAt: { type: Date, default: getFinnishTime() },
})

emailSchema
  .path('attachments')
  .validate(validateFileType, EInvalidFileType[emailSchema.obj.lang as ELang] ?? ELang.en)

export default model('Email', emailSchema)
