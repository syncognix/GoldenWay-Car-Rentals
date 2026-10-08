import { useEffect, useRef, useState } from 'react'
import { getHeroMedia, type HeroKey } from '../../media'
import { CinematicBackdrop } from './CinematicBackdrop'
import type { BackdropVariant } from './backdropVariants'
import './HeroMedia.css'

type Props = {
  mediaKey: HeroKey
  /** Procedural scene used when no poster/video exists yet. */
  backdrop?: BackdropVariant
  seed?: number
  /** An image to use before the procedural fallback (e.g. a vehicle photo). */
  fallbackImage?: string
  fallbackAlt?: string
  /** Above-the-fold heroes: poster is fetched with high priority (LCP). */
  priority?: boolean
  tint?: 'deep' | 'medium' | 'soft'
  className?: string
}

/** Autoplaying video is skipped for reduced motion and data-saver users. */
function canPlayVideo() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (conn?.saveData) return false
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return false
  return true
}

/**
 * Cinematic media layer: VIDEO → POSTER → FALLBACK IMAGE → PROCEDURAL BACKDROP.
 * The poster (or fallback) paints first and acts as the LCP element; the video
 * is only attached once the browser is idle, then fades in once it's playing.
 */
export function HeroMedia({
  mediaKey,
  backdrop = 'road',
  seed,
  fallbackImage,
  fallbackAlt = '',
  priority = false,
  tint = 'medium',
  className,
}: Props) {
  const media = getHeroMedia(mediaKey)
  const [allowVideo] = useState(canPlayVideo)
  const [attachVideo, setAttachVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const [fallbackFailed, setFallbackFailed] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const wantsVideo = Boolean(media.video) && allowVideo && !videoFailed

  // Defer the video until the first paint has settled.
  useEffect(() => {
    if (!wantsVideo) return
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void }
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setAttachVideo(true), { timeout: 1800 })
      return () => w.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(() => setAttachVideo(true), 600)
    return () => window.clearTimeout(id)
  }, [wantsVideo])

  // Pause offscreen to save battery and decode time.
  useEffect(() => {
    const el = wrapRef.current
    const video = videoRef.current
    if (!el || !video || !attachVideo) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) video.play().catch(() => undefined)
      else video.pause()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [attachVideo])

  const poster = !posterFailed ? media.poster : undefined
  const image = poster ?? (!fallbackFailed ? fallbackImage : undefined)
  const showVideo = wantsVideo && attachVideo

  return (
    <div ref={wrapRef} className={`hero-media hero-media--${tint} ${className ?? ''}`}>
      {image ? (
        <img
          className="hero-media__image"
          src={image}
          alt={poster ? '' : fallbackAlt}
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onError={() => (poster ? setPosterFailed(true) : setFallbackFailed(true))}
        />
      ) : (
        <CinematicBackdrop variant={backdrop} seed={seed} />
      )}

      {showVideo && media.video && (
        <video
          ref={videoRef}
          className={`hero-media__video ${videoReady ? 'is-ready' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onPlaying={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        >
          {media.video.mobileMp4 && <source src={media.video.mobileMp4} type="video/mp4" media="(max-width: 767px)" />}
          {media.video.webm && <source src={media.video.webm} type="video/webm" />}
          {media.video.mp4 && <source src={media.video.mp4} type="video/mp4" onError={() => setVideoFailed(true)} />}
        </video>
      )}

      <div className="hero-media__tint" aria-hidden="true" />
      <div className="hero-media__grain" aria-hidden="true">
        <div className="grain" />
      </div>
    </div>
  )
}
