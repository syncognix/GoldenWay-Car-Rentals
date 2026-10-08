import { useRef, type ElementType, type HTMLAttributes, type PointerEvent } from 'react'
import { useFinePointer } from '../../hooks/useMediaQuery'
import './Glass.css'

type GlassProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  /** Forwarded when rendered as a <form>. */
  noValidate?: boolean
}

/**
 * Liquid glass: frosted surface with a specular highlight that follows the
 * pointer (desktop only). Use to lift a surface above imagery — not as decor.
 */
export function LiquidGlassCard({ as: Tag = 'div', className, children, style, ...rest }: GlassProps) {
  const ref = useRef<HTMLElement>(null)
  const fine = useFinePointer()

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <Tag
      ref={ref}
      className={`glass glass--liquid ${className ?? ''}`}
      style={style}
      onPointerMove={fine ? onMove : undefined}
      {...rest}
    >
      <span className="glass__specular" aria-hidden="true" />
      {children}
    </Tag>
  )
}

/** Reeded (fluted) glass: vertical refractive ribs over a blurred backdrop. */
export function ReededGlassPanel({ as: Tag = 'div', className, children, style, ...rest }: GlassProps) {
  return (
    <Tag className={`glass glass--reeded ${className ?? ''}`} style={style} {...rest}>
      <span className="glass__reeds" aria-hidden="true" />
      {children}
    </Tag>
  )
}
