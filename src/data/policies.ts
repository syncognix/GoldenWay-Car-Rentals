/**
 * Policy documents.
 *
 * Sections marked `status: 'pending'` are placeholders awaiting official text
 * from GoldenWay. Their content is rendered with a visible "official text
 * pending" note so nothing reads as legally binding before it is supplied.
 *
 * `summary` sections restate terms published on rentgoldenway.com; the signed
 * rental agreement always governs.
 */

export type PolicyBlock = { heading?: string; paragraphs?: string[]; list?: string[] }

export type PolicySection = {
  id: string
  title: string
  status: 'summary' | 'pending'
  blocks: PolicyBlock[]
}

export const policiesUpdated: string | null = null

export const policySections: PolicySection[] = [
  {
    id: 'rental-terms',
    title: 'Rental terms',
    status: 'summary',
    blocks: [
      {
        paragraphs: [
          'This is a plain-language summary of the rental terms published by Golden Way Car Rentals. Your signed rental agreement is the governing document.',
        ],
      },
      {
        heading: 'Eligibility',
        list: [
          "A valid, non-expired driver's license is required.",
          'The minimum rental age is 25. Renters between 21 and 25 are subject to verification and an additional fee.',
          'A valid payment method is required. Debit cards and all major credit cards are accepted; a debit card is kept on file.',
          'Additional verification may be requested. No credit check and no security deposit are required.',
        ],
      },
      {
        heading: 'Rental period',
        list: [
          'The minimum rental period is 7 days and is firm.',
          'Extensions may be requested up to 24 hours before the scheduled return time and are subject to availability.',
          'A 30-minute grace period applies to returns. After that, late fees are assessed as outlined in the rental agreement.',
        ],
      },
    ],
  },
  {
    id: 'vehicle-use',
    title: 'Vehicle use',
    status: 'summary',
    blocks: [
      {
        list: [
          'Vehicles may be driven throughout the Atlanta area and may not be taken outside of Georgia.',
          'Vehicles may be used for Uber, Lyft, DoorDash and other approved delivery services. Uber and Lyft drivers must use the insurance coverage required by those platforms while driving for them.',
          'Smoking and vaping are prohibited in all vehicles.',
          'Pets are not allowed in the vehicles.',
          'Additional drivers are permitted for an additional authorized driver fee.',
          'Return the vehicle with the same fuel level it had at pickup.',
        ],
      },
    ],
  },
  {
    id: 'coverage',
    title: 'Insurance, damage & fees',
    status: 'summary',
    blocks: [
      {
        list: [
          'Vehicles are insured. If the vehicle is damaged, the renter is responsible for a $1,000 deductible.',
          'An optional Collision Damage Waiver (CDW) is available. With CDW, the renter is not responsible for covered at-fault damage as described in the waiver.',
          'Required maintenance is covered by Golden Way Car Rentals. Roadside assistance is available as an optional add-on.',
          'A lost key fee of $200 applies as outlined in the rental agreement.',
          'Tolls and traffic tickets are reviewed and processed at the end of the rental period.',
        ],
      },
      {
        heading: 'Accidents',
        paragraphs: [
          'Call 911 first if there are injuries or an emergency. Then notify Golden Way Car Rentals immediately at 470-796-1836 or support@rentgoldenway.com.',
        ],
      },
    ],
  },
  {
    id: 'cancellations',
    title: 'Cancellations & changes',
    status: 'pending',
    blocks: [
      {
        paragraphs: [
          'GoldenWay’s official cancellation and booking-change policy will be published here. Until then, please contact our team directly about changes to a reservation.',
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy policy',
    status: 'pending',
    blocks: [
      {
        paragraphs: [
          'GoldenWay’s official privacy policy will be published here, describing what personal information is collected through this website and booking requests, how it is used and stored, and how to request access or deletion.',
          'Questions about your information can be sent to support@rentgoldenway.com in the meantime.',
        ],
      },
    ],
  },
  {
    id: 'terms-of-use',
    title: 'Website terms of use',
    status: 'pending',
    blocks: [
      {
        paragraphs: ['The official terms governing use of rentgoldenway.com will be published here.'],
      },
    ],
  },
]
