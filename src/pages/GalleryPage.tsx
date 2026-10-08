import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { MixedGallery } from '../components/gallery/MixedGallery'
import { FinalCta } from '../components/sections/FinalCta'
import { TechLabel } from '../components/ui/TechLabel'
import { breadcrumbSchema } from '../config/schema'
import './GalleryPage.css'

const band = ['GoldenWay', 'Atlanta', 'Peachtree St.', 'Unlimited miles', 'No deposit', 'Weekly rentals']

export default function GalleryPage() {
  return (
    <>
      <Seo
        title="Gallery — GoldenWay in Atlanta"
        description="The GoldenWay fleet and the city it drives — a visual journal of Atlanta car rentals."
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Gallery', path: '/gallery' },
        ])}
      />
      <PageHero
        mediaKey="gallery-hero"
        backdrop="bokeh"
        seed={31}
        index="GW/07"
        eyebrow="Gallery"
        title={['The city,', <span className="t-serif-i c-gold">in motion.</span>]}
        intro="The fleet, the streets and the hours in between."
      />

      <div className="gallery-band surface-dark" aria-hidden="true">
        <div className="gallery-band__track">
          {[...band, ...band].map((w, i) => (
            <span key={i}>
              {i % 2 ? <em className="t-serif-i">{w}</em> : w}
              <i />
            </span>
          ))}
        </div>
      </div>

      <section className="section" data-chapter="Journal" aria-labelledby="gallery-title">
        <div className="container">
          <div className="gallery-head">
            <TechLabel index="01">Visual journal</TechLabel>
            <h2 id="gallery-title" className="sr-only">
              Gallery
            </h2>
            <p className="t-small">Select any photo to view it full size.</p>
          </div>
          <MixedGallery />
        </div>
      </section>

      <FinalCta index="02" />
    </>
  )
}
