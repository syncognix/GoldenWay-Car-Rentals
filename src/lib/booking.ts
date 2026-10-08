import { site, formatCurrency } from '../config/site'
import { getVehicle, vehicleName } from '../data/vehicles'
import { pickupLabel, pickupPoints } from '../data/locations'
import { addDays, diffDays, formatDate, isValidISODate, todayISO } from './dates'
import { isEmail, isPhone, required, type Errors } from './validation'
import { mailtoHref, postJson, type SubmitResult } from './submit'

/**
 * Booking request domain: data shape, per-step validation, URL prefill and
 * submission. The UI only talks to these functions, so wiring an API, CRM or
 * payment flow later doesn't touch the components.
 */

export const PICKUP_WINDOWS = [
  { value: 'morning', label: 'Morning · 9 AM – 12 PM' },
  { value: 'midday', label: 'Midday · 12 – 3 PM' },
  { value: 'afternoon', label: 'Afternoon · 3 – 6 PM' },
] as const

export const AGE_GROUPS = [
  { value: '25+', label: '25 or older' },
  { value: '21-24', label: '21 – 24 (verification & additional fee apply)' },
] as const

export const USAGE = [
  { value: 'personal', label: 'Personal use' },
  { value: 'rideshare', label: 'Rideshare (Uber, Lyft)' },
  { value: 'delivery', label: 'Delivery (DoorDash, Amazon Flex, Instacart…)' },
  { value: 'work', label: 'Work / other' },
] as const

export type BookingDraft = {
  vehicle: string // vehicle slug or 'any'
  location: string // pickup point id
  pickupDate: string
  returnDate: string
  pickupWindow: string
  firstName: string
  lastName: string
  email: string
  phone: string
  ageGroup: string
  usage: string
  notes: string
  licenseConfirmed: boolean
}

export type BookingField = keyof BookingDraft

export const emptyDraft = (): BookingDraft => ({
  vehicle: '',
  location: pickupPoints.find((p) => p.primary)?.id ?? '',
  pickupDate: '',
  returnDate: '',
  pickupWindow: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  ageGroup: '',
  usage: '',
  notes: '',
  licenseConfirmed: false,
})

export const BOOKING_STEPS = [
  { id: 'vehicle', index: '01', title: 'Your vehicle' },
  { id: 'dates', index: '02', title: 'Your dates' },
  { id: 'details', index: '03', title: 'Your details' },
  { id: 'confirm', index: '04', title: 'Confirm' },
] as const

export const minimumDays = site.terms.minimumDays

export function validateDates(d: Pick<BookingDraft, 'pickupDate' | 'returnDate'>): Errors<'pickupDate' | 'returnDate'> {
  const e: Errors<'pickupDate' | 'returnDate'> = {}
  const today = todayISO()
  if (!isValidISODate(d.pickupDate)) e.pickupDate = 'Choose a pickup date.'
  else if (d.pickupDate < today) e.pickupDate = 'Pickup date can’t be in the past.'
  if (!isValidISODate(d.returnDate)) e.returnDate = 'Choose a return date.'
  else if (isValidISODate(d.pickupDate) && diffDays(d.pickupDate, d.returnDate) < minimumDays)
    e.returnDate = `Rentals have a ${minimumDays}-day minimum — return on or after ${formatDate(addDays(d.pickupDate, minimumDays), { month: 'short', day: 'numeric' })}.`
  return e
}

export function validateStep(step: number, d: BookingDraft): Errors<BookingField> {
  const e: Errors<BookingField> = {}
  if (step === 0) {
    if (!d.vehicle) e.vehicle = 'Choose a vehicle, or select “No preference”.'
  }
  if (step === 1) {
    Object.assign(e, validateDates(d))
    if (!d.location) e.location = 'Choose a pickup point.'
  }
  if (step === 2) {
    if (!required(d.firstName)) e.firstName = 'Enter your first name.'
    if (!required(d.lastName)) e.lastName = 'Enter your last name.'
    if (!isEmail(d.email)) e.email = 'Enter a valid email address.'
    if (!isPhone(d.phone)) e.phone = 'Enter a valid 10-digit phone number.'
    if (!d.ageGroup) e.ageGroup = 'Select your age group.'
    if (!d.licenseConfirmed) e.licenseConfirmed = 'A valid, non-expired driver’s license is required to rent.'
  }
  return e
}

/* ---------- URL prefill (hero quick-book → /book) ---------- */

const PARAMS: BookingField[] = ['vehicle', 'location', 'pickupDate', 'returnDate']

export function draftToSearch(d: Partial<BookingDraft>) {
  const sp = new URLSearchParams()
  for (const k of PARAMS) {
    const v = d[k]
    if (typeof v === 'string' && v) sp.set(k, v)
  }
  return sp.toString()
}

export function draftFromSearch(sp: URLSearchParams): Partial<BookingDraft> {
  const out: Partial<BookingDraft> = {}
  const vehicle = sp.get('vehicle')
  if (vehicle && (vehicle === 'any' || getVehicle(vehicle))) out.vehicle = vehicle
  const location = sp.get('location')
  if (location && pickupPoints.some((p) => p.id === location)) out.location = location
  const pickup = sp.get('pickupDate')
  if (pickup && isValidISODate(pickup)) out.pickupDate = pickup
  const ret = sp.get('returnDate')
  if (ret && isValidISODate(ret)) out.returnDate = ret
  return out
}

/* ---------- Presentation helpers ---------- */

export const vehicleLabel = (slug: string) => {
  if (slug === 'any') return 'No preference — best available'
  const v = getVehicle(slug)
  return v ? vehicleName(v) : '—'
}

export const labelOf = (list: readonly { value: string; label: string }[], value: string) =>
  list.find((o) => o.value === value)?.label ?? '—'

export function summarize(d: BookingDraft) {
  const days = isValidISODate(d.pickupDate) && isValidISODate(d.returnDate) ? diffDays(d.pickupDate, d.returnDate) : 0
  return {
    vehicle: vehicleLabel(d.vehicle),
    location: d.location ? pickupLabel(d.location) : '—',
    pickup: formatDate(d.pickupDate),
    return: formatDate(d.returnDate),
    window: labelOf(PICKUP_WINDOWS, d.pickupWindow),
    days,
    weeks: days / 7,
    rate: `${formatCurrency(site.terms.weeklyRateFrom)}/week`,
  }
}

/* ---------- Submission ---------- */

const ENDPOINT = import.meta.env.VITE_BOOKING_ENDPOINT

export function bookingPayload(d: BookingDraft) {
  return {
    type: 'booking_request' as const,
    submittedAt: new Date().toISOString(),
    vehicle: d.vehicle,
    vehicleName: vehicleLabel(d.vehicle),
    pickupPoint: d.location,
    pickupDate: d.pickupDate,
    returnDate: d.returnDate,
    pickupWindow: d.pickupWindow || null,
    customer: {
      firstName: d.firstName.trim(),
      lastName: d.lastName.trim(),
      email: d.email.trim(),
      phone: d.phone.trim(),
      ageGroup: d.ageGroup,
      usage: d.usage || null,
    },
    notes: d.notes.trim() || null,
    licenseConfirmed: d.licenseConfirmed,
  }
}

export const submitBookingRequest = (d: BookingDraft): Promise<SubmitResult> => postJson(ENDPOINT, bookingPayload(d))

/** Email hand-off used when no endpoint is configured (or it fails). */
export function bookingEmailHref(d: BookingDraft) {
  const s = summarize(d)
  const body = [
    'Hello GoldenWay team,',
    '',
    'I would like to request a rental:',
    '',
    `Vehicle: ${s.vehicle}`,
    `Pickup point: ${s.location}`,
    `Pickup: ${s.pickup}${d.pickupWindow ? ` (${s.window})` : ''}`,
    `Return: ${s.return} — ${s.days} days`,
    '',
    `Name: ${d.firstName} ${d.lastName}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    `Age group: ${labelOf(AGE_GROUPS, d.ageGroup)}`,
    `Use: ${labelOf(USAGE, d.usage)}`,
    d.notes ? `Notes: ${d.notes}` : '',
    '',
    'Thank you.',
  ]
    .filter((l) => l !== null)
    .join('\n')
  return mailtoHref(site.email.display, `Booking request — ${s.vehicle}, ${s.pickup}`, body)
}
