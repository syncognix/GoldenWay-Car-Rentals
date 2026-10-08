import { useRef, type CSSProperties } from 'react'
import { keyTerms } from '../../data/services'
import { useReveal } from '../../hooks/useReveal'
import './TermsGrid.css'

/** Rental terms presented as a technical spec sheet. */
export function TermsGrid({ columns = 2 }: { columns?: 2 | 3 }) {
  const ref = useRef<HTMLDListElement>(null)
  useReveal(ref)
  return (
    <dl ref={ref} className={`terms-grid terms-grid--${columns}`}>
      {keyTerms.map((t, i) => (
        <div key={t.label} className="terms-grid__item" data-reveal="up" style={{ '--reveal-delay': `${i * 70}ms` } as CSSProperties}>
          <dt className="t-mono">
            <span className="terms-grid__idx">{String(i + 1).padStart(2, '0')}</span>
            {t.label}
          </dt>
          <dd>
            <span className="terms-grid__value">{t.value}</span>
            <span className="terms-grid__detail">{t.detail}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
