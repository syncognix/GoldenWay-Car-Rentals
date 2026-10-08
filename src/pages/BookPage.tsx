import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { BookingWizard } from '../components/booking/BookingWizard'
import { Button } from '../components/ui/Button'
import { breadcrumbSchema } from '../config/schema'
import { rateLabel, site } from '../config/site'
import lotSide from '../media/lot/lot-camry-side.webm'
import lotSidePoster from '../media/lot/lot-camry-side.jpg'

export default function BookPage() {
  return (
    <>
      <Seo
        title="Book a Car — Request Your Rental"
        description={`Request a weekly or monthly car rental in Atlanta. ${rateLabel}, no deposit, insurance included and unlimited miles. Our team confirms availability with you directly.`}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Book', path: '/book' },
        ])}
      />
      <PageHero
        mediaKey="booking-hero"
        plate={{ kind: 'clip', src: lotSide, poster: lotSidePoster, label: 'Real footage', caption: 'Toyota Camry' }}
        backdrop="road"
        seed={8}
        size="medium"
        index="GW/BK"
        eyebrow="Booking request"
        title={['Book your', <span className="t-serif-i c-gold">ride.</span>]}
        intro="Four short steps. No deposit, no credit check, and nothing charged online — our team confirms your vehicle and pickup with you directly."
        actions={
          <Button href={site.phone.href} variant="glass" leadingIcon="phone" icon={null}>
            Prefer to call? {site.phone.display}
          </Button>
        }
      />
      <section className="section section--tight" data-chapter="Request" aria-label="Booking request form">
        <div className="container">
          <BookingWizard />
        </div>
      </section>
    </>
  )
}
