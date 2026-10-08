import { useRef } from 'react'
import { Link } from 'react-router'
import { vehicles, vehicleName, vehicleSpecList, categoryLabels, type Vehicle } from '../../data/vehicles'
import { formatCurrency, site } from '../../config/site'
import { Button } from '../ui/Button'
import { TechLabel } from '../ui/TechLabel'
import { SplitLines } from '../ui/Reveal'
import { VehicleImage } from './VehicleImage'
import { useGsap } from '../../hooks/useGsap'
import { gsap } from '../../lib/gsap'
import './FleetShowcase.css'

const pad = (n: number) => String(n).padStart(2, '0')

/** The four cars with the strongest studio plates lead the campaign. */
const FEATURED = ['toyota-camry-2015', 'ford-escape', 'toyota-camry-hybrid-2014', 'ford-fusion']

/** Pinned horizontal travel only where there is room and motion is welcome. */
const PIN = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

/**
 * "Your next drive" — a horizontal campaign of studio plates. Vertical scroll
 * drives the track on desktop (GSAP pin); each car and its outlined model name
 * drift at different rates for depth. Touch screens and reduced-motion users
 * get a native swipe rail with snap points.
 */
export function FleetShowcase() {
  const ref = useRef<HTMLElement>(null)
  const featured = FEATURED.map((slug) => vehicles.find((v) => v.slug === slug)).filter((v): v is Vehicle => Boolean(v))
  const total = featured.length

  useGsap(
    ref,
    ({ mm, scope }) => {
      mm.add(PIN, () => {
        const track = scope.querySelector<HTMLElement>('.fleet-show__track')
        const bar = scope.querySelector<HTMLElement>('.fleet-show__bar')
        if (!track) return
        const distance = () => track.scrollWidth - window.innerWidth
        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => bar?.style.setProperty('--p', self.progress.toFixed(4)),
          },
        })
        scope.querySelectorAll<HTMLElement>('.fleet-plate').forEach((plate) => {
          const st = { trigger: plate, containerAnimation: travel, start: 'left right', end: 'right left', scrub: true }
          gsap.fromTo(plate.querySelector('.fleet-plate__car'), { xPercent: 9 }, { xPercent: -9, ease: 'none', scrollTrigger: st })
          gsap.fromTo(plate.querySelector('.fleet-plate__ghost'), { xPercent: -14 }, { xPercent: 10, ease: 'none', scrollTrigger: st })
        })
      })
    },
    [total],
  )

  return (
    <section ref={ref} className="fleet-show surface-dark" data-chapter="Fleet" aria-labelledby="fleet-show-title">
      <div className="fleet-show__viewport">
        <div className="fleet-show__track">
          <div className="fleet-show__intro">
            <TechLabel index="02" glitch>
              The fleet
            </TechLabel>
            <SplitLines id="fleet-show-title" className="fleet-show__title" lines={['Your', 'next', <span className="t-serif-i c-gold">drive.</span>]} />
            <div className="fleet-show__intro-foot">
              <p className="t-lead">
                Rented by the week, with insurance included, unlimited miles and approval for rideshare and delivery.
              </p>
              <Button to="/fleet" variant="outline">
                View the full fleet
              </Button>
            </div>
          </div>

          {featured.map((v, i) => (
            <FleetPlate key={v.slug} vehicle={v} index={i} total={total} />
          ))}

          <div className="fleet-show__end">
            <p className="t-mono c-muted">{pad(vehicles.length)} vehicles in the fleet</p>
            <p className="fleet-show__end-title t-serif">
              Sedans, an SUV, <span className="t-serif-i c-gold">a hybrid.</span>
            </p>
            <Button to="/fleet" magnetic>
              Browse the full fleet
            </Button>
          </div>
        </div>
      </div>
      <div className="fleet-show__progress container" aria-hidden="true">
        <span className="t-mono">Scroll to drive</span>
        <span className="fleet-show__bar" />
        <span className="t-mono">{pad(total)} featured</span>
      </div>
    </section>
  )
}

function FleetPlate({ vehicle: v, index, total }: { vehicle: Vehicle; index: number; total: number }) {
  const href = `/fleet/${v.slug}`
  const specs = vehicleSpecList(v)
  return (
    <article className="fleet-plate" aria-labelledby={`fp-${v.slug}`}>
      <header className="fleet-plate__head t-mono">
        <span>
          <span className="c-gold">{pad(index + 1)}</span> / {pad(total)}
        </span>
        <span className="fleet-plate__cat">{categoryLabels[v.category]}</span>
      </header>

      <Link to={href} className="fleet-plate__stage" data-cursor="view" tabIndex={-1} aria-hidden="true">
        <span className="fleet-plate__ghost" aria-hidden="true">
          {v.model}
        </span>
        <span className="fleet-plate__floor" aria-hidden="true" />
        <span className="fleet-plate__car">
          <VehicleImage vehicle={v} />
        </span>
      </Link>

      <footer className="fleet-plate__foot">
        <div className="fleet-plate__id">
          <p className="t-mono fleet-plate__make">
            {v.year ? `${v.year} · ` : ''}
            {v.make}
          </p>
          <h3 id={`fp-${v.slug}`} className="fleet-plate__name">
            <Link to={href} className="fleet-plate__link" aria-label={`View ${vehicleName(v)}`}>
              {v.color ? `${v.color} ` : ''}
              {v.model}
            </Link>
          </h3>
          <p className="fleet-plate__tagline">{v.tagline}</p>
        </div>
        <ul className="fleet-plate__specs t-mono" role="list" aria-label="Specifications">
          {specs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="fleet-plate__rate">
          <span className="t-mono">Weekly from</span>
          <span className="fleet-plate__price t-num">{formatCurrency(v.weeklyRate ?? site.terms.weeklyRateFrom)}</span>
          <span className="fleet-plate__cta" aria-hidden="true">
            View vehicle <span className="fleet-plate__arrow">→</span>
          </span>
        </div>
      </footer>
    </article>
  )
}
