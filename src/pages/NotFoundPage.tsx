import { Seo } from '../components/seo/Seo'
import { HeroMedia } from '../components/media/HeroMedia'
import { Button } from '../components/ui/Button'
import { TechLabel } from '../components/ui/TechLabel'
import { primaryNav } from '../config/navigation'
import { Link } from 'react-router'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Wrong turn — Page not found" description="The page you were looking for doesn’t exist." noindex />
      <section className="nf surface-dark" data-chapter="Wrong turn" aria-labelledby="nf-title">
        <HeroMedia mediaKey="not-found-hero" backdrop="tunnel" seed={404} priority tint="deep" />
        <div className="nf__code" aria-hidden="true">
          <span>4</span>
          <span className="nf__zero">0</span>
          <span>4</span>
        </div>
        <div className="nf__inner container">
          <TechLabel index="ERR" glitch>
            Route not found
          </TechLabel>
          <h1 id="nf-title" className="nf__title">
            Looks like you’ve taken a <span className="t-serif-i c-gold">wrong turn.</span>
          </h1>
          <p className="t-lead">The page you’re looking for has moved or never existed. Let’s get you back on the road.</p>
          <div className="nf__actions">
            <Button to="/" size="lg" magnetic>
              Return home
            </Button>
            <Button to="/fleet" variant="glass" size="lg">
              View the fleet
            </Button>
          </div>
          <nav aria-label="Popular pages" className="nf__links">
            {primaryNav.slice(1).map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  )
}
