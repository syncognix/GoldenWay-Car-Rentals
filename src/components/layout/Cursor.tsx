import { useEffect, useRef } from 'react'
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'
import './Cursor.css'

type CursorState = 'default' | 'hover' | 'view' | 'drag'

const LABELS: Partial<Record<CursorState, string>> = { view: 'View', drag: 'Drag' }

/**
 * Desktop-only follower ring that complements (never replaces) the native
 * cursor. States come from the nearest `[data-cursor]` ancestor; links and
 * buttons get the "hover" state automatically.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  if (!fine || reduced) return null
  return <CursorFollower />
}

function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ring = ringRef.current
    const label = labelRef.current
    if (!ring || !label) return
    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let raf = 0
    let state: CursorState = 'default'

    const setState = (next: CursorState) => {
      if (next === state) return
      state = next
      ring.dataset.state = next
      label.textContent = LABELS[next] ?? ''
    }

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      ring.classList.add('is-visible')
      const target = e.target as Element | null
      const tagged = target?.closest<HTMLElement>('[data-cursor]')
      if (tagged) setState((tagged.dataset.cursor as CursorState) || 'hover')
      else if (target?.closest('a, button, [role="button"], label, select, summary')) setState('hover')
      else setState('default')
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const tick = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0
    }
    const onLeave = () => ring.classList.remove('is-visible')
    const onDown = () => ring.classList.add('is-down')
    const onUp = () => ring.classList.remove('is-down')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <div ref={ringRef} className="cursor" data-state="default" aria-hidden="true">
      <span className="cursor__ring" />
      <span ref={labelRef} className="cursor__label t-mono" />
    </div>
  )
}
