import { Fragment } from 'react'

export const user = (() => {
  const token = localStorage.getItem('OlliSanta_token')
  if (
    token &&
    token !== undefined &&
    token !== null &&
    token !== 'undefined' &&
    token !== 'null' &&
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token) // Check if the token is a valid JWT format
  ) {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (error) {
      console.error('Error parsing token:', error)
      return null
    }
  }
  return null
})()

export const split = (details: string) => {
  return details?.split('\n')?.map((line: string, index: number) => (
    <Fragment key={`${line}-${index}`}>
      {line}
      <br />
    </Fragment>
  ))
}

export const sanitize = (string: string) => {
  return string.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '-')
}

export const scrollIntoView = (
  id: string,
  block: ScrollLogicalPosition = 'start',
  inline: ScrollLogicalPosition = 'nearest'
) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block, inline })
  }
}
export const firstToLowerCase = (str: string) => {
  if (!str) return str
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export const getRandomLetters = (length: number, capitals: boolean = false) => {
  const lettersAll = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const lettersCapital = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const characters = capitals ? lettersCapital : lettersAll
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const getRandomMinMax = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString)
  return `${date.toLocaleDateString('fi-FI', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })} ${date.toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}
