import { useRef, type ReactNode } from 'react'
import type { HeroKey } from '../../media'
import type { BackdropVariant } from '../media/backdropVariants'
import { HeroMedia } from '../media/HeroMedia'
import { SplitLines } from '../ui/Reveal'
import { TechLabel } from '../ui/TechLabel'
import { useGsap, MOTION_ANY } from '../../hooks/useGsap'
import { gsap } from '../../lib/gsap'
import { coordinates } from '../../config/site'
import './PageHero.css'

type Props = {
  mediaKey: HeroKey
  backdrop?: BackdropVariant
  seed?: number
  eyebrow: string
  index?: string
  title: ReactNode[]
  intro?: ReactNode
  actions?: ReactNode
  /** Extra content pinned to the hero's lower-right (stats, meta). */
  meta?: ReactNode
  fallbackImage?: string
  fallbackAlt?: string
  size?: 'full' | 'tall' | 'medium'
  chapter?: string
}

/**
 * Cinematic video hero used by every inner page. On scroll the media scales
 * and darkens while the copy drifts up — a quiet parallax, not a show.
 */
export function PageHero({
  mediaKey,
  backdrop,
  seed,
  eyebrow,
  index,
  title,
  intro,
  actions,
  meta,
  fallbackImage,
  fallbackAlt,
  size = 'tall',
  chapter = 'Intro',
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ mm }) => {
    mm.add(MOTION_ANY, () => {
      const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.page-hero__media', { scale: 1.12, yPercent: 8, ease: 'none', scrollTrigger: st })
      gsap.to('.page-hero__shade', { opacity: 0.85, ease: 'none', scrollTrigger: st })
      gsap.to('.page-hero__content', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: st })
    })
  })

  return (
    <section ref={ref} className={`page-hero page-hero--${size} surface-dark`} data-chapter={chapter}>
      <div className="page-hero__media">
        <HeroMedia
          mediaKey={mediaKey}
          backdrop={backdrop}
          seed={seed}
          priority
          tint="deep"
          fallbackImage={fallbackImage}
          fallbackAlt={fallbackAlt}
        />
      </div>
      <div className="page-hero__shade" aria-hidden="true" />

      <div className="page-hero__frame container" aria-hidden="true">
        <span className="t-mono">{coordinates}</span>
        <span className="t-mono page-hero__rec">
          <span className="page-hero__rec-dot" /> Live · ATL
        </span>
      </div>

      <div className="page-hero__content container">
        <TechLabel index={index} className="page-hero__eyebrow">
          {eyebrow}
        </TechLabel>
        <SplitLines as="h1" immediate delay={250} className="page-hero__title t-h1" lines={title} />
        {intro && <p className="page-hero__intro t-lead">{intro}</p>}
        {actions && <div className="page-hero__actions">{actions}</div>}
      </div>
      {meta && <div className="page-hero__meta container">{meta}</div>}
    </section>
  )
}
