import { useDeferredValue, useState } from 'react'
import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { Accordion } from '../components/ui/Accordion'
import { TechLabel } from '../components/ui/TechLabel'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { FinalCta } from '../components/sections/FinalCta'
import { allFaqs, faqGroups } from '../data/faqs'
import { site } from '../config/site'
import { breadcrumbSchema, faqSchema } from '../config/schema'
import { useSmoothScroll } from '../providers/scroll-context'
import './FaqPage.css'

export default function FaqPage() {
  const [query, setQuery] = useState('')
  const q = useDeferredValue(query.trim().toLowerCase())
  const { scrollTo } = useSmoothScroll()

  const groups = faqGroups
    .map((g) => ({ ...g, items: q ? g.items.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q)) : g.items }))
    .filter((g) => g.items.length > 0)
  const matches = groups.reduce((n, g) => n + g.items.length, 0)

  // Running number across groups for the editorial index.
  const offsets = groups.map((_, i) => 1 + groups.slice(0, i).reduce((n, g) => n + g.items.length, 0))

  return (
    <>
      <Seo
        title="FAQ — Rental Questions Answered"
        description="Answers about renting with GoldenWay: 7-day minimum, $375/week, no deposit, insurance, mileage, age requirements, rideshare use, pickup locations and more."
        jsonLd={[
          faqSchema(allFaqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
        ]}
      />
      <PageHero
        mediaKey="faq-hero"
        backdrop="horizon"
        seed={41}
        size="medium"
        index="GW/09"
        eyebrow="Questions & answers"
        title={['Good', <span className="t-serif-i c-gold">questions.</span>]}
        intro={`${allFaqs.length} answers about requirements, pricing, coverage and life on the road.`}
      />

      <section className="section faq" data-chapter="Answers" aria-labelledby="faq-title">
        <div className="container faq__grid">
          <aside className="faq__aside">
            <TechLabel index="01">Topics</TechLabel>
            <h2 id="faq-title" className="sr-only">
              Frequently asked questions
            </h2>
            <div className="faq__search">
              <Icon name="search" size={17} />
              <label htmlFor="faq-search" className="sr-only">
                Search questions
              </label>
              <input id="faq-search" type="search" placeholder="Search questions…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <nav aria-label="FAQ topics">
              <ul role="list" className="faq__topics">
                {groups.map((g) => (
                  <li key={g.id}>
                    <button type="button" onClick={() => scrollTo(`#faq-${g.id}`, { offset: -100 })}>
                      <span>{g.title}</span>
                      <span className="t-mono c-muted">{String(g.items.length).padStart(2, '0')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="faq__help">
              <p className="t-small">Still have a question?</p>
              <Button href={site.phone.href} variant="outline" size="sm" leadingIcon="phone" icon={null}>
                {site.phone.display}
              </Button>
            </div>
          </aside>

          <div className="faq__main" aria-live="polite">
            {q && (
              <p className="t-mono c-muted faq__count">
                {matches} result{matches === 1 ? '' : 's'} for “{query.trim()}”
              </p>
            )}
            {groups.length === 0 ? (
              <div className="faq__empty">
                <p className="t-h4">No answers match that search.</p>
                <p className="t-body">
                  Try another word, or ask us directly at <a href={site.email.href}>{site.email.display}</a>.
                </p>
              </div>
            ) : (
              groups.map((g, i) => (
                <section key={g.id} id={`faq-${g.id}`} className="faq__group" aria-labelledby={`faq-h-${g.id}`}>
                  <h2 id={`faq-h-${g.id}`} className="faq__group-title t-mono">
                    {g.title}
                  </h2>
                  <Accordion key={q} items={g.items} startIndex={offsets[i]} />
                </section>
              ))
            )}
          </div>
        </div>
      </section>

      <FinalCta index="02" />
    </>
  )
}
