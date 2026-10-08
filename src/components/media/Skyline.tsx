import { useMemo } from 'react'

/**
 * Stylised Atlanta skyline silhouette, generated deterministically.
 * Includes nods to the city's signature towers — a cylindrical tower, a
 * pyramid-and-spire crown and a gothic gabled crown — without claiming to be
 * a literal map of the skyline.
 */

const W = 1600
const H = 420

function rng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

type Tower = { x: number; w: number; h: number; crown?: 'spire' | 'cylinder' | 'gable' | 'step' }

export function Skyline({ seed = 3 }: { seed?: number }) {
  const { towers, windows } = useMemo(() => {
    const r = rng(seed * 9301 + 49297)
    const list: Tower[] = []
    let x = -20
    while (x < W + 20) {
      const w = 38 + r() * 70
      const center = 1 - Math.abs((x + w / 2 - W * 0.52) / (W * 0.62))
      const h = 60 + r() * 120 + Math.max(0, center) * 150
      list.push({ x, w, h })
      x += w + (r() < 0.3 ? 6 + r() * 14 : 2)
    }
    // Signature towers, placed near the centre of the composition
    list.push({ x: W * 0.47, w: 46, h: 318, crown: 'spire' })
    list.push({ x: W * 0.565, w: 64, h: 262, crown: 'cylinder' })
    list.push({ x: W * 0.385, w: 58, h: 272, crown: 'gable' })
    list.push({ x: W * 0.64, w: 72, h: 228, crown: 'step' })

    const wins: { x: number; y: number }[] = []
    for (const t of list) {
      for (let wy = H - t.h + 18; wy < H - 8; wy += 9) {
        for (let wx = t.x + 6; wx < t.x + t.w - 6; wx += 8) {
          if (r() < 0.085) wins.push({ x: wx, y: wy })
        }
      }
    }
    return { towers: list, windows: wins }
  }, [seed])

  return (
    <svg className="backdrop__skyline" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky-tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#151413" />
          <stop offset="1" stopColor="#070707" />
        </linearGradient>
      </defs>
      <g fill="url(#sky-tower)">
        {towers.map((t, i) => {
          const top = H - t.h
          switch (t.crown) {
            case 'spire':
              return (
                <g key={i}>
                  <rect x={t.x} y={top} width={t.w} height={t.h} />
                  <polygon points={`${t.x},${top} ${t.x + t.w / 2},${top - 46} ${t.x + t.w},${top}`} />
                  <rect x={t.x + t.w / 2 - 1.2} y={top - 96} width={2.4} height={52} />
                </g>
              )
            case 'cylinder':
              return (
                <g key={i}>
                  <rect x={t.x} y={top} width={t.w} height={t.h} rx={t.w / 2} ry={10} />
                  <rect x={t.x - 3} y={top + 8} width={t.w + 6} height={10} rx={4} />
                </g>
              )
            case 'gable':
              return (
                <g key={i}>
                  <rect x={t.x} y={top} width={t.w} height={t.h} />
                  <polygon points={`${t.x - 2},${top} ${t.x + t.w / 2},${top - 40} ${t.x + t.w + 2},${top}`} />
                </g>
              )
            case 'step':
              return (
                <g key={i}>
                  <rect x={t.x} y={top} width={t.w} height={t.h} />
                  <rect x={t.x + 10} y={top - 18} width={t.w - 20} height={18} />
                  <rect x={t.x + 22} y={top - 30} width={t.w - 44} height={12} />
                </g>
              )
            default:
              return <rect key={i} x={t.x} y={top} width={t.w} height={t.h} />
          }
        })}
      </g>
      <g className="backdrop__windows">
        {windows.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={3} height={4} />
        ))}
      </g>
      <rect x={W * 0.47 + 22} y={H - 318 - 98} width={2.4} height={3} className="backdrop__beacon" />
    </svg>
  )
}
