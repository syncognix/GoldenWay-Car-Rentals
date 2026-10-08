/**
 * Customer reviews.
 *
 * Intentionally empty: no verified reviews were supplied. Add genuine reviews
 * (with the customer's permission) and every review surface switches on —
 * the homepage section, the /reviews carousel and the structured data.
 * Never add invented or paraphrased quotes.
 */

export type Review = {
  id: string
  quote: string
  name: string
  /** e.g. "Rideshare driver" — only if the customer agreed to it. */
  context?: string
  /** 1–5, only when taken from a real rating. */
  rating?: number
  source?: 'Google' | 'Facebook' | 'Direct'
  date?: string
}

export const reviews: Review[] = []
