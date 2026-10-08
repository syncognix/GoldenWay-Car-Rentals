import { site } from '../config/site'
import { Monogram } from '../components/layout/Logo'

/**
 * Last-resort boundary (e.g. a code-split chunk failed after a deploy).
 * Deliberately dependency-light so it renders even if the shell can't.
 */
export function RouteError() {
  return (
    <main className="route-error surface-dark">
      <Monogram size={40} />
      <h1 className="t-h3">Something stalled on the way.</h1>
      <p className="t-body">Please reload the page. If it keeps happening, call us on {site.phone.display}.</p>
      <button type="button" className="btn btn--primary btn--md" onClick={() => window.location.reload()}>
        <span className="btn__label">Reload</span>
      </button>
    </main>
  )
}
