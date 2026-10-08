import { site, addressLines } from './site'
import type { Faq } from '../data/faqs'
import { vehicleName, type Vehicle } from '../data/vehicles'

/**
 * Structured data builders. Only verified business facts are emitted —
 * no ratings or reviews until real ones exist.
 */

export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  '@id': `${site.url}/#business`,
  name: site.name,
  url: site.url,
  telephone: site.phone.href.replace('tel:', ''),
  email: site.email.display,
  founder: { '@type': 'Person', name: site.owner },
  address: {
    '@type': 'PostalAddress',
    streetAddress: addressLines.line1,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.address.geo.lat, longitude: site.address.geo.lng },
  areaServed: { '@type': 'City', name: 'Atlanta' },
  openingHoursSpecification: site.hours
    .filter((h) => h.schema)
    .map(() => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    })),
  sameAs: [site.social.facebook, site.social.instagram],
}

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${site.url}${it.path}`,
  })),
})

export const faqSchema = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})

export const vehicleSchema = (v: Vehicle, image?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Car',
  name: vehicleName(v),
  brand: { '@type': 'Brand', name: v.make },
  model: v.model,
  ...(v.year ? { vehicleModelDate: String(v.year) } : {}),
  ...(v.color ? { color: v.color } : {}),
  ...(v.fuel ? { fuelType: v.fuel } : {}),
  numberOfDoors: v.doors,
  seatingCapacity: v.seats,
  ...(image ? { image } : {}),
  url: `${site.url}/fleet/${v.slug}`,
  provider: { '@id': `${site.url}/#business` },
})
