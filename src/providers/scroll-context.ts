import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

export type ScrollContextValue = {
  /** Null when smooth scrolling is disabled (reduced motion). */
  getLenis: () => Lenis | null
  scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean; offset?: number }) => void
  lock: () => void
  unlock: () => void
}

export const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useSmoothScroll must be used within SmoothScrollProvider')
  return ctx
}
