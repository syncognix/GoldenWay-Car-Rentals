import { Link } from 'react-router'
import { footerNav } from '../../config/navigation'
import { site, addressLines, mapsLinks, coordinates } from '../../config/site'
import { useSmoothScroll } from '../../providers/scroll-context'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { TechLabel } from '../ui/TechLabel'
import { Reveal, SplitLines } from '../ui/Reveal'
import { Logo } from './Logo'
import './Footer.css'

export function Footer() {
  const { scrollTo } = useSmoothScroll()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer surface-dark" aria-labelledby="footer-title">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__statement">
            <TechLabel index="GW" dot>
              Atlanta, Georgia
            </TechLabel>
            <SplitLines
              as="h2"
              id="footer-title"
              className="site-footer__headline t-h1"
              lines={[
                'Your journey',
                <>
                  deserves <span className="t-serif-i c-gold">more.</span>
                </>,
              ]}
            />
          </div>
          <Reveal kind="blur" className="site-footer__cta">
            <p className="t-lead">Weekly and monthly car rentals in Atlanta. No deposit, insurance included, unlimited miles.</p>
            <div className="site-footer__cta-row">
              <Button to="/book" magnetic>
                Book your GoldenWay
              </Button>
              <Button href={site.phone.href} variant="glass" leadingIcon="phone" icon={null}>
                {site.phone.display}
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__contact">
            <Link to="/" className="site-footer__brand" aria-label={`${site.name} ? home`}>
              <Logo />
            </Link>
            <TechLabel>Contact</TechLabel>
            <a href={site.phone.href} className="site-footer__big t-num">
              {site.phone.display}
            </a>
            <a href={site.email.href} className="site-footer__line">
              {site.email.display}
            </a>
            <a href={mapsLinks.directions} target="_blank" rel="noopener noreferrer" className="site-footer__line">
              {addressLines.line1}
              <br />
              {addressLines.line2}
            </a>
            <ul role="list" className="site-footer__hours">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span>
                  <span className="t-num">{h.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} className="site-footer__col" aria-label={group.title}>
              <TechLabel>{group.title}</TechLabel>
              <ul role="list">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="site-footer__link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="site-footer__social">
          <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="GoldenWay on Facebook">
            <Icon name="facebook" size={18} />
            <span>Facebook</span>
          </a>
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="GoldenWay on Instagram">
            <Icon name="instagram" size={18} />
            <span>Instagram</span>
          </a>
          <a href={site.social.google} target="_blank" rel="noopener noreferrer" aria-label="GoldenWay on Google">
            <Icon name="google" size={18} />
            <span>Google</span>
          </a>
        </div>
        <div className="site-footer__base">
          <span>
            © {year} {site.legalName}. All rights reserved.
          </span>
          <span className="t-mono c-muted">{coordinates}</span>
          <button type="button" className="site-footer__top-btn" onClick={() => scrollTo(0)}>
            <span className="t-mono">Back to top</span>
            <Icon name="arrowRight" size={14} style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </div>
      </div>
    </footer>
  )
}
