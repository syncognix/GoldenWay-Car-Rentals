import { Monogram } from '../components/layout/Logo'

/** Shown only while a route chunk downloads (usually hidden by the curtain). */
export function PageLoading() {
  return (
    <div className="page-loading surface-dark" role="status" aria-live="polite">
      <Monogram size={32} />
      <span className="t-mono">Loading</span>
    </div>
  )
}
