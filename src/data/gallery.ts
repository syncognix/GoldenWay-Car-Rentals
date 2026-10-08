import type { BackdropVariant } from '../components/media/backdropVariants'

/**
 * Gallery composition. Three kinds of tile:
 *  - photo: a vehicle photo (resolved through the fleet media pipeline)
 *  - scene: an editorial image from src/media/images/<image>.*, falling back
 *           to a procedural cinematic backdrop until the photo is supplied
 *  - type:  a typographic card
 */

export type GalleryItem =
  | { kind: 'photo'; id: string; vehicle: string; image: number; caption: string }
  | { kind: 'scene'; id: string; image: string; backdrop: BackdropVariant; caption: string; label: string }
  | { kind: 'type'; id: string; eyebrow: string; text: string }

// Slot order matters: MixedGallery cycles 12 placements, and slots 2, 6, 9 and 10
// are portrait — the on-the-lot phone photos (4:5) live there.
export const gallery: GalleryItem[] = [
  { kind: 'scene', id: 'goldenway-atlanta', image: 'goldenway-original', backdrop: 'city', label: 'ATL / 01', caption: 'GoldenWay in Atlanta' },
  { kind: 'scene', id: 'lot-white-camry', image: 'lot-white-camry', backdrop: 'city', label: 'Lot / 01', caption: 'White Camry, ready for pickup' },
  { kind: 'type', id: 'statement-1', eyebrow: 'Field notes', text: 'Every mile, unlimited.' },
  { kind: 'photo', id: 'escape', vehicle: 'ford-escape', image: 0, caption: 'Ford Escape' },
  { kind: 'photo', id: 'camry-2015', vehicle: 'toyota-camry-2015', image: 0, caption: '2015 Toyota Camry' },
  { kind: 'scene', id: 'lot-gray-camry', image: 'lot-gray-camry', backdrop: 'city', label: 'Lot / 02', caption: 'Grey Camry on the lot' },
  { kind: 'photo', id: 'fusion', vehicle: 'ford-fusion', image: 0, caption: 'Ford Fusion' },
  { kind: 'photo', id: 'impreza', vehicle: 'subaru-impreza-2020', image: 0, caption: '2020 Subaru Impreza' },
  { kind: 'scene', id: 'lot-white-camry-front', image: 'lot-white-camry-front', backdrop: 'city', label: 'Lot / 03', caption: 'White Camry, front view' },
  { kind: 'scene', id: 'lot-cabin', image: 'lot-cabin', backdrop: 'city', label: 'Lot / 04', caption: 'Inside a GoldenWay Camry' },
  { kind: 'type', id: 'statement-2', eyebrow: 'Principle', text: 'Clean. Reliable. Ready.' },
  { kind: 'photo', id: 'hybrid', vehicle: 'toyota-camry-hybrid-2014', image: 0, caption: '2014 Toyota Camry Hybrid' },
  { kind: 'photo', id: 'black-camry', vehicle: 'toyota-camry-2012-black', image: 0, caption: '2012 Black Toyota Camry' },
  { kind: 'photo', id: 'camry-2013', vehicle: 'toyota-camry-2013', image: 0, caption: '2013 Toyota Camry' },
]
