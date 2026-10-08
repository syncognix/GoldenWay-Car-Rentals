import { useEffect, useState } from 'react'
import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { TechLabel } from '../components/ui/TechLabel'
import { Icon } from '../components/ui/Icon'
import { policySections, policiesUpdated } from '../data/policies'
import { site } from '../config/site'
import { breadcrumbSchema } from '../config/schema'
import { formatDate } from '../lib/dates'
import { useSmoothScroll } from '../providers/scroll-context'
import './PoliciesPage.css'

export default function PoliciesPage() {
  const [active, setActive] = useState(policySections[0].id)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    policySections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Seo
        title="Policies — Rental Terms & Privacy"
        description="GoldenWay rental terms summary: eligibility, rental period, vehicle use, insurance and fees — plus privacy and website terms."
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Policies', path: '/policies' },
        ])}
      />
      <PageHero
        mediaKey="policies-hero"
        backdrop="horizon"
        seed={53}
        size="medium"
        index="GW/11"
        eyebrow="Policies"
        title={['The fine', <span className="t-serif-i c-gold">print.</span>]}
        intro="Plain-language rental terms, plus our privacy and website policies. Your signed rental agreement always governs."
      />

      <section className="section policies" data-chapter="Policies" aria-label="Policy documents">
        <div className="container policies__grid">
          <nav className="policies__toc" aria-label="Contents">
            <TechLabel>Contents</TechLabel>
            <ol role="list">
              {policySections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={active === s.id ? 'is-active' : ''}
                    aria-current={active === s.id ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      history.replaceState(null, '', `#${s.id}`)
                      scrollTo(`#${s.id}`, { offset: -100 })
                    }}
                  >
                    <span className="t-mono">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
            <p className="t-small">
              {policiesUpdated ? `Last updated ${formatDate(policiesUpdated)}` : 'Questions?'}{' '}
              <a href={site.email.href}>{site.email.display}</a>
            </p>
          </nav>

          <article className="policies__doc">
            {policySections.map((s, i) => (
              <section key={s.id} id={s.id} className="policy" aria-labelledby={`${s.id}-h`}>
                <header className="policy__head">
                  <span className="t-mono c-gold">§ {String(i + 1).padStart(2, '0')}</span>
                  <h2 id={`${s.id}-h`} className="t-h3">
                    {s.title}
                  </h2>
                  {s.status === 'pending' && (
                    <p className="policy__pending t-mono">
                      <Icon name="alert" size={13} /> Official text pending
                    </p>
                  )}
                  {s.status === 'summary' && <p className="policy__summary t-mono">Summary of published terms</p>}
                </header>
                {s.blocks.map((b, j) => (
                  <div key={j} className="policy__block">
                    {b.heading && <h3 className="t-h4">{b.heading}</h3>}
                    {b.paragraphs?.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {b.list && (
                      <ul>
                        {b.list.map((li) => (
                          <li key={li}>{li}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  )
}
