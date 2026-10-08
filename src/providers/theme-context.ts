import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export type ThemeContextValue = {
  theme: Theme
  /** Toggle with a radial reveal originating from the given point. */
  toggle: (origin?: { x: number; y: number }) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export const THEME_STORAGE_KEY = 'gw-theme'
