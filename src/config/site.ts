/**
 * Single source of truth for GoldenWay business information.
 *
 * Every value here is sourced from the client brief or the live site
 * (rentgoldenway.com, retrieved Oct 2026). Do not add claims that the
 * business has not confirmed — leave a field `null` and the UI adapts.
 */

export const site = {
  name: 'GoldenWay Car Rentals',
  shortName: 'GoldenWay',
  legalName: 'Golden Way Car Rentals',
  owner: 'Robert',
  url: 'https://rentgoldenway.com',
  locale: 'en_US',

  phone: {
    display: '+1 470-796-1836',
    href: 'tel:+14707961836',
  },
  email: {
    display: 'support@rentgoldenway.com',
    href: 'mailto:support@rentgoldenway.com',
  },

  address: {
    street: '235 Peachtree St. NE',
    suite: 'Suite 400',
    city: 'Atlanta',
    region: 'GA',
    postalCode: '30303',
    country: 'US',
    countryName: 'United States',
    /** Approximate — used for decorative coordinates and map centring only. */
    geo: { lat: 33.7607, lng: -84.3871 },
  },

  hours: [
    { days: 'Monday – Saturday', schema: 'Mo-Sa', opens: '09:00', closes: '18:00', label: '9:00 AM – 6:00 PM' },
    { days: 'Sunday', schema: null, opens: null, closes: null, label: 'Closed' },
  ],

  social: {
    facebook: 'https://www.facebook.com/goldenwaycarrentals/',
    instagram: 'https://www.instagram.com/goldenwaycarrentals',
    /** Google share link published on the live site (business profile). */
    google: 'https://share.google/p2YmwU5FLzGJKolf8',
  },

  /**
   * Rental terms published on rentgoldenway.com. These drive the terms strip,
   * fleet pricing labels, booking validation and FAQ copy.
   */
  terms: {
    weeklyRateFrom: 375,
    currency: 'USD',
    minimumDays: 7,
    deposit: false,
    insuranceIncluded: true,
    unlimitedMiles: true,
    creditCheck: false,
    minimumAge: 25,
    youngDriverAge: 21,
    damageDeductible: 1000,
    lostKeyFee: 200,
    lateGraceMinutes: 30,
    extensionNoticeHours: 24,
    gigPlatforms: ['Uber', 'Lyft', 'DoorDash', 'Amazon Flex', 'Instacart'],
  },

  /**
   * Optional external reservation system (the live site runs on Rent Centric).
   * Set to the public booking URL to surface a "Reserve online" action.
   */
  reservationUrl: null as string | null,
} as const

const fullAddress = `${site.address.street}, ${site.address.suite}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`

export const addressLines = {
  line1: `${site.address.street}, ${site.address.suite}`,
  line2: `${site.address.city}, ${site.address.region} ${site.address.postalCode}`,
  full: fullAddress,
}

export const mapsLinks = {
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`,
  embed: `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`,
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: site.terms.currency, maximumFractionDigits: 0 }).format(value)

export const rateLabel = `From ${formatCurrency(site.terms.weeklyRateFrom)}/week`

/** Decorative coordinate label, e.g. 33.7607° N · 84.3871° W */
export const coordinates = `${site.address.geo.lat.toFixed(4)}° N · ${Math.abs(site.address.geo.lng).toFixed(4)}° W`
