import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Seo } from '../components/seo/Seo'
import { PageHero } from '../components/hero/PageHero'
import { CinematicBackdrop } from '../components/media/CinematicBackdrop'
import { TechLabel } from '../components/ui/TechLabel'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { FinalCta } from '../components/sections/FinalCta'
import { rentalSteps } from '../data/steps'
import { breadcrumbSchema } from '../config/schema'
import './HowItWorksPage.css'

export default function HowItWorksPage() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-step]') ?? [])
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const step = rentalSteps[active]

  return (
    <>
      <Seo
        title="How It Works — Renting with GoldenWay"
        description="How renting with GoldenWay works: choose your vehicle, pick your dates, submit your request, confirm your pickup, then drive and return. 7-day minimum, no deposit."
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'How it works', path: '/how-it-works' },
        ])}
      />
      <PageHero
        mediaKey="how-it-works-hero"
        backdrop="horizon"
        seed={12}
        index="GW/03"
        eyebrow="How it works"
        title={['Pickup.', 'Drive.', <span className="t-serif-i c-gold">Return.</span>]}
        intro="From choosing a car to handing back the keys — five clear steps, with a real team confirming every one."
      />

      <section className="section hiw" data-chapter="The journey" aria-labelledby="hiw-title">
        <div className="container hiw__grid">
          <div className="hiw__visual surface-dark" aria-hidden="true">
            <AnimatePresence mode="sync">
              <motion.div
                key={step.index}
                className="hiw__scene"
                initial={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <CinematicBackdrop variant={step.backdrop} seed={active * 7 + 3} />
              </motion.div>
            </AnimatePresence>
            <div className="hiw__hud">
              <span className="t-mono">{step.label}</span>
              <span className="hiw__num t-num">{step.index}</span>
              <span className="t-mono">
                {step.index} / {String(rentalSteps.length).padStart(2, '0')}
              </span>
            </div>
            <div className="hiw__ticks">
              {rentalSteps.map((s, i) => (
                <span key={s.index} className={i <= active ? 'is-on' : ''} />
              ))}
            </div>
          </div>

          <div className="hiw__content">
            <TechLabel index="01">The journey</TechLabel>
            <h2 id="hiw-title" className="sr-only">
              The rental journey, step by step
            </h2>
            <ol ref={listRef} role="list" className="hiw__steps">
              {rentalSteps.map((s, i) => (
                <li key={s.index} data-step={i} className={`hiw-step ${i === active ? 'is-active' : ''}`}>
                  <div className="hiw-step__mobile-visual surface-dark" aria-hidden="true">
                    <CinematicBackdrop variant={s.backdrop} seed={i * 7 + 3} />
                  </div>
                  <span className="hiw-step__index t-mono">
                    {s.index} — {s.label}
                  </span>
                  <h3 className="hiw-step__title t-h2">{s.title}</h3>
                  <p className="t-lead">{s.body}</p>
                  <ul role="list" className="hiw-step__facts">
                    {s.facts.map((f) => (
                      <li key={f} className="t-mono">
                        {f}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <Reveal kind="up" className="hiw__cta">
              <Button to="/book" size="lg" magnetic>
                Start your request
              </Button>
              <Button to="/faq" variant="text">
                Read the FAQ
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta index="02" />
    </>
  )
}
