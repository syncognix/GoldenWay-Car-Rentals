import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { ScrollContext, type ScrollContextValue } from './scroll-context'

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one frame loop. Touch devices keep native scrolling (syncTouch off)
 * for stability; reduced-motion users get native scrolling everywhere.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      autoRaf: false,
    })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  // Fonts shift layout; recompute trigger positions once they're in.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined)
  }, [])

  const value = useMemo<ScrollContextValue>(
    () => ({
      getLenis: () => lenisRef.current,
      scrollTo: (target, opts = {}) => {
        const lenis = lenisRef.current
        if (lenis) {
          lenis.scrollTo(target, { immediate: opts.immediate, offset: opts.offset ?? 0, force: true })
          return
        }
        if (typeof target === 'number') window.scrollTo({ top: target, behavior: opts.immediate ? 'instant' : 'smooth' })
        else {
          const el = typeof target === 'string' ? document.querySelector(target) : target
          el?.scrollIntoView({ behavior: opts.immediate ? 'instant' : 'smooth' })
        }
      },
      lock: () => {
        lenisRef.current?.stop()
        document.documentElement.style.overflow = 'hidden'
      },
      unlock: () => {
        lenisRef.current?.start()
        document.documentElement.style.overflow = ''
      },
    }),
    [],
  )

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}
