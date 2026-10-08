import { getLocalFleetImages } from '../media'
import type { Vehicle } from '../data/vehicles'

/** Local photos (src/media/fleet/<slug>/) win over the remote representative model photos. */
export function vehicleImages(v: Vehicle): string[] {
  const local = getLocalFleetImages(v.slug)
  return local.length ? local : v.remoteImages
}

export const vehicleCover = (v: Vehicle) => vehicleImages(v)[0]

/** Transparent cutouts (PNG/WebP) sit on a lit studio stage; real photos fill the frame. */
export const isCutout = (src?: string) => Boolean(src && /\.(png|webp)(\?|$)/i.test(src))
