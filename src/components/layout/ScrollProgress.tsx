import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import './ScrollProgress.css'

type Chapter = { name: string; el: HTMLElement }

/**
 * Editorial progress rail: "03 / 08 — FLEET". Chapters are any element in
 * <main> carrying `data-chapter="Name"`.
 */
export function ScrollProgress() {
  const { pathname } = useLocation()
  const [chapters, setChapters] = useState<string[]>([])
  const [active, setActive] = useState(0)
  const barRef = useRef<HTMLSpanElement>(null)

  // Collect chapters after each route has rendered (page transitions are async).
  useEffect(() => {
    let io: IntersectionObserver | null = null
    let found: Chapter[] = []
    const collect = () => {
      found = Array.from(document.querySelectorAll<HTMLElement>('main [data-chapter]')).map((el) => ({
        name: el.dataset.chapter ?? '',
        el,
      }))
      setChapters(found.map((c) => c.name))
      setActive(0)
      io?.disconnect()
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              const idx = found.findIndex((c) => c.el === e.target)
              if (idx >= 0) setActive(idx)
            }
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      )
      found.forEach((c) => io!.observe(c.el))
    }
    const timer = window.setTimeout(collect, 900)
    return () => {
      window.clearTimeout(timer)
      io?.disconnect()
    }
  }, [pathname])

  // Overall progress, written straight to the DOM (no re-render per frame).
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      barRef.current?.style.setProperty('--p', String(p))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const total = chapters.length
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <>
      <div className="scroll-progress-top" aria-hidden="true">
        <span ref={barRef} className="scroll-progress-top__bar" />
      </div>
      {total > 1 && (
        <div className="scroll-progress" aria-hidden="true">
          <span className="scroll-progress__count t-mono">
            <span className="scroll-progress__current">{pad(active + 1)}</span>
            <span className="scroll-progress__sep" />
            <span>{pad(total)}</span>
          </span>
          <ol className="scroll-progress__ticks" role="list">
            {chapters.map((name, i) => (
              <li key={`${name}-${i}`} className={i === active ? 'is-active' : i < active ? 'is-past' : ''} />
            ))}
          </ol>
          <span key={chapters[active]} className="scroll-progress__name t-mono">
            {chapters[active]}
          </span>
        </div>
      )}
    </>
  )
}
