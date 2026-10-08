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

    // A mask reveal starts fully clipped, and a fully clipped element never
    // reports as intersecting — so masked targets are watched through their parent.
    const watched = new Map<Element, HTMLElement[]>()
    for (const t of targets) {
      const masked = t.dataset.reveal?.startsWith('mask') && t.parentElement
      const key = masked ? t.parentElement! : t
      watched.set(key, [...(watched.get(key) ?? []), t])
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            watched.get(e.target)?.forEach((t) => t.classList.add('is-in'))
            io.unobserve(e.target)
          }
        }
      },
      { threshold, rootMargin },
    )
    watched.forEach((_, key) => io.observe(key))
    return () => io.disconnect()
  }, [ref, threshold, rootMargin])
}
