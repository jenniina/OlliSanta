export interface SEOProps {
  title: string
  description: string
  canonical?: string
  keywords?: string[]
  alternates?: Array<{ hrefLang: string; href: string }>
  xDefault?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
}
