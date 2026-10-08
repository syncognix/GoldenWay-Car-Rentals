import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 1 })
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

/** Shared GSAP eases mirroring the CSS tokens. */
export const EASE = {
  out: 'expo.out',
  inOut: 'power3.inOut',
} as const
