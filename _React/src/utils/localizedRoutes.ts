import { ELang } from "../interfaces"

export type ContactTypeValue =
  | "arrangement"
  | "composition"
  | "parts"
  | "notation"
  | "other"

const FI_CONTACT_SLUG_TO_VALUE: Record<string, ContactTypeValue> = {
  sovitus: "arrangement",
  savellys: "composition",
  "osien-nauhoitukset": "parts",
  nuottikirjoitus: "notation",
  muu: "other",
}

const FI_CONTACT_VALUE_TO_SLUG: Record<ContactTypeValue, string> = {
  arrangement: "sovitus",
  composition: "savellys",
  parts: "osien-nauhoitukset",
  notation: "nuottikirjoitus",
  other: "muu",
}

export function getLanguageFromPathname(pathname: string): ELang {
  return pathname === "/en" || pathname.startsWith("/en/") ? ELang.en : ELang.fi
}

export function stripEnPrefix(pathname: string): {
  lang: ELang
  restPathname: string
} {
  const lang = getLanguageFromPathname(pathname)
  if (lang === ELang.en) {
    const rest = pathname === "/en" ? "/" : pathname.replace(/^\/en(\/|$)/, "/")
    return { lang, restPathname: rest }
  }
  return { lang, restPathname: pathname }
}

export function getHomePath(lang: ELang): string {
  return lang === ELang.en ? "/en" : "/"
}

export function getAboutPath(lang: ELang): string {
  return lang === ELang.en ? "/en/about" : "/tietoa"
}

export function getContactPath(lang: ELang): string {
  return lang === ELang.en ? "/en/contact" : "/yhteys"
}

export function parseContactTypeFromSlug(
  slug: string,
  slugLang: ELang
): ContactTypeValue | null {
  const normalized = slug.toLowerCase()

  if (slugLang === ELang.fi) {
    return FI_CONTACT_SLUG_TO_VALUE[normalized] ?? null
  }

  // English uses the internal values as slugs
  if (
    normalized === "arrangement" ||
    normalized === "composition" ||
    normalized === "parts" ||
    normalized === "notation" ||
    normalized === "other"
  ) {
    return normalized
  }

  return null
}

export function contactTypeToSlug(
  type: ContactTypeValue,
  targetLang: ELang
): string {
  return targetLang === ELang.fi ? FI_CONTACT_VALUE_TO_SLUG[type] : type
}

export function localizePathname(pathname: string, targetLang: ELang): string {
  const { lang: currentLang, restPathname } = stripEnPrefix(pathname)
  const segments = restPathname.split("/").filter(Boolean)

  // Home
  if (segments.length === 0) {
    return getHomePath(targetLang)
  }

  const first = segments[0]

  // About
  if (first === "tietoa" || first === "about") {
    return getAboutPath(targetLang)
  }

  // Contact
  if (first === "yhteys" || first === "contact") {
    const typeSlug = segments[1]
    if (!typeSlug) return getContactPath(targetLang)

    // Try parsing using both the detected current lang and the raw slug
    const typeValue =
      parseContactTypeFromSlug(typeSlug, currentLang) ??
      parseContactTypeFromSlug(typeSlug, ELang.en) ??
      parseContactTypeFromSlug(typeSlug, ELang.fi)

    if (!typeValue) return getContactPath(targetLang)

    const targetSlug = contactTypeToSlug(typeValue, targetLang)
    return `${getContactPath(targetLang)}/${targetSlug}`
  }

  // Fallback: keep restPathname, only toggle /en prefix
  if (targetLang === ELang.en) {
    return restPathname === "/" ? "/en" : `/en${restPathname}`
  }

  return restPathname
}

export function parseContactTypeFromPathname(pathname: string): {
  lang: ELang
  type: ContactTypeValue | null
} {
  const { lang, restPathname } = stripEnPrefix(pathname)
  const segments = restPathname.split("/").filter(Boolean)

  const first = segments[0]
  if (first !== "yhteys" && first !== "contact") {
    return { lang, type: null }
  }

  const typeSlug = segments[1]
  if (!typeSlug) return { lang, type: null }

  return { lang, type: parseContactTypeFromSlug(typeSlug, lang) }
}
