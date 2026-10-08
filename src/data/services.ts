import { site, formatCurrency } from '../config/site'

/**
 * Value propositions. Every line maps to a published term on rentgoldenway.com.
 */

const t = site.terms

export type Term = { label: string; value: string; detail: string }

/** The "spec sheet" of renting with GoldenWay. */
export const keyTerms: Term[] = [
  { label: 'Weekly rate', value: `From ${formatCurrency(t.weeklyRateFrom)}`, detail: 'Straightforward weekly pricing' },
  { label: 'Deposit', value: 'None', detail: 'No security deposit required' },
  { label: 'Insurance', value: 'Included', detail: `Vehicle insured · ${formatCurrency(t.damageDeductible)} deductible` },
  { label: 'Mileage', value: 'Unlimited', detail: 'No mileage limits on any rental' },
  { label: 'Minimum', value: `${t.minimumDays} days`, detail: 'Weekly and monthly terms' },
  { label: 'Credit check', value: 'None', detail: "A valid driver's license is required" },
]

export type Pillar = {
  id: string
  index: string
  title: string
  kicker: string
  body: string
}

export const pillars: Pillar[] = [
  {
    id: 'pricing',
    index: '01',
    kicker: 'Transparent',
    title: 'Straightforward weekly pricing',
    body: `Rentals start from ${formatCurrency(t.weeklyRateFrom)} a week with a ${t.minimumDays}-day minimum, weekly and monthly terms, and no security deposit.`,
  },
  {
    id: 'gig',
    index: '02',
    kicker: 'Gig approved',
    title: 'Built for drivers who earn on the road',
    body: `Our vehicles may be used for ${t.gigPlatforms.slice(0, 4).join(', ')} and other approved delivery services.`,
  },
  {
    id: 'coverage',
    index: '03',
    kicker: 'Covered',
    title: 'Insurance included, maintenance handled',
    body: 'Every vehicle is insured and required maintenance is covered by GoldenWay. Roadside assistance and a Collision Damage Waiver are available as optional add-ons.',
  },
  {
    id: 'freedom',
    index: '04',
    kicker: 'Unrestricted',
    title: 'Unlimited miles, every rental',
    body: 'Every rental includes unlimited miles. Drive throughout the Atlanta area without watching the odometer — vehicles stay within Georgia.',
  },
  {
    id: 'simple',
    index: '05',
    kicker: 'Simple',
    title: 'No credit check. One document.',
    body: "A valid, non-expired driver's license is what you need. No credit check, and debit cards are accepted.",
  },
  {
    id: 'service',
    index: '06',
    kicker: 'Direct',
    title: 'A real team, one call away',
    body: `Clear communication from booking to return. Reach us on ${site.phone.display} or ${site.email.display}.`,
  },
]

/** The brand story, from the business's own About copy. */
export const brandStory = {
  intro:
    'Golden Way Car Rentals provides clean, reliable, and affordable vehicle rentals designed for drivers who need dependable transportation without the hassle of traditional rental companies.',
  specialty:
    'We specialize in straightforward weekly rentals that work for rideshare drivers, delivery drivers, and everyday renters who value simplicity, consistency, and service.',
  mission:
    'Our mission is to make renting a vehicle easy, transparent, and dependable. From the moment you book to the day you return the vehicle, our focus is on clear communication, well-maintained cars, and a rental experience built around convenience.',
  promise:
    'Whether you need a car for Uber, Lyft, DoorDash, Amazon Flex, work, or personal transportation, Golden Way is committed to helping you stay on the road with confidence.',
}
