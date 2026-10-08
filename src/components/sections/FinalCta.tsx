import type { ReactNode } from 'react'
import { HeroMedia } from '../media/HeroMedia'
import { SplitLines, Reveal } from '../ui/Reveal'
import { TechLabel } from '../ui/TechLabel'
import { Button } from '../ui/Button'
import { site } from '../../config/site'
import './FinalCta.css'

type Props = {
  index?: string
  lines?: ReactNode[]
}

/** Cinematic closing call-to-action, shared across pages. */
export function FinalCta({
  index = '06',
  lines = [
    'Where will',
    <>
      you go <span className="t-serif-i c-gold">next?</span>
    </>,
  ],
}: Props) {
  return (
    <section className="final-cta surface-dark" data-chapter="Book" aria-labelledby="final-cta-title">
      <HeroMedia mediaKey="final-cta" backdrop="tunnel" seed={33} tint="deep" />
      <div className="final-cta__inner container">
        <TechLabel index={index} dot>
          Ready when you are
        </TechLabel>
        <SplitLines id="final-cta-title" className="final-cta__title" lines={lines} />
        <Reveal kind="up" delay={200} className="final-cta__actions">
          <Button to="/book" size="lg" magnetic>
            Book your GoldenWay
          </Button>
          <Button href={site.phone.href} variant="glass" size="lg" leadingIcon="phone" icon={null}>
            Call {site.phone.display}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
