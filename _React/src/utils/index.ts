const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return window.atob(base64)
  }
  // Node.js / prerender
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8")
  }
  throw new Error("No Base64 decoder available")
}

export const user = (() => {
  if (typeof window === "undefined") return null
  const token = window.localStorage.getItem("OlliSanta_token")
  if (
    token &&
    token !== undefined &&
    token !== null &&
    token !== "undefined" &&
    token !== "null" &&
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token) // Check if the token is a valid JWT format
  ) {
    try {
      return JSON.parse(decodeBase64Url(token.split(".")[1]))
    } catch (error) {
      console.error("Error parsing token:", error)
      return null
    }
  }
  return null
})()

export const sanitize = (string: string) => {
  return string.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "-")
}

export const scrollIntoView = (
  id: string,
  block: ScrollLogicalPosition = "start",
  inline: ScrollLogicalPosition = "nearest"
) => {
  if (typeof document === "undefined") return
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block, inline })
  }
}
export const firstToLowerCase = (str: string) => {
  if (!str) return str
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export const getRandomLetters = (length: number, capitals: boolean = false) => {
  const lettersAll = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const lettersCapital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const characters = capitals ? lettersCapital : lettersAll
  let result = ""
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
  return `${date.toLocaleDateString("fi-FI", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })} ${date.toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  })}`
}

// JSON-LD helpers
export type BreadcrumbItem = {
  name: string
  url: string
}

const SITE_NAME = "Olli Santa"
const SITE_BASE_URL = "https://ollisanta.fi"
const DEFAULT_LOGO_URL = `${SITE_BASE_URL}/OlliSanta_x3.png`

export const getOrganizationJsonLd = (options?: {
  name?: string
  url?: string
  logo?: string
  sameAs?: string[]
}): object => {
  const name = options?.name ?? SITE_NAME
  const url = options?.url ?? SITE_BASE_URL
  const logo = options?.logo ?? DEFAULT_LOGO_URL
  const sameAs = options?.sameAs ?? []
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    sameAs,
  }
}

export const getWebsiteJsonLd = (options?: {
  name?: string
  url?: string
  description?: string
  inLanguage?: string
  potentialActionUrl?: string
}): object => {
  const name = options?.name ?? SITE_NAME
  const url = options?.url ?? SITE_BASE_URL
  const description =
    options?.description ?? "Composer and conductor website for Olli Santa."
  const inLanguage = options?.inLanguage ?? "fi"
  const potentialActionUrl = options?.potentialActionUrl ?? SITE_BASE_URL
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    inLanguage,
    potentialAction: {
      "@type": "SearchAction",
      target: `${potentialActionUrl}/?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export const getBreadcrumbJsonLd = (items: BreadcrumbItem[]): object => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
