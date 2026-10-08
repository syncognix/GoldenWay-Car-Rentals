/**
 * Media registry — drop-in, zero-config.
 *
 * Files placed in these folders are discovered at build time by name:
 *
 *   (<key> is a page key below, or `vehicle-<slug>` for a single vehicle)
 *
 *   src/media/videos/<key>.webm          preferred desktop source
 *   src/media/videos/<key>.mp4           desktop fallback
 *   src/media/videos/<key>-mobile.mp4    optional portrait/lightweight source (≤ 767px)
 *   src/media/posters/<key>.(avif|webp|jpg|png)   first frame / LCP image
 *   src/media/images/<name>.(avif|webp|jpg|png)   editorial imagery
 *   src/media/fleet/<vehicle-slug>/*.(avif|webp|jpg|png)   vehicle photos
 *
 * Anything missing falls back gracefully (poster → procedural backdrop), and
 * because only existing files are referenced, nothing ever 404s.
 */

type UrlMap = Record<string, string>

const videoFiles = import.meta.glob('./videos/*.{mp4,webm}', { eager: true, query: '?url', import: 'default' }) as UrlMap
const posterFiles = import.meta.glob('./posters/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as UrlMap
const imageFiles = import.meta.glob('./images/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as UrlMap
const fleetFiles = import.meta.glob('./fleet/*/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as UrlMap

/** Every page hero and cinematic surface has its own key. */
export type MediaKey =
  | 'home-hero'
  | 'fleet-hero'
  | 'vehicle-hero'
  | 'booking-hero'
  | 'how-it-works-hero'
  | 'about-hero'
  | 'why-hero'
  | 'locations-hero'
  | 'gallery-hero'
  | 'reviews-hero'
  | 'faq-hero'
  | 'contact-hero'
  | 'policies-hero'
  | 'not-found-hero'
  | 'atlanta'
  | 'final-cta'

/** Any page key, or a per-vehicle key such as `vehicle-toyota-camry`. */
export type HeroKey = MediaKey | `vehicle-${string}`

export type VideoSources = {
  webm?: string
  mp4?: string
  mobileMp4?: string
}

export type HeroMediaSet = {
  video?: VideoSources
  poster?: string
}

const stem = (path: string) => path.split('/').pop()!.replace(/\.[^.]+$/, '')

const byStem = (files: UrlMap) => {
  const out: Record<string, string> = {}
  // Prefer modern formats when several share a name.
  const rank = (p: string) => ['avif', 'webp', 'jpg', 'jpeg', 'png'].indexOf(p.split('.').pop()!.toLowerCase())
  for (const path of Object.keys(files).sort((a, b) => rank(a) - rank(b))) {
    const s = stem(path)
    if (!out[s]) out[s] = files[path]
  }
  return out
}

const posters = byStem(posterFiles)
const images = byStem(imageFiles)

const videos = Object.entries(videoFiles).reduce<Record<string, VideoSources>>((acc, [path, url]) => {
  const name = path.split('/').pop()!
  const isMobile = /-mobile\.mp4$/.test(name)
  const key = name.replace(/-mobile\.mp4$/, '').replace(/\.(mp4|webm)$/, '')
  const entry = (acc[key] ??= {})
  if (isMobile) entry.mobileMp4 = url
  else if (name.endsWith('.webm')) entry.webm = url
  else entry.mp4 = url
  return acc
}, {})

export function getHeroMedia(key: HeroKey): HeroMediaSet {
  const video = videos[key]
  const hasVideo = Boolean(video && (video.webm || video.mp4 || video.mobileMp4))
  // Reuse the original site's artwork only for these below-the-fold sections.
  const sectionPoster = key === 'atlanta' || key === 'final-cta' ? images['goldenway-original'] : undefined
  return { video: hasVideo ? video : undefined, poster: posters[key] ?? sectionPoster }
}

export function getImage(name: string): string | undefined {
  return images[name]
}

/** Local vehicle photos (sorted by filename), if any were supplied. */
export function getLocalFleetImages(slug: string): string[] {
  return Object.keys(fleetFiles)
    .filter((p) => p.startsWith(`./fleet/${slug}/`))
    .sort()
    .map((p) => fleetFiles[p])
}
