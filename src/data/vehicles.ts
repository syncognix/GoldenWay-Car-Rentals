/**
 * GoldenWay fleet — mirrors the vehicle types listed on rentgoldenway.com/fleet
 * (Rent Centric account 8607, retrieved Oct 2026).
 *
 * Only facts published by the business are recorded. Unknown values are left
 * `undefined` and the UI hides them. Per-vehicle rates are not published, so
 * the fleet-wide "from $375/week" rate (site.terms) is shown instead.
 *
 * Photos: `remoteImages` use representative model photos found via image search.
 * Source pages are recorded beside each photo; these are not the actual rental cars.
 * To serve them locally instead, drop files into
 * `src/media/fleet/<slug>/` (e.g. 01.jpg, 02.jpg) — local files take priority.
 *
 * This file must stay free of Vite-only APIs: vite.config.ts imports it to
 * generate the sitemap.
 */

export type VehicleCategory = 'sedan' | 'suv' | 'hybrid' | 'compact'

export type Vehicle = {
  slug: string
  make: string
  model: string
  year?: number
  /** Colour, when part of the published listing name. */
  color?: string
  category: VehicleCategory
  seats: number
  doors: number
  airConditioning: boolean
  fuel?: 'Hybrid'
  /** Per-vehicle weekly rate, if the business publishes one. */
  weeklyRate?: number
  /** Short editorial line. Keep it descriptive, never a performance claim. */
  tagline: string
  remoteImages: string[]
}

export const categoryLabels: Record<VehicleCategory, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  hybrid: 'Hybrid',
  compact: 'Compact',
}

export const vehicles: Vehicle[] = [
  {
    slug: 'toyota-camry',
    make: 'Toyota',
    model: 'Camry',
    category: 'sedan',
    seats: 4,
    doors: 4,
    airConditioning: true,
    tagline: 'The everyday benchmark. Composed, comfortable, quietly capable.',
    // Representative model photo found through image search.
    // Source: https://uae.yallamotor.com/new-cars/toyota/camry/2014
    remoteImages: ['https://ymimg1.b8cdn.com/resized/car_model/1274/pictures/13983485/listing_main_ext-3231303035.jpg'],
  },
  {
    slug: 'ford-escape',
    make: 'Ford',
    model: 'Escape',
    category: 'suv',
    seats: 4,
    doors: 4,
    airConditioning: true,
    tagline: 'A higher seat and a flexible cabin for days that carry more.',
    // Representative model photo found through image search.
    // Source: https://www.kengarff.com/inventory/used-2018-ford-escape-se-fwd-sport-utility-1fmcu0gd9jud42773/
    remoteImages: ['https://content.homenetiol.com/2000292/2140908/0x0/stock_images/5/2018FOS13_640/2018FOS130003_640_01.jpg'],
  },
  {
    slug: 'ford-fusion',
    make: 'Ford',
    model: 'Fusion',
    category: 'sedan',
    seats: 4,
    doors: 4,
    airConditioning: true,
    tagline: 'Clean lines and an easy, settled ride across the city.',
    // Representative model photo found through image search.
    // Source: https://autoreliabilityindex.com/chevrolet/malibu/2020
    remoteImages: ['https://autoreliabilityindex.com/vehicles/ford-fusion.webp'],
  },
  {
    slug: 'subaru-impreza-2020',
    make: 'Subaru',
    model: 'Impreza',
    year: 2020,
    category: 'compact',
    seats: 4,
    doors: 4,
    airConditioning: true,
    tagline: 'Compact footprint, confident manners — made for the city grid.',
    // Representative model photo found through image search.
    // Source: https://www.kbb.com/subaru/impreza/2020/premium-sedan-4d/
    remoteImages: ['https://file.kelleybluebookimages.com/kbb/base/evox/StJ/13897/2020-Subaru-Impreza-front-view_13897_118_640x480.jpg'],
  },
  {
    slug: 'toyota-camry-hybrid-2014',
    make: 'Toyota',
    model: 'Camry Hybrid',
    year: 2014,
    category: 'hybrid',
    fuel: 'Hybrid',
    seats: 4,
    doors: 4,
    airConditioning: true,
    tagline: 'Hybrid efficiency for long weeks behind the wheel.',
    // Representative model photo found through image search.
    // Source: https://www.cars.com/research/toyota-camry_hybrid-2014/trims/
    remoteImages: ['https://platform.cstatic-images.com/in/v2/stock_photos/dbe66415-564a-4778-aa4a-228e06514a81/99ba7c0a-fb2c-4f6d-848d-763d4d5459e0.png'],
  },
  {
    slug: 'toyota-camry-2015',
    make: 'Toyota',
    model: 'Camry',
    year: 2015,
    category: 'sedan',
    seats: 4,
    doors: 4,
    airConditioning: true,
    tagline: 'Proven, practical and ready for the week ahead.',
    // Representative model photo found through image search.
    // Source: https://www.cars.com/research/toyota-camry-2015/trims/
    remoteImages: ['https://platform.cstatic-images.com/in/v2/stock_photos/c5b21d0e-7dc8-4381-920d-7b13420e45d9/0d4b0355-f4b5-4586-aa6a-41923660cbf8.png'],
  },
  {
    slug: 'toyota-camry-2014',
    make: 'Toyota',
    model: 'Camry',
    year: 2014,
    category: 'sedan',
    seats: 4,
    doors: 4,
    airConditioning: true,
    tagline: 'A dependable sedan with nothing to prove.',
    // Representative model photo found through image search.
    // Source: https://uae.yallamotor.com/new-cars/toyota/camry/2014
    remoteImages: ['https://ymimg1.b8cdn.com/resized/car_model/1274/pictures/13983485/listing_main_ext-3231303035.jpg'],
  },
  {
    slug: 'toyota-camry-2013',
    make: 'Toyota',
    model: 'Camry',
    year: 2013,
    category: 'sedan',
    seats: 4,
    doors: 4,
    airConditioning: true,
    tagline: 'Simple, steady transport — the way a week should go.',
    // Representative model photo found through image search.
    // Source: https://www.cars.com/research/toyota-camry-2013/
    remoteImages: ['https://platform.cstatic-images.com/xlarge/in/v2/stock_photos/38d5de7b-d3a6-4bbb-aa6d-c735baa4cbd6/39510fa0-72f5-48f8-95ae-6937ded3dc35.png'],
  },
  {
    slug: 'toyota-camry-2012-black',
    make: 'Toyota',
    model: 'Camry',
    year: 2012,
    color: 'Black',
    category: 'sedan',
    seats: 4,
    doors: 4,
    airConditioning: true,
    tagline: 'Understated in black. Familiar from the first mile.',
    // Representative model photo found through image search.
    // Source: https://www.autoweb.com/toyota/camry/2012
    remoteImages: ['https://img.autobytel.com/chrome/colormatched/white/640/cc_2012toy003a_640/cc_2012toy003a_640_218.jpg'],
  },
]

export const vehicleName = (v: Vehicle) => [v.year, v.color, v.make, v.model].filter(Boolean).join(' ')

export const getVehicle = (slug: string | undefined) => vehicles.find((v) => v.slug === slug)

/** Categories that actually exist in the data, in display order. */
export const availableCategories = (Object.keys(categoryLabels) as VehicleCategory[]).filter((c) =>
  vehicles.some((v) => v.category === c),
)

/** Spec chips built strictly from published vehicle data. */
export const vehicleSpecList = (v: Vehicle) =>
  [`${v.seats} seats`, `${v.doors} doors`, v.airConditioning ? 'A/C' : null, v.fuel ?? null, categoryLabels[v.category]].filter(
    (s): s is string => Boolean(s),
  )
