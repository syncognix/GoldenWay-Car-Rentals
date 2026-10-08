import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

type RevealKind = 'up' | 'blur' | 'fade' | 'mask' | 'mask-x'

type Props = {
  as?: ElementType
  kind?: RevealKind
  delay?: number
  className?: string
  children: ReactNode
  id?: string
}

/** Reveals its content (blur → sharp, masked → revealed…) when scrolled into view. */
export function Reveal({ as: Tag = 'div', kind = 'up', delay = 0, className, children, id }: Props) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <Tag ref={ref} id={id} data-reveal={kind} className={className} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}

type SplitProps = {
  lines: ReactNode[]
  as?: ElementType
  className?: string
  /** Base delay before the first line, ms. */
  delay?: number
  /** Reveal immediately on mount instead of on scroll (for heroes). */
  immediate?: boolean
  id?: string
}

/** Line-by-line masked text reveal. Lines are explicit for typographic control. */
export function SplitLines({ lines, as: Tag = 'h2', className, delay = 0, immediate, id }: SplitProps) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, { threshold: immediate ? 0 : 0.2 })
  return (
    <Tag ref={ref} id={id} className={className} style={{ '--split-delay': `${delay}ms` } as CSSProperties}>
      {lines.map((line, i) => (
        <span key={i} className="split-line">
          <span style={{ '--i': i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}
