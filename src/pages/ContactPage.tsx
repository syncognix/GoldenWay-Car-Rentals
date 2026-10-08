import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { ContactForm } from '../components/forms/ContactForm'
import { LiquidGlassCard } from '../components/glass/Glass'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Accordion } from '../components/ui/Accordion'
import { TechLabel } from '../components/ui/TechLabel'
import { Button } from '../components/ui/Button'
import { Icon, type IconName } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { site, addressLines, mapsLinks } from '../config/site'
import { featuredFaqs } from '../data/faqs'
import { breadcrumbSchema, businessSchema } from '../config/schema'
import './ContactPage.css'
import lotCabin from '../media/lot/lot-impreza-cabin.webm'
import lotCabinPoster from '../media/lot/lot-impreza-cabin.jpg'

const channels: { icon: IconName; label: string; value: string; href: string; note: string }[] = [
  { icon: 'phone', label: 'Call', value: site.phone.display, href: site.phone.href, note: `${site.hours[0].days}, ${site.hours[0].label}` },
  { icon: 'mail', label: 'Email', value: site.email.display, href: site.email.href, note: 'Booking, support and general enquiries' },
  { icon: 'pin', label: 'Office', value: addressLines.line1, href: mapsLinks.directions, note: addressLines.line2 },
]

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact — GoldenWay Car Rentals"
        description={`Contact GoldenWay Car Rentals in Atlanta. Call ${site.phone.display}, email ${site.email.display}, or visit 235 Peachtree St. NE.`}
        jsonLd={[
          businessSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
      <PageHero
        mediaKey="contact-hero"
        plate={{ kind: 'clip', src: lotCabin, poster: lotCabinPoster, label: 'Real footage', caption: '2020 Subaru Impreza' }}
        backdrop="road"
        seed={47}
        index="GW/10"
        eyebrow="Contact"
        title={['Let’s', <span className="t-serif-i c-gold">talk.</span>]}
        intro="Questions about a rental, a vehicle or your booking — a real person on the other end."
      />

      <section className="section contact" data-chapter="Contact" aria-labelledby="contact-title">
        <div className="container contact__grid">
          <div className="contact__channels">
            <TechLabel index="01" dot>
              Direct lines
            </TechLabel>
            <h2 id="contact-title" className="sr-only">
              Contact GoldenWay
            </h2>
            <ul role="list" className="contact__list">
              {channels.map((c, i) => (
                <Reveal as="li" key={c.label} kind="up" delay={i * 80}>
                  <a
                    href={c.href}
                    className="contact__channel"
                    {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className="contact__icon">
                      <Icon name={c.icon} size={20} />
                    </span>
                    <span className="contact__text">
                      <span className="t-mono c-muted">{c.label}</span>
                      <span className="contact__value">{c.value}</span>
                      <span className="t-small">{c.note}</span>
                    </span>
                    <Icon name="arrowUpRight" size={18} className="contact__arrow" />
                  </a>
                </Reveal>
              ))}
            </ul>
            <div className="contact__social">
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="GoldenWay on Facebook">
                <Icon name="facebook" size={18} />
              </a>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="GoldenWay on Instagram">
                <Icon name="instagram" size={18} />
              </a>
              <a href={site.social.google} target="_blank" rel="noopener noreferrer" aria-label="GoldenWay on Google">
                <Icon name="google" size={18} />
              </a>
            </div>
          </div>

          <LiquidGlassCard className="contact__form-card">
            <TechLabel index="02">Send a message</TechLabel>
            <p className="t-h3 contact__form-title">How can we help?</p>
            <ContactForm />
          </LiquidGlassCard>
        </div>
      </section>

      <section className="section section--tight" data-chapter="Quick answers" aria-labelledby="contact-faq-title">
        <div className="container">
          <SectionHeading
            index="03"
            label="Quick answers"
            id="contact-faq-title"
            lines={['Before you', <span className="t-serif-i">ask.</span>]}
            aside={
              <Button to="/faq" variant="text">
                All questions
              </Button>
            }
          />
          <Accordion items={featuredFaqs} />
        </div>
      </section>
    </>
  )
}
