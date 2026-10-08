import { useRef } from 'react'
import { SplitLines, Reveal } from '../ui/Reveal'
import { TechLabel } from '../ui/TechLabel'
import { Button } from '../ui/Button'
import { TermsGrid } from './TermsGrid'
import { brandStory } from '../../data/services'
import automotiveImage from '../../media/images/goldenway-original.webp'
import { useGsap, MOTION_DESKTOP } from '../../hooks/useGsap'
import { gsap } from '../../lib/gsap'
import './IntroSection.css'

export function IntroSection() {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ mm }) => {
    mm.add(MOTION_DESKTOP, () => {
      gsap.fromTo(
        '.intro__media-inner',
        { yPercent: -8, scale: 1.12 },
        { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '.intro__media', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    })
  })

  return (
    <section ref={ref} className="intro section" data-chapter="Journey" aria-labelledby="intro-title">
      <div className="container">
        <div className="intro__top">
          <TechLabel index="01" glitch>
            The GoldenWay standard
          </TechLabel>
          <SplitLines
            id="intro-title"
            className="intro__title t-display"
            lines={[
              'Your journey',
              <>
                starts <span className="t-serif-i c-gold">here.</span>
              </>,
            ]}
          />
        </div>

        <div className="intro__grid">
          <Reveal kind="fade" className="intro__media">
            <div className="intro__media-inner">
              <img
                className="intro__photo"
                src={automotiveImage}
                alt="GoldenWay website artwork showing rental cars against the Atlanta skyline"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>

          <div className="intro__body">
            <Reveal kind="blur" as="p" className="intro__story t-serif">
              {brandStory.intro}
            </Reveal>
            <Reveal kind="up" delay={120} as="p" className="t-body">
              {brandStory.specialty}
            </Reveal>
            <TermsGrid />
            <Reveal kind="fade" delay={200}>
              <Button to="/why-goldenway" variant="text">
                Why drivers choose GoldenWay
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
