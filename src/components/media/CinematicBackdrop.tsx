import { useEffect, useRef, type CSSProperties } from 'react'
import { backdropConfigs, type BackdropVariant } from './backdropVariants'
import { Skyline } from './Skyline'
import './CinematicBackdrop.css'

type Props = {
  variant?: BackdropVariant
  /** Seed so each page renders its own composition deterministically. */
  seed?: number
  className?: string
}

type Streak = { x: number; y: number; z: number; dir: 1 | -1; v: number; len: number; tone: 0 | 1 | 2 }
type Light = { x: number; y: number; r: number; tone: 0 | 1 | 2; phase: number; rate: number; drift: number }

const NEAR = 0.6
const FAR = 46

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Soft round sprite, pre-rendered once per tone for cheap glow drawing. */
function makeSprite(rgb: string) {
  const s = document.createElement('canvas')
  s.width = s.height = 64
  const g = s.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, `rgba(${rgb},1)`)
  grad.addColorStop(0.25, `rgba(${rgb},0.55)`)
  grad.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return s
}

// warm white headlight · tail red · champagne
const TONES = ['255,238,208', '255,74,52', '222,190,128'] as const

/**
 * Procedural night-drive scene (light trails, bokeh, horizon glow) rendered
 * on a single canvas. Pauses offscreen and when the tab is hidden; renders a
 * single still frame for reduced-motion users.
 */
export function CinematicBackdrop({ variant = 'road', seed = 7, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cfg = backdropConfigs[variant]

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 767px)').matches
    const rand = mulberry32(seed)
    const sprites = TONES.map(makeSprite)
    const density = small ? 0.55 : 1

    let w = 0
    let h = 0
    let dpr = 1

    const spawnStreak = (fresh: boolean): Streak => {
      const tail = rand() < cfg.tailRatio
      const tunnel = !cfg.road
      return {
        x: (rand() - 0.5) * cfg.spread * (tail ? 1 : 1.1) + (cfg.road ? (tail ? -0.9 : 0.9) : 0),
        y: tunnel ? (rand() - 0.5) * 3.2 : -0.05 - rand() * 0.25,
        z: fresh ? NEAR + rand() * (FAR - NEAR) : tail ? NEAR + rand() * 2 : FAR - rand() * 4,
        dir: tail ? 1 : -1,
        v: (2.2 + rand() * 3.4) * cfg.speed,
        len: 0.9 + rand() * 1.8,
        tone: tail ? 1 : rand() < 0.22 ? 2 : 0,
      }
    }

    const streaks: Streak[] = Array.from({ length: Math.round(cfg.streaks * density) }, () => spawnStreak(true))
    const lights: Light[] = Array.from({ length: Math.round(cfg.bokeh * density) }, () => {
      const spread = variant === 'bokeh'
      return {
        x: rand(),
        y: spread ? rand() * 0.95 : cfg.horizon * (0.35 + rand() * 0.62),
        r: spread ? 6 + rand() * 38 : 1.2 + rand() * 4.5,
        tone: (rand() < 0.62 ? 2 : rand() < 0.5 ? 0 : 1) as 0 | 1 | 2,
        phase: rand() * Math.PI * 2,
        rate: 0.3 + rand() * 1.2,
        drift: (rand() - 0.5) * 0.006,
      }
    })

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5)
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }

    const project = (x: number, y: number, z: number) => {
      const f = Math.max(w, h * 1.4) * 0.5
      return { sx: w / 2 + (x / z) * f, sy: h * cfg.horizon + ((cfg.camera - y) / z) * f * 0.42 }
    }

    let t = 0
    const draw = (dt: number) => {
      t += dt
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // Ambient bokeh / city lights
      for (const l of lights) {
        l.x += l.drift * dt
        if (l.x < -0.05) l.x = 1.05
        if (l.x > 1.05) l.x = -0.05
        const tw = 0.55 + 0.45 * Math.sin(l.phase + t * l.rate)
        ctx.globalAlpha = (variant === 'bokeh' ? 0.16 : 0.5) * tw
        const r = l.r
        ctx.drawImage(sprites[l.tone], l.x * w - r, l.y * h - r, r * 2, r * 2)
      }

      // Road edges and lane marks
      if (cfg.road) {
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineWidth = 1
        for (const edge of [-cfg.spread * 0.62, cfg.spread * 0.62]) {
          const a = project(edge, 0, NEAR)
          const b = project(edge, 0, FAR)
          const grad = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy)
          grad.addColorStop(0, 'rgba(222,190,128,0.32)')
          grad.addColorStop(1, 'rgba(222,190,128,0)')
          ctx.strokeStyle = grad
          ctx.beginPath()
          ctx.moveTo(a.sx, a.sy)
          ctx.lineTo(b.sx, b.sy)
          ctx.stroke()
        }
        const dashOffset = (t * 6 * cfg.speed) % 4
        ctx.strokeStyle = 'rgba(245,242,234,0.16)'
        for (let z = FAR - dashOffset; z > NEAR + 0.5; z -= 4) {
          const a = project(0, 0, z)
          const b = project(0, 0, Math.max(NEAR, z - 1.6))
          ctx.globalAlpha = Math.min(1, (FAR - z) / 18)
          ctx.lineWidth = Math.min(3, 18 / z)
          ctx.beginPath()
          ctx.moveTo(a.sx, a.sy)
          ctx.lineTo(b.sx, b.sy)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'lighter'
      }

      // Light streaks
      ctx.lineCap = 'round'
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i]
        s.z += s.dir * s.v * dt
        if (s.z < NEAR || s.z > FAR) {
          streaks[i] = spawnStreak(false)
          continue
        }
        const head = project(s.x, s.y, s.z)
        const tailZ = Math.min(FAR, Math.max(NEAR, s.z - s.dir * s.len * (1 + s.v * 0.12)))
        const tail = project(s.x, s.y, tailZ)
        const near = 1 - (s.z - NEAR) / (FAR - NEAR)
        const alpha = Math.min(1, near * 1.6) * (s.tone === 1 ? 0.75 : 0.9)
        const width = Math.min(7, Math.max(0.5, 22 / s.z))
        const grad = ctx.createLinearGradient(head.sx, head.sy, tail.sx, tail.sy)
        grad.addColorStop(0, `rgba(${TONES[s.tone]},${alpha})`)
        grad.addColorStop(1, `rgba(${TONES[s.tone]},0)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = width
        ctx.beginPath()
        ctx.moveTo(head.sx, head.sy)
        ctx.lineTo(tail.sx, tail.sy)
        ctx.stroke()
        // Glow bloom at the head of near streaks
        if (width > 1.6) {
          const r = width * 4
          ctx.globalAlpha = alpha * 0.35
          ctx.drawImage(sprites[s.tone], head.sx - r, head.sy - r, r * 2, r * 2)
          ctx.globalAlpha = 1
        }
      }
    }

    resize()
    // Warm up so the very first frame already looks "mid-drive".
    for (let i = 0; i < 40; i++) draw(1 / 30)

    let raf = 0
    let last = performance.now()
    let visible = true
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      draw(dt)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (!raf) draw(0)
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(wrap)

    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [cfg, seed, variant])

  return (
    <div
      ref={wrapRef}
      className={`backdrop backdrop--${variant} ${className ?? ''}`}
      style={{ '--horizon': `${cfg.horizon * 100}%`, '--glow': cfg.glow } as CSSProperties}
      aria-hidden="true"
    >
      <div className="backdrop__sky" />
      {variant === 'city' && <Skyline seed={seed} />}
      <canvas ref={canvasRef} className="backdrop__canvas" />
      <div className="backdrop__haze" />
    </div>
  )
}
