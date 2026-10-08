import { useRef } from 'react'
import { HeroMedia } from '../media/HeroMedia'
import { SplitLines, Reveal } from '../ui/Reveal'
import { TechLabel } from '../ui/TechLabel'
import { Button } from '../ui/Button'
import { ReededGlassPanel } from '../glass/Glass'
import { addressLines, coordinates, mapsLinks, site } from '../../config/site'
import { pickupPoints } from '../../data/locations'
import { useGsap, MOTION_ANY } from '../../hooks/useGsap'
import { gsap } from '../../lib/gsap'
import './AtlantaSection.css'

/** "Atlanta, your way." — full-bleed city scene with address and pickup points. */
export function AtlantaSection() {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ mm }) => {
    mm.add(MOTION_ANY, () => {
      gsap.fromTo(
        '.atl__media',
        { yPercent: -10, scale: 1.1 },
        { yPercent: 10, scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.fromTo(
        '.atl__veil',
        { opacity: 0.85 },
        { opacity: 0.2, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'top 10%', scrub: true } },
      )
    })
  })

  return (
    <section ref={ref} className="atl surface-dark" data-chapter="Atlanta" aria-labelledby="atl-title">
      <div className="atl__media">
        <HeroMedia mediaKey="atlanta" backdrop="city" seed={21} tint="soft" />
      </div>
      <div className="atl__veil" aria-hidden="true" />

      <div className="atl__inner container">
        <div className="atl__head">
          <TechLabel index="05">{coordinates}</TechLabel>
          <SplitLines
            id="atl-title"
            className="atl__title"
            lines={[
              'Atlanta,',
              <>
                <span className="t-serif-i c-gold">your</span> way.
              </>,
            ]}
          />
        </div>

        <Reveal kind="up" className="atl__card-wrap">
          <ReededGlassPanel className="atl__card">
            <div className="atl__block">
              <span className="t-mono c-muted">Office</span>
              <p className="atl__addr">
                {addressLines.line1}
                <br />
                {addressLines.line2}
              </p>
              <p className="t-small">
                {site.hours[0].days}, {site.hours[0].label}
              </p>
            </div>
            <div className="atl__block">
              <span className="t-mono c-muted">Pickup points</span>
              <ul role="list" className="atl__points">
                {pickupPoints.map((p) => (
                  <li key={p.id}>
                    <span>{p.area}</span>
                    <span className="c-muted">{p.name}</span>
                  </li>
                ))}
              </ul>
              <p className="t-small">Pickup point confirmed with you by our team.</p>
            </div>
            <div className="atl__actions">
              <Button href={mapsLinks.directions} icon="arrowUpRight">
                Get directions
              </Button>
              <Button to="/locations" variant="glass">
                All locations
              </Button>
            </div>
          </ReededGlassPanel>
        </Reveal>
      </div>
    </section>
  )
}
