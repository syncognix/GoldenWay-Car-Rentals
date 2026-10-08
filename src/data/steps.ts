import { site, formatCurrency } from '../config/site'

/**
 * The rental journey. Each step is grounded in the published FAQ — nothing
 * here promises a process the business hasn't described.
 */

export type Step = {
  index: string
  label: string
  title: string
  body: string
  facts: string[]
  backdrop: 'road' | 'tunnel' | 'city' | 'bokeh' | 'horizon'
}

const t = site.terms

export const rentalSteps: Step[] = [
  {
    index: '01',
    label: 'Select',
    title: 'Choose your vehicle',
    body: 'Browse the fleet — sedans, an SUV, a hybrid and a compact — and pick the car that fits your week.',
    facts: ['4 doors · A/C', 'Gig-approved', `From ${formatCurrency(t.weeklyRateFrom)}/week`],
    backdrop: 'bokeh',
  },
  {
    index: '02',
    label: 'Schedule',
    title: 'Choose your dates',
    body: `Rentals run weekly or monthly, with a firm ${t.minimumDays}-day minimum. Tell us when you need the car and for how long.`,
    facts: [`${t.minimumDays}-day minimum`, 'Weekly & monthly', 'Extensions on request'],
    backdrop: 'horizon',
  },
  {
    index: '03',
    label: 'Request',
    title: 'Submit your request',
    body: "Send your booking request with your details. You'll need a valid, non-expired driver's license and a valid payment method. Additional verification may be requested.",
    facts: ["Driver's license", 'No credit check', 'No deposit'],
    backdrop: 'tunnel',
  },
  {
    index: '04',
    label: 'Confirm',
    title: 'Confirm & pick up',
    body: 'Our team confirms your vehicle and your pickup point — Buckhead (Lenox MARTA), Cumberland or Brookhaven — directly with you.',
    facts: ['Pickup confirmed by support', 'Insurance included', 'Unlimited miles'],
    backdrop: 'city',
  },
  {
    index: '05',
    label: 'Return',
    title: 'Drive, then return',
    body: `Return with the same fuel level you picked up with. A ${t.lateGraceMinutes}-minute grace period applies, and extensions can be requested up to ${t.extensionNoticeHours} hours before your return time.`,
    facts: ['Same fuel level', `${t.lateGraceMinutes}-min grace`, 'Georgia only'],
    backdrop: 'road',
  },
]
