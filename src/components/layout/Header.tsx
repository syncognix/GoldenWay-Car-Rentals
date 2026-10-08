import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { primaryNav } from '../../config/navigation'
import { site } from '../../config/site'
import { useScrollState } from '../../hooks/useScrollState'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import './Header.css'

/**
 * Transparent over the hero, then condenses into a reeded-glass bar.
 * Hides while scrolling down, returns on scroll up.
 */
export function Header() {
  const { scrolled, hidden } = useScrollState()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const cls = ['site-header', scrolled && !menuOpen ? 'is-scrolled' : 'surface-dark is-top', hidden && !menuOpen ? 'is-hidden' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header className={cls}>
        <div className="site-header__glass" aria-hidden="true" />
        <div className="site-header__inner container">
          <Link to="/" className="site-header__brand" aria-label={`${site.name} — home`} onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>

          <nav className="site-header__nav" aria-label="Primary">
            <ul role="list">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === '/'} className="site-header__link">
                    <span className="site-header__link-text" data-text={item.label}>
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <a href={site.phone.href} className="site-header__call">
              <Icon name="phone" size={15} />
              <span className="t-mono">Call</span>
              <span className="site-header__call-num t-num">{site.phone.display.replace('+1 ', '')}</span>
            </a>
            <ThemeToggle className="site-header__theme" />
            {pathname !== '/book' && (
              <Button to="/book" size="sm" className="site-header__book">
                Book now
              </Button>
            )}
            <a href={site.phone.href} className="site-header__icon-btn site-header__call-mobile" aria-label={`Call ${site.phone.display}`}>
              <Icon name="phone" size={18} />
            </a>
            <button
              type="button"
              className="site-header__icon-btn site-header__menu-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={`burger ${menuOpen ? 'is-open' : ''}`} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
