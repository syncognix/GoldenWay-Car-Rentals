import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const ChromeSculpture = lazy(() => import('./ChromeSculpture'))

/** Defers downloading three.js until the slot approaches the viewport. */
export function LazySculpture({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {load && (
        <Suspense fallback={null}>
          <ChromeSculpture className="sculpture-canvas" />
        </Suspense>
      )}
    </div>
  )
}
