import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { ThemeContext, THEME_STORAGE_KEY, type Theme } from './theme-context'

const THEME_COLOR: Record<Theme, string> = { dark: '#080808', light: '#f5f2ea' }

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // index.html sets data-theme before first paint; start from that.
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme as Theme | undefined) ?? readStored() ?? systemTheme(),
  )

  // Follow the OS while the user hasn't chosen explicitly.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      if (readStored()) return
      const next = mql.matches ? 'light' : 'dark'
      applyTheme(next)
      setTheme(next)
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        /* storage unavailable — theme still applies for this session */
      }

      const commit = () => {
        flushSync(() => setTheme(next))
        applyTheme(next)
      }

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }

      if (reduced) return commit()

      if (!doc.startViewTransition) {
        const root = document.documentElement
        root.classList.add('theme-fade')
        commit()
        window.setTimeout(() => root.classList.remove('theme-fade'), 600)
        return
      }

      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? 0
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      const vt = doc.startViewTransition(commit)
      vt.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`],
              filter: ['blur(8px) saturate(1.3)', 'blur(0px) saturate(1)'],
            },
            { duration: 950, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
          )
        })
        .catch(() => undefined)
    },
    [theme],
  )

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
