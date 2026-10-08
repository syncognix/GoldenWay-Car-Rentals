import { useLocation } from 'react-router'
import { site } from '../../config/site'

type Props = {
  title: string
  description: string
  /** Override canonical path (defaults to the current pathname). */
  path?: string
  image?: string
  noindex?: boolean
  jsonLd?: object | object[]
}

/**
 * Per-page metadata. React 19 hoists <title>, <meta> and <link> into <head>.
 */
export function Seo({ title, description, path, image, noindex, jsonLd }: Props) {
  const { pathname } = useLocation()
  const canonical = `${site.url}${path ?? pathname}`.replace(/\/$/, '') || site.url
  const fullTitle = title.includes(site.shortName) ? title : `${title} — ${site.name}`
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {image && <meta property="og:image" content={image.startsWith('http') ? image : `${site.url}${image}`} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(b)}
        </script>
      ))}
    </>
  )
}
