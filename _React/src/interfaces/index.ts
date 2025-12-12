export enum ELang {
  en = "en",
  fi = "fi",
}
export enum EErrorSendingMessage {
  en = "Error sending message",
  fi = "Virhe viestiä lähetettäessä",
}

export enum EPleaseProvideAValidEmailAddress {
  en = "Please provide a valid email address",
  fi = "Anna kelvollinen sähköpostiosoite",
}

export enum EMessageSentSuccessfully {
  en = "Message sent successfully",
  fi = "Viesti lähetetty onnistuneesti",
}

export enum EInvalidFileType {
  en = "Invalid file type. Only .pdf, .jpg, and .png files are allowed.",
  fi = "Virheellinen tiedostotyyppi. Vain .pdf, .jpg ja .png -tiedostot ovat sallittuja.",
}

export enum EOrderID {
  en = "ID",
  fi = "Tunnus",
}

export enum EMessage {
  en = "Message",
  fi = "Viesti",
}

export enum EPiece {
  en = "Piece",
  fi = "Kappale",
}
export enum EEnsemble {
  en = "Ensemble",
  fi = "Yhtye",
}
export enum ESchedule {
  en = "Schedule",
  fi = "Aikataulu",
}

export interface notification {
  message: string
  isError: boolean
  duration: number
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
  attachments: Array<{ filename: string; path: string; file: File }> | []
  createdAt?: Date
  updatedAt?: Date
}

export interface IUser {
  username: string
  role: number
  email: string
  password: string
}

export type AnyProps = Record<string, unknown>

export interface ProtectedRouteProps<T extends AnyProps = AnyProps> {
  component: React.ComponentType<T>
  requiredRole?: number
}
