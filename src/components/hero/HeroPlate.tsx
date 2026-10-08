import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import './HeroPlate.css'

/**
 * Real GoldenWay media composed into an inner-page hero: a portrait clip or
 * photo in a framed plate, a fanned stack of photos, or a studio line-up of
 * cutouts. Captions are plain labels — never claims.
 */
export type Plate =
  | { kind: 'clip'; src: string; poster: string; label: string; caption: string }
  | { kind: 'photo'; src: string; alt: string; label: string; caption: string }
  | { kind: 'stack'; photos: { src: string; alt: string }[]; label: string; caption: string }
  | { kind: 'lineup'; cars: { src: string; alt: string }[]; label: string; caption: string }

export function HeroPlate({ plate }: { plate: Plate }) {
  return (
    <figure className={`hero-plate hero-plate--${plate.kind}`}>
      <div className="hero-plate__stage">
        {plate.kind === 'clip' && <PlateClip src={plate.src} poster={plate.poster} />}
        {plate.kind === 'photo' && (
          <img className="hero-plate__media" src={plate.src} alt={plate.alt} decoding="async" fetchPriority="high" />
        )}
        {plate.kind === 'stack' &&
          plate.photos.map((p, i) => (
            <img key={p.src} className={`hero-plate__card hero-plate__card--${i + 1}`} src={p.src} alt={p.alt} decoding="async" />
          ))}
        {plate.kind === 'lineup' && (
          <>
            <span className="hero-plate__floor" aria-hidden="true" />
            {plate.cars.map((c, i) => (
              <img key={c.src} className={`hero-plate__car hero-plate__car--${i + 1}`} src={c.src} alt={c.alt} decoding="async" />
            ))}
          </>
        )}
      </div>
      <figcaption className="hero-plate__cap">
        <span className="t-mono hero-plate__label">
          <span className="hero-plate__dot" aria-hidden="true" />
          {plate.label}
        </span>
        <span className="t-mono">{plate.caption}</span>
      </figcaption>
    </figure>
  )
}

function PlateClip({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const v = ref.current
    if (!v || reduced) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? void v.play().catch(() => {}) : v.pause()), { threshold: 0.2 })
    io.observe(v)
    return () => {
      io.disconnect()
      v.pause()
    }
  }, [reduced])
  return (
    <video
      ref={ref}
      className="hero-plate__media"
      src={reduced ? undefined : src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  )
}
