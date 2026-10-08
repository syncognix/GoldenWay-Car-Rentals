import type { MouseEvent } from 'react'
import { useTheme } from '../../providers/theme-context'
import { Icon } from './Icon'
import './ThemeToggle.css'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${className ?? ''}`}
      onClick={onClick}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      data-cursor="hover"
    >
      <span className={`theme-toggle__icons is-${theme}`} aria-hidden="true">
        <Icon name="moon" size={17} />
        <Icon name="sun" size={17} />
      </span>
    </button>
  )
}
