import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'react-router'
import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { VehicleCard } from '../components/fleet/VehicleCard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TermsGrid } from '../components/sections/TermsGrid'
import { FinalCta } from '../components/sections/FinalCta'
import { Button } from '../components/ui/Button'
import { TechLabel } from '../components/ui/TechLabel'
import { vehicles, availableCategories, categoryLabels, type VehicleCategory } from '../data/vehicles'
import { breadcrumbSchema } from '../config/schema'
import { rateLabel } from '../config/site'
import './FleetPage.css'
import lineupLeft from '../media/fleet/ford-escape/01.webp'
import lineupRight from '../media/fleet/ford-fusion/01.webp'
import lineupHero from '../media/fleet/toyota-camry-2015/01.webp'

const isCategory = (v: string | null): v is VehicleCategory => Boolean(v && availableCategories.includes(v as VehicleCategory))

export default function FleetPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('category')
  const active: VehicleCategory | 'all' = isCategory(raw) ? raw : 'all'
  const list = active === 'all' ? vehicles : vehicles.filter((v) => v.category === active)

  const select = (c: VehicleCategory | 'all') => {
    setParams(c === 'all' ? {} : { category: c }, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <Seo
        title="The Fleet — Weekly Rental Cars in Atlanta"
        description={`Browse GoldenWay's fleet of sedans, SUV, hybrid and compact rental cars in Atlanta. ${rateLabel}, no deposit, insurance included.`}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Fleet', path: '/fleet' },
        ])}
      />
      <PageHero
        mediaKey="fleet-hero"
        plate={{ kind: 'lineup', label: 'Studio line-up', caption: 'Escape · Camry · Fusion', cars: [ { src: lineupLeft, alt: '' }, { src: lineupRight, alt: '' }, { src: lineupHero, alt: '2015 Toyota Camry' } ] }}
        backdrop="tunnel"
        seed={4}
        index="GW/02"
        eyebrow="The fleet"
        title={['The', <span className="t-serif-i c-gold">fleet.</span>]}
        intro={`${vehicles.length} practical, well-kept vehicles — sedans, an SUV, a hybrid and a compact. Rented weekly or monthly, ${rateLabel.toLowerCase()}.`}
        meta={
          <dl className="fleet-hero-meta">
            <div>
              <dt className="t-mono">Vehicles</dt>
              <dd className="t-num">{String(vehicles.length).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt className="t-mono">Classes</dt>
              <dd className="t-num">{String(availableCategories.length).padStart(2, '0')}</dd>
            </div>
          </dl>
        }
      />

      <section className="section fleet-list" data-chapter="Vehicles" aria-labelledby="fleet-list-title">
        <div className="container">
          <div className="fleet-list__bar">
            <h2 id="fleet-list-title" className="sr-only">
              Vehicles
            </h2>
            <div className="fleet-filter" role="group" aria-label="Filter by category">
              {(['all', ...availableCategories] as const).map((c) => {
                const count = c === 'all' ? vehicles.length : vehicles.filter((v) => v.category === c).length
                return (
                  <button
                    key={c}
                    type="button"
                    className={`fleet-filter__chip ${active === c ? 'is-active' : ''}`}
                    aria-pressed={active === c}
                    onClick={() => select(c)}
                  >
                    {active === c && <motion.span layoutId="fleet-filter-pill" className="fleet-filter__pill" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                    <span className="fleet-filter__label">{c === 'all' ? 'All' : categoryLabels[c]}</span>
                    <span className="fleet-filter__count t-mono">{String(count).padStart(2, '0')}</span>
                  </button>
                )
              })}
            </div>
            <TechLabel className="fleet-list__status" dot>
              {`Showing ${list.length} of ${vehicles.length}`}
            </TechLabel>
          </div>

          <motion.ul role="list" layout className="fleet-grid" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((v, i) => (
                <motion.li
                  key={v.slug}
                  layout
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={i === 0 && active === 'all' ? 'fleet-grid__featured' : undefined}
                >
                  <VehicleCard vehicle={v} index={vehicles.indexOf(v)} total={vehicles.length} featured={i === 0 && active === 'all'} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>

      <section className="section section--tight" data-chapter="Terms" aria-labelledby="fleet-terms-title">
        <div className="container">
          <SectionHeading
            index="02"
            label="Every rental includes"
            id="fleet-terms-title"
            lines={['One simple', <span className="t-serif-i">standard.</span>]}
            aside={
              <Button to="/faq" variant="text">
                Rental FAQ
              </Button>
            }
          />
          <TermsGrid columns={3} />
        </div>
      </section>

      <FinalCta index="03" />
    </>
  )
}
