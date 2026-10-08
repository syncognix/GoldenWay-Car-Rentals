import { useLocation } from 'react-router'
import { site, rateLabel } from '../../config/site'
import { useScrollState } from '../../hooks/useScrollState'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import './MobileBookBar.css'

/** Persistent booking CTA on small screens, revealed once the hero is passed. */
export function MobileBookBar() {
  const { pathname } = useLocation()
  const { scrolled } = useScrollState(520)
  if (pathname === '/book') return null

  return (
    <div className={`mobile-book-bar ${scrolled ? 'is-visible' : ''}`} inert={!scrolled}>
      <div className="mobile-book-bar__inner">
        <div className="mobile-book-bar__meta">
          <span className="t-mono c-gold">{rateLabel}</span>
          <span className="mobile-book-bar__sub">No deposit · Unlimited miles</span>
        </div>
        <a href={site.phone.href} className="mobile-book-bar__call" aria-label={`Call ${site.phone.display}`}>
          <Icon name="phone" size={18} />
        </a>
        <Button to="/book" size="sm">
          Book
        </Button>
      </div>
    </div>
  )
}
