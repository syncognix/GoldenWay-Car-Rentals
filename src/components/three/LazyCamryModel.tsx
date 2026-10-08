import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import camryCutout from '../../media/fleet/toyota-camry-2015/01.webp'

const CamryModel = lazy(() => import('./CamryModel'))

export function LazyCamryModel() {
  const ref = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="camry-model">
      {load ? (
        <Suspense fallback={<img className="camry-model__fallback-image" src={camryCutout} alt="" />}>
          <CamryModel />
        </Suspense>
      ) : (
        <img className="camry-model__fallback-image" src={camryCutout} alt="" />
      )}
    </div>
  )
}
