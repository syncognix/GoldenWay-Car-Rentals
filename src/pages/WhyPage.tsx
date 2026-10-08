import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { PillarList } from '../components/sections/PillarList'
import { TermsGrid } from '../components/sections/TermsGrid'
import { BentoSection } from '../components/sections/BentoSection'
import { FinalCta } from '../components/sections/FinalCta'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { pillars } from '../data/services'
import { breadcrumbSchema } from '../config/schema'
import { rateLabel } from '../config/site'
import './WhyPage.css'

export default function WhyPage() {
  return (
    <>
      <Seo
        title="Why GoldenWay — No Deposit, Insurance Included"
        description={`Why drivers choose GoldenWay in Atlanta: ${rateLabel.toLowerCase()}, no deposit, no credit check, insurance included, unlimited miles and rideshare-approved vehicles.`}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Why GoldenWay', path: '/why-goldenway' },
        ])}
      />
      <PageHero
        mediaKey="why-hero"
        backdrop="bokeh"
        seed={23}
        index="GW/05"
        eyebrow="Why GoldenWay"
        title={['The difference', 'is in the', <span className="t-serif-i c-gold">details.</span>]}
        intro="No deposit. No credit check. Insurance included and unlimited miles. A rental experience designed around the people who actually drive."
      />

      <section className="section why-terms" data-chapter="The terms" aria-labelledby="why-terms-title">
        <div className="container">
          <SectionHeading
            index="01"
            label="The terms"
            id="why-terms-title"
            lines={['Plain language.', <span className="t-serif-i">No fine print.</span>]}
            intro="The essentials of every GoldenWay rental, exactly as published."
          />
          <TermsGrid columns={3} />
        </div>
      </section>

      <section className="section" data-chapter="Pillars" aria-labelledby="why-pillars-title">
        <div className="container why-pillars">
          <SectionHeading index="02" label="Six reasons" id="why-pillars-title" lines={['Why drivers', <span className="t-serif-i">choose us.</span>]} />
          <PillarList items={pillars} />
          <Reveal kind="fade" className="why-pillars__cta">
            <Button to="/fleet">Explore the fleet</Button>
            <Button to="/policies" variant="text">
              Read the full rental terms
            </Button>
          </Reveal>
        </div>
      </section>

      <BentoSection />
      <FinalCta index="04" />
    </>
  )
}
