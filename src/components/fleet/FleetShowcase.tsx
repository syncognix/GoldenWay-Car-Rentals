import { Link } from 'react-router'
import { vehicles, vehicleName, categoryLabels } from '../../data/vehicles'
import { rateLabel, formatCurrency, site } from '../../config/site'
import { Button } from '../ui/Button'
import { TechLabel } from '../ui/TechLabel'
import { SplitLines } from '../ui/Reveal'
import { VehicleImage } from './VehicleImage'
import { VehicleSpecs } from './VehicleSpecs'
import './FleetShowcase.css'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * "Your next drive" — vertical scroll drives a horizontal editorial spread of
 * the fleet. Pinned with GSAP on desktop; native swipe + snap on touch/small
 * screens and for reduced-motion users.
 */
export function FleetShowcase() {
  const fleetVehicles = vehicles.slice(0, 2)
  const total = fleetVehicles.length

  return (
    <section className="fleet-show surface-dark" data-chapter="Fleet" aria-labelledby="fleet-show-title">
      <div className="fleet-show__viewport">
        <div className="fleet-show__track">
          <div className="fleet-show__intro">
            <TechLabel index="02" glitch>
              The fleet
            </TechLabel>
            <SplitLines id="fleet-show-title" className="fleet-show__title" lines={['Your', 'next', <span className="t-serif-i c-gold">drive.</span>]} />
            <p className="t-lead">
              Meet two cars from the fleet, with weekly rentals {rateLabel.toLowerCase()} and options for rideshare and delivery.
            </p>
            <Button to="/fleet" variant="outline">
              View the full fleet
            </Button>
          </div>

          {fleetVehicles.map((v, i) => (
            <article key={v.slug} className="fleet-panel" aria-labelledby={`fp-${v.slug}`}>
              <header className="fleet-panel__head">
                <span className="t-mono fleet-panel__num">
                  <span className="c-gold">{pad(i + 1)}</span> / {pad(total)}
                </span>
                <span className="t-mono c-muted">{categoryLabels[v.category]}</span>
              </header>

              <Link to={`/fleet/${v.slug}`} className="fleet-panel__img" data-cursor="view" tabIndex={-1} aria-hidden="true">
                <div className="fleet-panel__img-inner">
                  <VehicleImage vehicle={v} />
                </div>
              </Link>

              <div className="fleet-panel__body">
                <div>
                  <p className="t-mono fleet-panel__make">
                    {v.year ? `${v.year} · ` : ''}
                    {v.make}
                  </p>
                  <h3 id={`fp-${v.slug}`} className="fleet-panel__name">
                    {v.color ? `${v.color} ` : ''}
                    {v.model}
                  </h3>
                  <p className="fleet-panel__tagline">{v.tagline}</p>
                </div>
                <div className="fleet-panel__aside">
                  <VehicleSpecs vehicle={v} />
                  <p className="fleet-panel__rate">
                    <span className="t-mono c-muted">Weekly from</span>
                    <span className="fleet-panel__price t-num">{formatCurrency(v.weeklyRate ?? site.terms.weeklyRateFrom)}</span>
                  </p>
                  <Button to={`/fleet/${v.slug}`} variant="text" aria-label={`View ${vehicleName(v)}`}>
                    View vehicle
                  </Button>
                </div>
              </div>
            </article>
          ))}

          <div className="fleet-show__end">
            <p className="t-mono c-muted">There are few more</p>
            <p className="fleet-show__end-title t-serif">Explore More Ride</p>
            <Button to="/fleet" magnetic>
              Explore More Ride
            </Button>
          </div>
        </div>
      </div>
      <div className="fleet-show__progress container" aria-hidden="true">
        <span className="t-mono">Scroll to drive</span>
        <span className="fleet-show__bar" />
        <span className="t-mono">{pad(total)} vehicles</span>
      </div>
    </section>
  )
}
