import { useParams } from 'react-router'
import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { VehicleGallery } from '../components/fleet/VehicleGallery'
import { VehicleCard } from '../components/fleet/VehicleCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { TechLabel } from '../components/ui/TechLabel'
import { FinalCta } from '../components/sections/FinalCta'
import { categoryLabels, getVehicle, vehicleName, vehicles, type Vehicle } from '../data/vehicles'
import { pickupPoints } from '../data/locations'
import { breadcrumbSchema, vehicleSchema } from '../config/schema'
import { formatCurrency, site } from '../config/site'
import { vehicleCover } from '../lib/vehicleImages'
import { getHeroMedia } from '../media'
import NotFoundPage from './NotFoundPage'
import './VehiclePage.css'

const t = site.terms

function specRows(v: Vehicle) {
  return [
    ['Make', v.make],
    ['Model', v.model],
    v.year ? ['Year', String(v.year)] : null,
    v.color ? ['Colour', v.color] : null,
    ['Class', categoryLabels[v.category]],
    ['Seats', String(v.seats)],
    ['Doors', String(v.doors)],
    ['Air conditioning', v.airConditioning ? 'Yes' : 'No'],
    v.fuel ? ['Powertrain', v.fuel] : null,
    ['Weekly rate', `From ${formatCurrency(v.weeklyRate ?? t.weeklyRateFrom)}`],
  ].filter((r): r is [string, string] => Boolean(r))
}

const included = [
  { icon: 'shield', title: 'Insurance included', body: `Vehicle insured · ${formatCurrency(t.damageDeductible)} deductible` },
  { icon: 'infinity', title: 'Unlimited miles', body: 'No mileage limits, within Georgia' },
  { icon: 'key', title: 'No deposit', body: 'No security deposit, no credit check' },
  { icon: 'car', title: 'Gig approved', body: t.gigPlatforms.slice(0, 4).join(' · ') },
  { icon: 'spark', title: 'Maintenance covered', body: 'Required maintenance handled by GoldenWay' },
  { icon: 'calendar', title: `${t.minimumDays}-day minimum`, body: 'Weekly & monthly · extensions on request' },
] as const

export default function VehiclePage() {
  const { slug } = useParams()
  const v = getVehicle(slug)
  if (!v) return <NotFoundPage />

  const name = vehicleName(v)
  const idx = vehicles.indexOf(v)
  const cover = vehicleCover(v)
  const related = [...vehicles.filter((x) => x !== v && x.category === v.category), ...vehicles.filter((x) => x !== v && x.category !== v.category)].slice(0, 3)
  const bookHref = `/book?vehicle=${v.slug}`
  const ownKey = `vehicle-${v.slug}` as const
  const own = getHeroMedia(ownKey)
  const heroKey = own.video || own.poster ? ownKey : 'vehicle-hero'

  return (
    <>
      <Seo
        title={`${name} — Weekly Rental in Atlanta`}
        description={`Rent the ${name} in Atlanta from ${formatCurrency(v.weeklyRate ?? t.weeklyRateFrom)}/week. No deposit, insurance included, unlimited miles. Rideshare and delivery approved.`}
        image={cover?.startsWith('http') ? cover : undefined}
        jsonLd={[
          vehicleSchema(v, cover?.startsWith('http') ? cover : undefined),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Fleet', path: '/fleet' },
            { name, path: `/fleet/${v.slug}` },
          ]),
        ]}
      />

      <PageHero
        mediaKey={heroKey}
        backdrop="road"
        seed={idx + 40}
        fallbackImage={cover}
        fallbackAlt={name}
        size="full"
        index={`${String(idx + 1).padStart(2, '0')} / ${String(vehicles.length).padStart(2, '0')}`}
        eyebrow={`${categoryLabels[v.category]}${v.year ? ` · ${v.year}` : ''}`}
        title={[v.make, <span className="t-serif-i c-gold">{v.color ? `${v.color} ${v.model}` : v.model}</span>]}
        intro={v.tagline}
        actions={
          <>
            <Button to={bookHref} size="lg" magnetic>
              Book this vehicle
            </Button>
            <Button href={site.phone.href} variant="glass" size="lg" leadingIcon="phone" icon={null}>
              {site.phone.display}
            </Button>
          </>
        }
        meta={
          <div className="vehicle-hero-rate">
            <span className="t-mono">Weekly from</span>
            <span className="t-num">{formatCurrency(v.weeklyRate ?? t.weeklyRateFrom)}</span>
          </div>
        }
      />

      {/* Overview + specs */}
      <section className="section" data-chapter="Specification" aria-labelledby="spec-title">
        <div className="container vehicle-overview">
          <div className="vehicle-overview__intro">
            <TechLabel index="01">Specification</TechLabel>
            <h2 id="spec-title" className="t-h2">
              The <span className="t-serif-i">details.</span>
            </h2>
            <p className="t-body">
              Specifications as listed for this vehicle. Availability changes week to week — our team confirms your car when you book.
            </p>
            <Button to={bookHref} variant="text">
              Request this vehicle
            </Button>
          </div>
          <Reveal kind="up" as="dl" className="spec-sheet">
            {specRows(v).map(([k, val]) => (
              <div key={k} className="spec-sheet__row">
                <dt className="t-mono">{k}</dt>
                <dd>{val}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="section section--tight" data-chapter="Gallery" aria-labelledby="vgal-title">
        <div className="container">
          <SectionHeading index="02" label="Gallery" id="vgal-title" lines={[<>In <span className="t-serif-i">focus.</span></>]} />
          <VehicleGallery vehicle={v} />
        </div>
      </section>

      {/* Included */}
      <section className="section" data-chapter="Included" aria-labelledby="incl-title">
        <div className="container">
          <SectionHeading index="03" label="Included" id="incl-title" lines={['With every', <span className="t-serif-i">rental.</span>]} />
          <ul role="list" className="included-grid">
            {included.map((it, i) => (
              <Reveal as="li" key={it.title} kind="up" delay={i * 60} className="included-grid__item">
                <Icon name={it.icon} size={26} className="c-gold" />
                <h3 className="t-h4">{it.title}</h3>
                <p className="t-small">{it.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Rental information */}
      <section className="section section--tight rental-info" data-chapter="Rental info" aria-labelledby="rinfo-title">
        <div className="container rental-info__grid">
          <div>
            <TechLabel index="04">Rental information</TechLabel>
            <h2 id="rinfo-title" className="t-h3 rental-info__title">
              What you’ll need
            </h2>
          </div>
          <ul role="list" className="rental-info__list">
            <li>A valid, non-expired driver’s license.</li>
            <li>
              Minimum age {t.minimumAge}. Renters {t.youngDriverAge}–{t.minimumAge - 1} are subject to verification and an additional fee.
            </li>
            <li>A valid payment method — debit cards and all major credit cards accepted.</li>
            <li>
              Pickup at {pickupPoints.map((p) => p.area).join(', ')} — confirmed with you by our team.
            </li>
          </ul>
          <div className="rental-info__links">
            <Button to="/policies" variant="text">
              Rental policies
            </Button>
            <Button to="/faq" variant="text">
              FAQ
            </Button>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section" data-chapter="More vehicles" aria-labelledby="related-title">
        <div className="container">
          <SectionHeading
            index="05"
            label="More from the fleet"
            id="related-title"
            lines={['You may also', <span className="t-serif-i">like.</span>]}
            aside={
              <Button to="/fleet" variant="text">
                All vehicles
              </Button>
            }
          />
          <ul role="list" className="related-grid">
            {related.map((r) => (
              <li key={r.slug}>
                <VehicleCard vehicle={r} index={vehicles.indexOf(r)} total={vehicles.length} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta index="06" lines={['Make it', <span className="t-serif-i c-gold">yours.</span>]} />
    </>
  )
}
