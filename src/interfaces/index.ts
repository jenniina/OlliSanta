import { Document } from 'mongoose'

export interface IUser extends Document {
  username: string
  role: number
  email: string
  password: string
}

export interface FData {
  orderID: string
  lang: ELang
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  piece: string
  ensemble: string
  schedule: string
  address: string
  city: string
  zip: string
  country: string
  attachments: Array<{ filename: string; path: string; file: any }> | []
  createdAt?: Date
  updatedAt?: Date
}

export enum ELang {
  en = 'en',
  fi = 'fi',
}
export enum EMessageSentSuccessfully {
  en = 'Message sent successfully',
  fi = 'Viesti lähetetty onnistuneesti',
}

export enum EThankYouForYourMessage {
  en = 'Thank you for your message!',
  fi = 'Kiitos viestistäsi!',
}
export enum EIWillSoonBeInTouch {
  en = 'I will soon be in touch.',
  fi = 'Otan pian yhteyttä.',
}

export enum EOrderID {
  en = 'ID',
  fi = 'Tunnus',
}

export enum EMessage {
  en = 'Message',
  fi = 'Viesti',
}

export enum EPiece {
  en = 'Piece',
  fi = 'Kappale',
}
export enum EEnsemble {
  en = 'Ensemble',
  fi = 'Yhtye',
}
export enum ESchedule {
  en = 'Schedule',
  fi = 'Aikataulu',
}
export enum EInvalidFileType {
  en = 'Invalid file type. Only .pdf, .jpg, and .png files are allowed.',
  fi = 'Virheellinen tiedostotyyppi. Vain .pdf, .jpg ja .png -tiedostot ovat sallittuja.',
}
