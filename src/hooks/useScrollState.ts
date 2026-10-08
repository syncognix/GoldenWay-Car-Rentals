import { useEffect, useState } from 'react'

/** Header state from scroll position: past the top, and travelling direction. */
export function useScrollState(threshold = 24) {
  const [state, setState] = useState({ scrolled: false, hidden: false })

  useEffect(() => {
    let lastY = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      const delta = y - lastY
      const scrolled = y > threshold
      setState((prev) => {
        let hidden = prev.hidden
        if (Math.abs(delta) > 6) hidden = delta > 0 && y > 480
        if (!scrolled) hidden = false
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden }
      })
      lastY = y
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [threshold])

  return state
}
