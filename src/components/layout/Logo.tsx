import './Logo.css'

/** Geometric "G" monogram — an open ring with a horizon line — plus wordmark. */
export function Monogram({ size = 30 }: { size?: number }) {
  return (
    <svg className="monogram" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M26.4 9.2A12 12 0 1 0 28 16h-11.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
    </svg>
  )
}

export function Logo() {
  return (
    <img
      className="logo"
      src="/logo.png"
      alt="GoldenWay Car Rentals"
      width={600}
      height={600}
    />
  )
}
