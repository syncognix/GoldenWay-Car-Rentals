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

// Verbatim Google reviews, as published by GoldenWay on its Facebook page
// (facebook.com/goldenwaycarrentals, review cards retrieved Oct 2026).
export const reviews: Review[] = [
  {
    id: 'google-terrell',
    quote:
      'I had an excellent experience with this car rental service. The team was professional, friendly, and extremely easy to work with. The entire process was streamlined, straightforward, and efficient, which made renting a vehicle hassle-free. Communication was great, and everything was handled smoothly from start to finish. I truly appreciate the level of service and would definitely recommend them to anyone looking for a reliable and convenient car rental experience.',
    name: 'Terrell',
    rating: 5,
    source: 'Google',
  },
  {
    id: 'google-kevin',
    quote: 'Quick, easy, and the car was in good condition, the pricing was clear, and the customer service was top-notch.',
    name: 'Kevin',
    rating: 5,
    source: 'Google',
  },
]
