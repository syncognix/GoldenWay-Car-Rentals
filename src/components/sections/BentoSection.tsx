import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { SectionHeading } from '../ui/SectionHeading'
import { TechLabel } from '../ui/TechLabel'
import { Icon } from '../ui/Icon'
import { LiquidGlassCard } from '../glass/Glass'
import { CinematicBackdrop } from '../media/CinematicBackdrop'
import { site, formatCurrency } from '../../config/site'
import { pickupPoints } from '../../data/locations'
import { useReveal } from '../../hooks/useReveal'
import { LazyCamryModel } from '../three/LazyCamryModel'
import './BentoSection.css'

const t = site.terms

export function BentoSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  useReveal(gridRef, { threshold: 0.08 })
  const d = (i: number) => ({ '--reveal-delay': `${i * 80}ms` }) as CSSProperties

  return (
    <section className="bento section" data-chapter="Benefits" aria-labelledby="bento-title">
      <div className="container">
        <SectionHeading
          index="03"
          label="Why it works"
          id="bento-title"
          lines={[
            'Premium service.',
            <>
              <span className="t-serif-i">Everyday</span> price.
            </>,
          ]}
          intro="Everything that matters for a week on the road, included from the start — and nothing hidden in the fine print."
        />

        <div ref={gridRef} className="bento__grid">
          {/* A — hero card with 3D Camry */}
          <article className="bento__card bento__card--a surface-dark" data-reveal="up" style={d(0)}>
            <div className="bento__car-art" aria-hidden="true">
              <LazyCamryModel />
            </div>
            <div className="bento__a-copy">
              <TechLabel index="A">Weekly rate</TechLabel>
              <p className="bento__big">
                <span className="bento__from t-mono">From</span>
                <span className="t-num">{formatCurrency(t.weeklyRateFrom)}</span>
                <span className="bento__per">/week</span>
              </p>
              <p className="bento__text">Weekly and monthly terms with a {t.minimumDays}-day minimum. Clean, maintained vehicles, ready for the road.</p>
            </div>
          </article>

          {/* B — no deposit */}
          <LiquidGlassCard as="article" className="bento__card bento__card--b" data-reveal="up" style={d(1)}>
            <TechLabel index="B">Deposit</TechLabel>
            <p className="bento__stat t-num">$0</p>
            <p className="bento__text">No security deposit. No credit check.</p>
          </LiquidGlassCard>

          {/* C — unlimited miles */}
          <LiquidGlassCard as="article" className="bento__card bento__card--c" data-reveal="up" style={d(2)}>
            <TechLabel index="C">Mileage</TechLabel>
            <Icon name="infinity" size={64} className="bento__infinity" />
            <p className="bento__text">Unlimited miles on every rental.</p>
          </LiquidGlassCard>

          {/* D — gig platforms */}
          <article className="bento__card bento__card--d" data-reveal="up" style={d(3)}>
            <TechLabel index="D">Approved for</TechLabel>
            <div className="bento__marquee" aria-label={`Approved for ${t.gigPlatforms.join(', ')}`}>
              <div className="bento__marquee-track" aria-hidden="true">
                {[...t.gigPlatforms, ...t.gigPlatforms].map((p, i) => (
                  <span key={`${p}-${i}`}>
                    {p}
                    <i />
                  </span>
                ))}
              </div>
            </div>
            <p className="bento__text">Rideshare and delivery approved. Uber and Lyft drivers use the platform-required insurance while driving for them.</p>
          </article>

          {/* E — insurance, over a cinematic scene */}
          <article className="bento__card bento__card--e surface-dark" data-reveal="up" style={d(4)}>
            <CinematicBackdrop variant="horizon" seed={5} />
            <div className="bento__e-copy">
              <TechLabel index="E">Coverage</TechLabel>
              <p className="bento__headline">Insurance included.</p>
              <p className="bento__text">
                {formatCurrency(t.damageDeductible)} deductible · optional Collision Damage Waiver · optional roadside assistance.
              </p>
            </div>
          </article>

          {/* F — pickup points */}
          <article className="bento__card bento__card--f" data-reveal="up" style={d(5)}>
            <TechLabel index="F">Pickup points</TechLabel>
            <ul role="list" className="bento__points">
              {pickupPoints.map((p) => (
                <li key={p.id}>
                  <span className="bento__dot" aria-hidden="true" />
                  <span>
                    {p.area}
                    <small>{p.name}</small>
                  </span>
                </li>
              ))}
            </ul>
            <Link to="/locations" className="bento__link">
              Locations <Icon name="arrowUpRight" size={14} />
            </Link>
          </article>

          {/* G — booking */}
          <article className="bento__card bento__card--g" data-reveal="up" style={d(6)}>
            <TechLabel index="G">Booking</TechLabel>
            <ol className="bento__steps" role="list">
              {['Vehicle', 'Dates', 'Details', 'Confirm'].map((s, i) => (
                <li key={s}>
                  <span className="t-mono c-gold">0{i + 1}</span> {s}
                </li>
              ))}
            </ol>
            <Link to="/how-it-works" className="bento__link">
              How it works <Icon name="arrowUpRight" size={14} />
            </Link>
          </article>

          {/* H — support */}
          <article className="bento__card bento__card--h" data-reveal="up" style={d(7)}>
            <TechLabel index="H" dot>
              Support
            </TechLabel>
            <a href={site.phone.href} className="bento__phone t-num">
              {site.phone.display}
            </a>
            <p className="bento__text">
              {site.hours[0].days} · {site.hours[0].label}
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
