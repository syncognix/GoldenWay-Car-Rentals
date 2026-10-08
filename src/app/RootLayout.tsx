import { Suspense, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useOutlet } from 'react-router'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ScrollProgress } from '../components/layout/ScrollProgress'
import { Cursor } from '../components/layout/Cursor'
import { RouteCurtain } from '../components/layout/RouteCurtain'
import { MobileBookBar } from '../components/layout/MobileBookBar'
import { ScrollTrigger } from '../lib/gsap'
import { useSmoothScroll } from '../providers/scroll-context'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { PageLoading } from './PageLoading'

export function RootLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const { scrollTo } = useSmoothScroll()
  const reduced = useReducedMotion()
  const mainRef = useRef<HTMLElement>(null)

  const onEntered = () => {
    ScrollTrigger.refresh()
    if (location.key === 'default') return
    mainRef.current?.focus({ preventScroll: true })
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (el) scrollTo(el, { offset: -96 })
    }
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <Header />

      <AnimatePresence mode="wait" onExitComplete={() => scrollTo(0, { immediate: true })}>
        <motion.main
          ref={mainRef}
          key={location.pathname}
          id="main"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: reduced ? 0.15 : 0.5, delay: reduced ? 0 : 0.1 } }}
          exit={{ opacity: 0, transition: { duration: reduced ? 0.1 : 0.42 } }}
          onAnimationComplete={(def) => {
            if ((def as { opacity?: number }).opacity === 1) onEntered()
          }}
          style={{ outline: 'none' }}
        >
          <Suspense fallback={<PageLoading />}>{outlet}</Suspense>
        </motion.main>
      </AnimatePresence>

      <Footer />
      <MobileBookBar />
      <RouteCurtain />
      <Cursor />
    </>
  )
}
