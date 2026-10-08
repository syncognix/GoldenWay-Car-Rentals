import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { ReviewCarousel } from '../components/sections/ReviewCarousel'
import { SectionHeading } from '../components/ui/SectionHeading'
import { LiquidGlassCard } from '../components/glass/Glass'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { FinalCta } from '../components/sections/FinalCta'
import { reviews } from '../data/reviews'
import { site } from '../config/site'
import { breadcrumbSchema } from '../config/schema'
import './ReviewsPage.css'

export default function ReviewsPage() {
  const hasReviews = reviews.length > 0

  return (
    <>
      <Seo
        title="Reviews — GoldenWay Car Rentals"
        description="What drivers say about renting with GoldenWay in Atlanta. Read reviews and share your own experience."
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Reviews', path: '/reviews' },
        ])}
      />
      <PageHero
        mediaKey="reviews-hero"
        backdrop="bokeh"
        seed={37}
        size="medium"
        index="GW/08"
        eyebrow="Reviews"
        title={['In their', <span className="t-serif-i c-gold">words.</span>]}
        intro="Honest words from the drivers who rent with us."
      />

      <section className="section" data-chapter="Reviews" aria-labelledby="reviews-title">
        <div className="container">
          {hasReviews ? (
            <>
              <SectionHeading index="01" label="Reviews" id="reviews-title" lines={['From the', <span className="t-serif-i">driver’s seat.</span>]} />
              <ReviewCarousel reviews={reviews} />
            </>
          ) : (
            <div className="reviews-empty">
              <SectionHeading
                index="01"
                label="Reviews"
                id="reviews-title"
                lines={['Your words,', <span className="t-serif-i">coming soon.</span>]}
                intro="We publish genuine reviews only. Rented with GoldenWay? We’d be grateful if you shared your experience."
              />
              <div className="reviews-empty__grid">
                {[
                  { href: site.social.google, icon: 'google' as const, title: 'Review us on Google', body: 'Help other Atlanta drivers find a dependable rental.' },
                  { href: site.social.facebook, icon: 'facebook' as const, title: 'Recommend us on Facebook', body: 'Share your GoldenWay experience with friends.' },
                ].map((c) => (
                  <LiquidGlassCard key={c.href} as="article" className="reviews-empty__card">
                    <Icon name={c.icon} size={28} className="c-gold" />
                    <h3 className="t-h3">{c.title}</h3>
                    <p className="t-body">{c.body}</p>
                    <Button href={c.href} variant="outline" icon="arrowUpRight">
                      Open
                    </Button>
                  </LiquidGlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <FinalCta index="02" />
    </>
  )
}
