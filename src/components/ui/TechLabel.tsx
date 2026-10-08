import type { ReactNode } from 'react'
import './TechLabel.css'

type Props = {
  children: ReactNode
  index?: string
  /** Subtle RGB-split glitch on hover (string children only). */
  glitch?: boolean
  dot?: boolean
  className?: string
  as?: 'span' | 'p' | 'div'
}

/** Small monospace system label: "01 — FLEET", status dots, coordinates. */
export function TechLabel({ children, index, glitch, dot, className, as: Tag = 'span' }: Props) {
  return (
    <Tag className={`tech-label t-mono ${glitch ? 'tech-label--glitch' : ''} ${className ?? ''}`}>
      {dot && <span className="tech-label__dot" aria-hidden="true" />}
      {index && <span className="tech-label__index">{index}</span>}
      {index && <span className="tech-label__rule" aria-hidden="true" />}
      <span className="tech-label__text" data-text={glitch && typeof children === 'string' ? children : undefined}>
        {children}
      </span>
    </Tag>
  )
}
