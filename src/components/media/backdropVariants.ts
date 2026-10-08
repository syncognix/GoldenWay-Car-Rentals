/**
 * Parameters for the procedural "night drive" backdrop that stands in for
 * hero footage until real video is supplied. Each page gets its own mood.
 */

export type BackdropVariant = 'road' | 'tunnel' | 'city' | 'bokeh' | 'horizon'

export type BackdropConfig = {
  /** Horizon height as a fraction of canvas height. */
  horizon: number
  /** Light streak count at desktop size. */
  streaks: number
  /** Streak speed multiplier. */
  speed: number
  /** Ambient bokeh lights. */
  bokeh: number
  /** Show converging road edges / lane marks. */
  road: boolean
  /** Warmth of the horizon glow, 0–1. */
  glow: number
  /** Ratio of red tail-lights vs warm headlights. */
  tailRatio: number
  /** Lateral spread of streaks in world units. */
  spread: number
  /** Camera height (affects perspective steepness). */
  camera: number
}

export const backdropConfigs: Record<BackdropVariant, BackdropConfig> = {
  road: { horizon: 0.56, streaks: 46, speed: 1, bokeh: 34, road: true, glow: 0.7, tailRatio: 0.45, spread: 7, camera: 1.3 },
  tunnel: { horizon: 0.5, streaks: 90, speed: 1.6, bokeh: 0, road: false, glow: 0.35, tailRatio: 0.3, spread: 9, camera: 0.2 },
  city: { horizon: 0.64, streaks: 30, speed: 0.7, bokeh: 70, road: true, glow: 0.85, tailRatio: 0.55, spread: 9, camera: 1 },
  bokeh: { horizon: 0.62, streaks: 14, speed: 0.45, bokeh: 110, road: false, glow: 0.55, tailRatio: 0.5, spread: 10, camera: 1 },
  horizon: { horizon: 0.6, streaks: 22, speed: 0.6, bokeh: 18, road: true, glow: 1, tailRatio: 0.4, spread: 5, camera: 1.6 },
}
