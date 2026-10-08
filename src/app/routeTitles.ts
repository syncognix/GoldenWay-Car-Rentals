import { getVehicle, vehicleName } from '../data/vehicles'

const titles: Record<string, string> = {
  '/': 'Home',
  '/fleet': 'The Fleet',
  '/book': 'Book',
  '/how-it-works': 'How It Works',
  '/about': 'About',
  '/why-goldenway': 'Why GoldenWay',
  '/locations': 'Locations',
  '/gallery': 'Gallery',
  '/reviews': 'Reviews',
  '/faq': 'FAQ',
  '/contact': 'Contact',
  '/policies': 'Policies',
}

/** Short label for the page-transition curtain. */
export function routeTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname]
  const m = pathname.match(/^\/fleet\/([^/]+)/)
  if (m) {
    const v = getVehicle(m[1])
    if (v) return vehicleName(v)
  }
  return 'GoldenWay'
}
