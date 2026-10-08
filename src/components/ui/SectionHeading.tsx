import type { ReactNode } from 'react'
import { Reveal, SplitLines } from './Reveal'
import { TechLabel } from './TechLabel'
import './SectionHeading.css'

type Props = {
  index?: string
  label: string
  lines: ReactNode[]
  intro?: ReactNode
  aside?: ReactNode
  as?: 'h1' | 'h2'
  size?: 'h1' | 'h2'
  id?: string
  className?: string
}

/** Swiss-grid section header: technical label column + display title + intro. */
export function SectionHeading({ index, label, lines, intro, aside, as = 'h2', size = 'h2', id, className }: Props) {
  return (
    <header className={`section-heading grid-12 ${className ?? ''}`}>
      <Reveal kind="fade" className="section-heading__label">
        <TechLabel index={index} glitch>
          {label}
        </TechLabel>
      </Reveal>
      <div className="section-heading__main">
        <SplitLines as={as} id={id} className={`section-heading__title t-${size}`} lines={lines} />
        {(intro || aside) && (
          <div className="section-heading__foot">
            {intro && (
              <Reveal kind="blur" delay={200} className="t-lead">
                {intro}
              </Reveal>
            )}
            {aside && (
              <Reveal kind="fade" delay={320} className="section-heading__aside">
                {aside}
              </Reveal>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
