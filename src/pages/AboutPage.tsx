import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal, SplitLines } from '../components/ui/Reveal'
import { TechLabel } from '../components/ui/TechLabel'
import { Button } from '../components/ui/Button'
import { AtlantaSection } from '../components/sections/AtlantaSection'
import { FinalCta } from '../components/sections/FinalCta'
import { brandStory } from '../data/services'
import { site } from '../config/site'
import { breadcrumbSchema } from '../config/schema'
import './AboutPage.css'
import atlantaArtwork from '../media/images/goldenway-original.webp'

/** Principles drawn directly from GoldenWay's stated mission. */
const principles = [
  { index: '01', title: 'Clear communication', body: 'From the moment you book to the day you return the vehicle, you know what’s happening and who to call.' },
  { index: '02', title: 'Well-maintained cars', body: 'Clean, reliable vehicles, with required maintenance covered by GoldenWay throughout your rental.' },
  { index: '03', title: 'Built around convenience', body: 'Straightforward weekly rentals, simple requirements and pickup points across Atlanta.' },
]

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About GoldenWay — Atlanta Car Rentals"
        description="Golden Way Car Rentals provides clean, reliable, and affordable weekly vehicle rentals in Atlanta for rideshare drivers, delivery drivers and everyday renters."
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <PageHero
        mediaKey="about-hero"
        plate={{ kind: 'photo', src: atlantaArtwork, alt: 'GoldenWay rental cars against the Atlanta skyline', label: 'GoldenWay', caption: 'Atlanta, GA' }}
        backdrop="city"
        seed={17}
        index="GW/04"
        eyebrow="About GoldenWay"
        title={['Made in', <span className="t-serif-i c-gold">Atlanta.</span>]}
        intro="A local car rental company on Peachtree Street, built for drivers who need dependable transportation without the hassle."
      />

      <section className="section about-story" data-chapter="Our story" aria-labelledby="about-story-title">
        <div className="container about-story__grid">
          <div className="about-story__label">
            <TechLabel index="01" glitch>
              Our story
            </TechLabel>
            <p className="t-mono c-muted about-story__owner">Owner — {site.owner}</p>
          </div>
          <div className="about-story__body">
            <SplitLines
              id="about-story-title"
              as="h2"
              className="about-story__lede t-serif"
              lines={['Clean, reliable,', 'affordable — and', <span className="t-serif-i c-gold">without the hassle.</span>]}
            />
            <div className="about-story__cols">
              <Reveal kind="blur" as="p" className="t-body">
                {brandStory.intro}
              </Reveal>
              <Reveal kind="blur" delay={120} as="p" className="t-body">
                {brandStory.specialty}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="about-quote surface-dark" data-chapter="Mission" aria-labelledby="mission-title">
        <div className="container">
          <TechLabel index="02">Mission</TechLabel>
          <h2 id="mission-title" className="sr-only">
            Our mission
          </h2>
          <Reveal kind="blur" as="blockquote" className="about-quote__text t-serif">
            “{brandStory.mission}”
          </Reveal>
          <Reveal kind="fade" delay={200} as="p" className="about-quote__by t-mono">
            — {site.legalName}
          </Reveal>
        </div>
      </section>

      <section className="section" data-chapter="Principles" aria-labelledby="principles-title">
        <div className="container">
          <SectionHeading index="03" label="Principles" id="principles-title" lines={['What we', <span className="t-serif-i">stand for.</span>]} intro={brandStory.promise} />
          <ol role="list" className="principles">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.index} kind="up" delay={i * 90} className="principles__item">
                <span className="principles__num t-num">{p.index}</span>
                <h3 className="t-h3">{p.title}</h3>
                <p className="t-body">{p.body}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal kind="fade" className="about-links">
            <Button to="/why-goldenway" variant="outline">
              Why GoldenWay
            </Button>
            <Button to="/contact" variant="text">
              Talk to the team
            </Button>
          </Reveal>
        </div>
      </section>

      <AtlantaSection />
      <FinalCta index="05" />
    </>
  )
}
