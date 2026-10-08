import { addressLines, mapsLinks } from '../config/site'

/**
 * Pickup points are the three listed on rentgoldenway.com. The business notes
 * that "locations vary and are confirmed through customer support", so the UI
 * always presents them as subject to confirmation.
 */

export type Location = {
  id: string
  name: string
  area: string
  kind: 'office' | 'pickup'
  description: string
  lines: string[]
  directionsUrl: string
  /** Primary pickup point per the FAQ ("centralized pickup location is in the Lenox area"). */
  primary?: boolean
}

const search = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

export const office: Location = {
  id: 'office',
  name: 'GoldenWay Office',
  area: 'Downtown Atlanta',
  kind: 'office',
  description: 'Our business office on Peachtree Street, in the heart of Downtown Atlanta.',
  lines: [addressLines.line1, addressLines.line2],
  directionsUrl: mapsLinks.directions,
}

export const pickupPoints: Location[] = [
  {
    id: 'lenox',
    name: 'Lenox MARTA',
    area: 'Buckhead',
    kind: 'pickup',
    description: 'Our centralized pickup point in the Lenox area.',
    lines: ['Lenox MARTA Station area', 'Buckhead, Atlanta, GA'],
    directionsUrl: search('Lenox MARTA Station, Atlanta, GA'),
    primary: true,
  },
  {
    id: 'cumberland',
    name: 'Cumberland Mall',
    area: 'Cumberland',
    kind: 'pickup',
    description: 'Pickup point serving the Cumberland area.',
    lines: ['Cumberland Mall area', 'Atlanta, GA'],
    directionsUrl: search('Cumberland Mall, Atlanta, GA'),
  },
  {
    id: 'brookhaven',
    name: 'Brookhaven MARTA',
    area: 'Brookhaven',
    kind: 'pickup',
    description: 'Pickup point serving Brookhaven.',
    lines: ['Brookhaven / Oglethorpe MARTA area', 'Brookhaven, GA'],
    directionsUrl: search('Brookhaven Oglethorpe MARTA Station, GA'),
  },
]

export const pickupLabel = (id: string) => {
  const p = pickupPoints.find((x) => x.id === id)
  return p ? `${p.area} — ${p.name}` : id
}
