import { Seo } from '../components/seo/Seo'
import { HomeHero } from '../components/hero/HomeHero'
import { IntroSection } from '../components/sections/IntroSection'
import { FleetShowcase } from '../components/fleet/FleetShowcase'
import { BentoSection } from '../components/sections/BentoSection'
import { StorySection } from '../components/sections/StorySection'
import { AtlantaSection } from '../components/sections/AtlantaSection'
import { MixedGallery } from '../components/gallery/MixedGallery'
import { ReviewCarousel } from '../components/sections/ReviewCarousel'
import { FinalCta } from '../components/sections/FinalCta'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button } from '../components/ui/Button'
import { reviews } from '../data/reviews'
import { businessSchema } from '../config/schema'
import { site } from '../config/site'

export default function HomePage() {
  return (
    <>
      <Seo
        title={`${site.name} — Weekly & Monthly Car Rentals in Atlanta, GA`}
        description="Weekly and monthly car rentals in Atlanta, Georgia. From $375/week with no deposit, insurance included and unlimited miles. Rideshare and delivery approved."
        path="/"
        jsonLd={businessSchema}
      />
      <HomeHero />
      <IntroSection />
      <FleetShowcase />
      <BentoSection />
      <StorySection />
      <AtlantaSection />

      <section className="section" data-chapter="Gallery" aria-labelledby="home-gallery-title">
        <div className="container">
          <SectionHeading
            index="06"
            label="Gallery"
            id="home-gallery-title"
            lines={[
              'The city,',
              <>
                <span className="t-serif-i">in motion.</span>
              </>,
            ]}
            aside={
              <Button to="/gallery" variant="text">
                Open the gallery
              </Button>
            }
          />
          <MixedGallery limit={6} />
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section" data-chapter="Reviews" aria-labelledby="home-reviews-title">
          <div className="container">
            <SectionHeading index="07" label="Reviews" id="home-reviews-title" lines={['In their', <span className="t-serif-i">words.</span>]} />
            <ReviewCarousel reviews={reviews} />
          </div>
        </section>
      )}

      <FinalCta index={reviews.length > 0 ? '08' : '07'} />
    </>
  )
}
