import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { MapEmbed } from '../components/sections/MapEmbed'
import { LiquidGlassCard } from '../components/glass/Glass'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { TechLabel } from '../components/ui/TechLabel'
import { FinalCta } from '../components/sections/FinalCta'
import { office, pickupPoints } from '../data/locations'
import { site, mapsLinks } from '../config/site'
import { breadcrumbSchema, businessSchema } from '../config/schema'
import './LocationsPage.css'
import lotGray from '../media/images/lot-gray-camry.jpg'

export default function LocationsPage() {
  return (
    <>
      <Seo
        title="Locations — Atlanta Pickup Points"
        description="GoldenWay Car Rentals is based at 235 Peachtree St. NE, Atlanta. Pickup points in Buckhead (Lenox MARTA), Cumberland and Brookhaven, confirmed by our team."
        jsonLd={[
          businessSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Locations', path: '/locations' },
          ]),
        ]}
      />
      <PageHero
        mediaKey="locations-hero"
        plate={{ kind: 'photo', src: lotGray, alt: 'Grey Toyota Camry from the GoldenWay fleet', label: 'Metro Atlanta', caption: 'Toyota Camry' }}
        backdrop="city"
        seed={29}
        index="GW/06"
        eyebrow="Atlanta, Georgia"
        title={['Find', <span className="t-serif-i c-gold">us.</span>]}
        intro="One office on Peachtree Street. Three pickup points across metro Atlanta."
        actions={
          <Button href={mapsLinks.directions} icon="arrowUpRight">
            Get directions
          </Button>
        }
      />

      <section className="section" data-chapter="Office" aria-labelledby="office-title">
        <div className="container loc-office">
          <div className="loc-office__info">
            <TechLabel index="01">{office.area}</TechLabel>
            <h2 id="office-title" className="t-h2">
              {office.name.replace('GoldenWay ', '')}
            </h2>
            <p className="t-body">{office.description}</p>
            <address className="loc-office__address">
              {office.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <dl className="loc-office__meta">
              <div>
                <dt className="t-mono">Phone</dt>
                <dd>
                  <a href={site.phone.href}>{site.phone.display}</a>
                </dd>
              </div>
              <div>
                <dt className="t-mono">Email</dt>
                <dd>
                  <a href={site.email.href}>{site.email.display}</a>
                </dd>
              </div>
              {site.hours.map((h) => (
                <div key={h.days}>
                  <dt className="t-mono">{h.days}</dt>
                  <dd>{h.label}</dd>
                </div>
              ))}
            </dl>
            <div className="loc-office__actions">
              <Button href={office.directionsUrl} icon="arrowUpRight">
                Directions
              </Button>
              <Button href={site.phone.href} variant="outline" leadingIcon="phone" icon={null}>
                Call us
              </Button>
            </div>
          </div>
          <Reveal kind="mask">
            <MapEmbed />
          </Reveal>
        </div>
      </section>

      <section className="section loc-pickups" data-chapter="Pickup points" aria-labelledby="pickups-title">
        <div className="container">
          <SectionHeading
            index="02"
            label="Pickup points"
            id="pickups-title"
            lines={['Across', <span className="t-serif-i">the metro.</span>]}
            intro="Pickups and drop-offs take place at designated locations. Your pickup point is confirmed with you by our customer support team."
          />
          <ul role="list" className="loc-pickups__grid">
            {pickupPoints.map((p, i) => (
              <Reveal as="li" key={p.id} kind="up" delay={i * 90}>
                <LiquidGlassCard as="article" className="pickup-card">
                  <div className="pickup-card__top">
                    <span className="t-mono c-gold">{String(i + 1).padStart(2, '0')}</span>
                    {p.primary && <span className="pickup-card__badge t-mono">Central</span>}
                  </div>
                  <h3 className="t-h3">{p.area}</h3>
                  <p className="pickup-card__name">{p.name}</p>
                  <p className="t-small">{p.description}</p>
                  <a href={p.directionsUrl} target="_blank" rel="noopener noreferrer" className="pickup-card__link">
                    Open in Maps <Icon name="arrowUpRight" size={14} />
                  </a>
                </LiquidGlassCard>
              </Reveal>
            ))}
          </ul>
          <p className="t-small loc-pickups__note">Airport pickup and drop-off isn’t available. Vehicles may be driven throughout the Atlanta area and may not leave Georgia.</p>
        </div>
      </section>

      <FinalCta index="03" />
    </>
  )
}
