import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { NavLink } from 'react-router'
import { primaryNav, secondaryNav } from '../../config/navigation'
import { site, addressLines } from '../../config/site'
import { useSmoothScroll } from '../../providers/scroll-context'
import { Button } from '../ui/Button'
import { ThemeToggle } from '../ui/ThemeToggle'
import { TechLabel } from '../ui/TechLabel'
import './MobileMenu.css'

type Props = { open: boolean; onClose: () => void }

const ease = [0.16, 1, 0.3, 1] as const

export function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { lock, unlock } = useSmoothScroll()
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    lock()
    const previouslyFocused = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('a, button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
      if (e.key === 'Tab' && panel) {
        const focusable = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      unlock()
      previouslyFocused?.focus?.()
    }
  }, [open, lock, unlock])

  const links = [...primaryNav, ...secondaryNav]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          className="mobile-menu surface-dark"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="mobile-menu__reeds" aria-hidden="true" />
          <div className="mobile-menu__inner container">
            <TechLabel index="Menu" className="mobile-menu__label">
              GoldenWay · Atlanta
            </TechLabel>
            <nav aria-label="Mobile">
              <ul role="list" className="mobile-menu__list">
                {links.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.8, delay: 0.18 + i * 0.045, ease }}
                  >
                    <NavLink to={item.to} end={item.to === '/'} onClick={onClose} className="mobile-menu__link">
                      <span className="t-mono mobile-menu__num">{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="mobile-menu__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button to="/book" block onClick={onClose}>
                Book your ride
              </Button>
              <div className="mobile-menu__contact">
                <a href={site.phone.href} className="t-num">
                  {site.phone.display}
                </a>
                <a href={site.email.href}>{site.email.display}</a>
                <span className="c-muted">{addressLines.line1}</span>
              </div>
              <div className="mobile-menu__row">
                <span className="t-mono c-muted">Theme</span>
                <ThemeToggle />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
