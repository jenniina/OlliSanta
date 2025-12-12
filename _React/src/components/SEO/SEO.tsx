import { Helmet } from "react-helmet-async"
import { DEFAULT_OG_IMAGE, SITE_NAME } from "./constants"
import type { SEOProps } from "./types"

export default function SEO({
  title,
  description,
  canonical,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SEOProps) {
  const defaultOgUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://ollisanta.fi"

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={ogTitle ?? title} />
      <meta property="og:description" content={ogDescription ?? description} />
      <meta property="og:image" content={ogImage ?? DEFAULT_OG_IMAGE} />
      <meta property="og:url" content={ogUrl ?? defaultOgUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle ?? ogTitle ?? title} />
      <meta
        name="twitter:description"
        content={twitterDescription ?? ogDescription ?? description}
      />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    </Helmet>
  )
}
