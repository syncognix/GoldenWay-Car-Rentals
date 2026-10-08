import { useRef, type ReactNode } from 'react'
import { HeroMedia } from '../media/HeroMedia'
import { SplitLines, Reveal } from '../ui/Reveal'
import { TechLabel } from '../ui/TechLabel'
import { Button } from '../ui/Button'
import { site } from '../../config/site'
import camryImage from '../../media/fleet/toyota-camry-2015/01.webp'
import { useGsap, MOTION_ANY } from '../../hooks/useGsap'
import { gsap } from '../../lib/gsap'
import './FinalCta.css'

type Props = {
  index?: string
  lines?: ReactNode[]
}

/** Cinematic closing call-to-action, shared across pages. */
export function FinalCta({
  index = '06',
  lines = [
    'Where will',
    <>
      you go <span className="t-serif-i c-gold">next?</span>
    </>,
  ],
}: Props) {
  const ref = useRef<HTMLElement>(null)

  // The car pulls up into frame as the section scrolls in.
  useGsap(ref, ({ mm }) => {
    mm.add(MOTION_ANY, () => {
      gsap.fromTo(
        '.final-cta__car',
        { xPercent: 26, yPercent: 8, scale: 0.9 },
        { xPercent: 0, yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'center center', scrub: 0.8 } },
      )
    })
  })

  return (
    <section ref={ref} className="final-cta surface-dark" data-chapter="Book" aria-labelledby="final-cta-title">
      <HeroMedia mediaKey="final-cta" backdrop="tunnel" seed={33} tint="deep" />
      <div className="final-cta__stage" aria-hidden="true">
        <span className="final-cta__floor" />
        <img className="final-cta__car" src={camryImage} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="final-cta__inner container">
        <TechLabel index={index} dot>
          Ready when you are
        </TechLabel>
        <SplitLines id="final-cta-title" className="final-cta__title" lines={lines} />
        <Reveal kind="up" delay={200} className="final-cta__actions">
          <Button to="/book" size="lg" magnetic>
            Book your GoldenWay
          </Button>
          <Button href={site.phone.href} variant="glass" size="lg" leadingIcon="phone" icon={null}>
            Call {site.phone.display}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
