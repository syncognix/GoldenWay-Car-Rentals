import { useEffect, useRef, type DependencyList, type RefObject } from 'react'
import { gsap } from '../lib/gsap'

type Setup = (ctx: { mm: gsap.MatchMedia; scope: HTMLElement }) => void

/**
 * Scoped GSAP setup with automatic cleanup. Selectors resolve inside `scope`;
 * every tween, ScrollTrigger and matchMedia query is reverted on unmount.
 *
 *   useGsap(ref, ({ mm }) => {
 *     mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => { … })
 *   })
 */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: Setup, deps: DependencyList = []) {
  const setupRef = useRef(setup)
  useEffect(() => {
    setupRef.current = setup
  })

  useEffect(() => {
    const el = scope.current
    if (!el) return
    const mm = gsap.matchMedia(el)
    const ctx = gsap.context(() => setupRef.current({ mm, scope: el }), el)
    return () => {
      mm.revert()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, ...deps])
}

/** Standard media condition for scroll-driven motion on capable screens. */
export const MOTION_DESKTOP = '(min-width: 900px) and (prefers-reduced-motion: no-preference)'
export const MOTION_ANY = '(prefers-reduced-motion: no-preference)'
