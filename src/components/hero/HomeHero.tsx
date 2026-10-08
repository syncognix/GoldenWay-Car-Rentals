import { useRef, type CSSProperties } from 'react'
import { HeroMedia } from '../media/HeroMedia'
import { QuickBookPanel } from '../booking/QuickBookPanel'
import { Button } from '../ui/Button'
import { TechLabel } from '../ui/TechLabel'
import { site, rateLabel, formatCurrency } from '../../config/site'
import camryImage from '../../media/fleet/toyota-camry-2015/01.webp'
import { useGsap, MOTION_ANY } from '../../hooks/useGsap'
import { gsap } from '../../lib/gsap'
import './HomeHero.css'

export function HomeHero() {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ mm }) => {
    mm.add(MOTION_ANY, () => {
      const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.home-hero__media', { scale: 1.14, ease: 'none', scrollTrigger: st })
      // The car rolls forward and toward camera as the page leaves the hero.
      gsap.to('.home-hero__vehicle', { xPercent: -7, yPercent: 10, scale: 1.08, ease: 'none', scrollTrigger: st })
      gsap.to('.home-hero__callouts', { opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '35% top' } })
      gsap.to('.home-hero__tint', { opacity: 0.9, ease: 'none', scrollTrigger: st })
      gsap.to('.home-hero__line--1', { xPercent: -6, ease: 'none', scrollTrigger: st })
      gsap.to('.home-hero__line--3', { xPercent: 5, ease: 'none', scrollTrigger: st })
      gsap.to('.home-hero__copy', { yPercent: -10, opacity: 0.3, ease: 'none', scrollTrigger: st })
    })
  })

  return (
    <section ref={ref} className="home-hero surface-dark" data-chapter="Arrival" aria-labelledby="home-hero-title">
      <div className="home-hero__media">
        <HeroMedia mediaKey="home-hero" backdrop="road" seed={11} priority tint="medium" />
      </div>
      <div className="home-hero__tint" aria-hidden="true" />
      <div className="home-hero__vehicle" aria-hidden="true" style={{ '--car': `url(${camryImage})` } as CSSProperties}>
        <span className="home-hero__floor" />
        <img src={camryImage} alt="" fetchPriority="high" decoding="async" />
        <span className="home-hero__sheen" />
        <ul className="home-hero__callouts">
          <li className="home-hero__callout home-hero__callout--model">
            <span className="t-mono">Model</span>
            <span>2015 Toyota Camry</span>
          </li>
          <li className="home-hero__callout home-hero__callout--rate">
            <span className="t-mono">Weekly from</span>
            <span className="t-num">{formatCurrency(site.terms.weeklyRateFrom)}</span>
          </li>
          <li className="home-hero__callout home-hero__callout--cover">
            <span className="t-mono">Cover</span>
            <span>Insurance included</span>
          </li>
        </ul>
      </div>

      {/* Technical frame */}
      <div className="home-hero__frame container" aria-hidden="true">
        <span className="t-mono home-hero__frame-mid">Downtown Atlanta · Peachtree St.</span>
      </div>

      <div className="home-hero__inner container">
        <div className="home-hero__copy">
          <div className="home-hero__brand">
            <span className="home-hero__brand-name">GoldenWay</span>
            <TechLabel>Car Rentals · Atlanta</TechLabel>
          </div>

          <h1 id="home-hero-title" className="home-hero__title">
            <span className="home-hero__line home-hero__line--1">
              <span>Drive</span>
            </span>
            <span className="home-hero__line home-hero__line--2">
              <span className="t-serif-i">beyond</span>
            </span>
            <span className="home-hero__line home-hero__line--3">
              <span>
                Ordinary<span className="c-gold">.</span>
              </span>
            </span>
          </h1>

          <div className="home-hero__lede">
            <p className="t-lead">
              Weekly and monthly car rentals in Atlanta, Georgia. {rateLabel} — no deposit, insurance included, unlimited miles.
            </p>
            <div className="home-hero__actions">
              <Button to="/book" size="lg" magnetic>
                Book your ride
              </Button>
              <Button to="/fleet" variant="glass" size="lg">
                Explore the fleet
              </Button>
            </div>
          </div>
        </div>

        <div className="home-hero__panel">
          <QuickBookPanel />
        </div>
      </div>

      <div className="home-hero__scroll" aria-hidden="true">
        <span className="t-mono">Scroll</span>
        <span className="home-hero__scroll-line" />
      </div>
    </section>
  )
}
