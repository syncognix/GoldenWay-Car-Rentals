import { useEffect, useRef } from 'react'
import { useGsap, MOTION_DESKTOP } from '../../hooks/useGsap'
import { gsap } from '../../lib/gsap'
import { Reveal, SplitLines } from '../ui/Reveal'
import { TechLabel } from '../ui/TechLabel'
import { Button } from '../ui/Button'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import camrySide from '../../media/lot/lot-camry-side.webm'
import camrySidePoster from '../../media/lot/lot-camry-side.jpg'
import impreza from '../../media/lot/lot-impreza.webm'
import imprezaPoster from '../../media/lot/lot-impreza.jpg'
import camryHood from '../../media/lot/lot-camry-hood.webm'
import camryHoodPoster from '../../media/lot/lot-camry-hood.jpg'
import imprezaCabin from '../../media/lot/lot-impreza-cabin.webm'
import imprezaCabinPoster from '../../media/lot/lot-impreza-cabin.jpg'
import './OnTheLot.css'

type Clip = { src: string; poster: string; car: string; shot: string }

// Real footage from GoldenWay's own reels (see src/media/lot/SOURCE.md).
const clips: Clip[] = [
  { src: camrySide, poster: camrySidePoster, car: 'Toyota Camry', shot: 'Walk-around' },
  { src: impreza, poster: imprezaPoster, car: '2020 Subaru Impreza', shot: 'Pickup ready' },
  { src: camryHood, poster: camryHoodPoster, car: 'Toyota Camry', shot: 'Front detail' },
  { src: imprezaCabin, poster: imprezaCabinPoster, car: '2020 Subaru Impreza', shot: 'Rear cabin' },
]

/**
 * "On the lot" — GoldenWay's own cars, from its own footage, as a row of slow-motion
 * portrait loops. Clips only play while on screen; reduced-motion users get
 * the still frames.
 */
/** Parallax depth per clip — the collage separates into layers as it scrolls. */
const DEPTH = [-6, 14, -12, 22]

export function OnTheLot() {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ mm, scope }) => {
    mm.add(MOTION_DESKTOP, () => {
      scope.querySelectorAll<HTMLElement>('.lot__item').forEach((item, i) => {
        gsap.fromTo(
          item,
          { yPercent: DEPTH[i % DEPTH.length] },
          { yPercent: -DEPTH[i % DEPTH.length], ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
        gsap.fromTo(
          item.querySelector('.lot-clip__frame'),
          { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.4, ease: 'expo.out', delay: (i % 2) * 0.12, scrollTrigger: { trigger: item, start: 'top 88%', once: true } },
        )
      })
      gsap.fromTo('.lot__ghost', { xPercent: 6 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: scope, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
  })

  return (
    <section ref={ref} className="lot surface-dark" aria-labelledby="lot-title">
      <span className="lot__ghost" aria-hidden="true">
        On the lot
      </span>
      <div className="container">
        <header className="lot__head">
          <div className="lot__title-wrap">
            <Reveal kind="fade">
              <TechLabel dot>On the lot · Atlanta</TechLabel>
            </Reveal>
            <SplitLines
              id="lot-title"
              className="lot__title"
              lines={['Real cars.', <span className="t-serif-i c-gold">No stand-ins.</span>]}
            />
          </div>
          <Reveal kind="blur" delay={160} className="lot__intro">
            <p className="t-lead">
              Straight from our own footage: GoldenWay cars filmed in Atlanta, just as they are. No studio, no stock video.
            </p>
            <Button to="/fleet" variant="outline">
              See what’s available
            </Button>
          </Reveal>
        </header>

        <ul className="lot__rail" role="list">
          {clips.map((clip, i) => (
            <li key={clip.src} className="lot__item" style={{ ['--i' as string]: i }}>
              <LotClip clip={clip} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function LotClip({ clip, index }: { clip: Clip; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [reduced])

  return (
    <figure className="lot-clip">
      <div className="lot-clip__frame">
        <video
          ref={videoRef}
          className="lot-clip__video"
          src={reduced ? undefined : clip.src}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${clip.car} — ${clip.shot.toLowerCase()}, GoldenWay footage`}
        />
        <span className="lot-clip__rec t-mono" aria-hidden="true">
          <span className="lot-clip__dot" />
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <figcaption className="lot-clip__cap">
        <span>{clip.car}</span>
        <span className="t-mono c-muted">{clip.shot}</span>
      </figcaption>
    </figure>
  )
}
