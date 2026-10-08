import { useEffect, type RefObject } from 'react'

/**
 * Adds `.is-in` to the root (when it has data-reveal / split lines) and to every
 * `[data-reveal]` descendant as they enter the viewport. One observer per root.
 */
export function useReveal<T extends HTMLElement>(ref: RefObject<T | null>, options: { threshold?: number; rootMargin?: string } = {}) {
  const { threshold = 0.18, rootMargin = '0px 0px -8% 0px' } = options

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = [root, ...Array.from(root.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]'))]

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold, rootMargin },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [ref, threshold, rootMargin])
}
