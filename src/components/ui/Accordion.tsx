import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Faq } from '../../data/faqs'
import './Accordion.css'

type Props = { items: Faq[]; startIndex?: number }

/** Accessible accordion (button + region), single item open at a time. */
export function Accordion({ items, startIndex = 1 }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const base = useId()

  return (
    <ul role="list" className="accordion">
      {items.map((item, i) => {
        const isOpen = open === i
        const btnId = `${base}-b${i}`
        const panelId = `${base}-p${i}`
        return (
          <li key={item.q} className={`accordion__item ${isOpen ? 'is-open' : ''}`}>
            <h3 className="accordion__heading">
              <button
                id={btnId}
                type="button"
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="accordion__num t-mono">{String(startIndex + i).padStart(2, '0')}</span>
                <span className="accordion__q">{item.q}</span>
                <span className="accordion__icon" aria-hidden="true" />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="accordion__panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="accordion__a">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
