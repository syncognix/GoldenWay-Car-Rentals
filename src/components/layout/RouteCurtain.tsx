import { motion } from 'motion/react'
import { useLocation } from 'react-router'
import { routeTitle } from '../../app/routeTitles'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { Monogram } from './Logo'
import './RouteCurtain.css'

/**
 * Brand curtain between pages: sweeps up to cover the outgoing page, holds
 * the GoldenWay mark for a beat while the next page mounts, then lifts away.
 * Skipped on first load and for reduced-motion users.
 */
export function RouteCurtain() {
  const location = useLocation()
  const reduced = useReducedMotion()
  if (location.key === 'default' || reduced) return null

  return (
    <motion.div
      key={location.key}
      className="route-curtain surface-dark"
      aria-hidden="true"
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'] }}
      transition={{ duration: 1.15, times: [0, 0.38, 0.58, 1], ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div
        className="route-curtain__mark"
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: [0, 1, 1, 0], y: [16, 0, 0, -12], filter: ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'] }}
        transition={{ duration: 1.15, times: [0.2, 0.42, 0.6, 0.8] }}
      >
        <Monogram size={34} />
        <span className="route-curtain__title t-mono">{routeTitle(location.pathname)}</span>
      </motion.div>
    </motion.div>
  )
}
