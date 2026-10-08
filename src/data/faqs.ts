/**
 * FAQ content — answers are taken from rentgoldenway.com/faq (Oct 2026).
 * The only edits are formatting, plus the reservation answer, which now
 * points at this site's booking request flow.
 */

export type Faq = { q: string; a: string }
export type FaqGroup = { id: string; title: string; items: Faq[] }

export const faqGroups: FaqGroup[] = [
  {
    id: 'booking',
    title: 'Booking',
    items: [
      {
        q: 'How do I make a reservation?',
        a: 'Choose a vehicle from the fleet and submit a booking request on this site, or call 470-796-1836 or email support@rentgoldenway.com. Our team confirms availability and pickup details with you directly.',
      },
      {
        q: 'What vehicles are available?',
        a: 'All vehicles currently available in our fleet are listed on our Fleet page. Availability changes week to week, so our team confirms your vehicle when you book.',
      },
      {
        q: 'What is the minimum rental period?',
        a: 'The minimum rental period is 7 days. Weekly rentals are $375 per week, and the 7-day minimum is firm.',
      },
      {
        q: 'Can I extend my rental?',
        a: 'Yes. Rental extensions may be requested up to 24 hours before your scheduled return time and are subject to availability.',
      },
    ],
  },
  {
    id: 'requirements',
    title: 'Requirements',
    items: [
      { q: 'What documents do I need to rent?', a: "A valid, non-expired driver's license is required." },
      {
        q: 'How old do I have to be to rent?',
        a: 'The minimum rental age is 25 years old. Renters between 21 and 25 are subject to verification and an additional fee.',
      },
      { q: 'Do you require a credit check?', a: 'No.' },
      { q: 'Is a deposit required?', a: 'No. We do not require a security deposit.' },
      { q: 'Do I need insurance to rent?', a: 'No.' },
    ],
  },
  {
    id: 'payment',
    title: 'Pricing & payment',
    items: [
      {
        q: 'What are your payment options?',
        a: 'We accept debit cards and all major credit cards. Contact support if you would like to pay using Zelle or another payment method. A debit card is kept on file.',
      },
      { q: 'Are there mileage limits?', a: 'No. All rentals include unlimited miles.' },
      {
        q: 'Can another driver use the vehicle?',
        a: 'Yes, for an additional authorized driver fee.',
      },
      {
        q: 'What happens if I receive a toll or traffic ticket?',
        a: 'Any tolls or traffic tickets will be reviewed and processed at the end of your rental period.',
      },
    ],
  },
  {
    id: 'on-the-road',
    title: 'On the road',
    items: [
      {
        q: 'Can I use the vehicle for Uber, Lyft, DoorDash, or delivery?',
        a: 'Yes. Our vehicles may be used for Uber, Lyft, DoorDash, and other approved delivery services. Uber and Lyft drivers must use the insurance coverage required by those platforms while driving for them.',
      },
      {
        q: 'What areas do you serve?',
        a: 'Our vehicles can be driven throughout the Atlanta area. Our centralized pickup location is in the Lenox area.',
      },
      { q: 'Can I take the vehicle outside of Georgia?', a: 'No.' },
      {
        q: 'Can I pick up and drop off the vehicle at the airport?',
        a: 'No. Pickups and drop-offs take place at designated locations. Locations vary and are confirmed through customer support.',
      },
      { q: 'Are pets allowed in the vehicles?', a: 'No.' },
      { q: 'Is smoking allowed in the vehicles?', a: 'No. Smoking is prohibited in all vehicles.' },
      {
        q: 'What is your fuel policy?',
        a: 'Return the vehicle with the same fuel level it had when you picked it up.',
      },
    ],
  },
  {
    id: 'coverage',
    title: 'Coverage & support',
    items: [
      {
        q: 'What if I damage the vehicle?',
        a: 'The vehicle is insured. If you damage the vehicle, you are responsible for a $1,000 deductible. If you purchased a Collision Damage Waiver (CDW), you are not responsible for covered at-fault damage as described in the waiver.',
      },
      {
        q: 'What if the vehicle breaks down?',
        a: 'Required maintenance is covered by Golden Way Car Rentals. Optional roadside assistance may be added before checkout for an additional charge.',
      },
      {
        q: 'Is roadside assistance available?',
        a: 'Yes. Roadside assistance is available as an optional add-on.',
      },
      {
        q: 'What happens if I get a flat tire?',
        a: 'If you purchased roadside assistance, roadside assistance will be available to you. If you did not purchase roadside assistance, contact support and we will arrange for a technician to assist you as soon as possible.',
      },
      {
        q: 'How do I report an accident?',
        a: 'First, call 911 if there are injuries or an emergency. Then immediately notify Golden Way Car Rentals by calling 470-796-1836 or emailing support@rentgoldenway.com.',
      },
      {
        q: 'What happens if I return the vehicle late?',
        a: 'A 30-minute grace period applies. After that, late fees will be assessed as outlined in your signed rental agreement.',
      },
      { q: 'What happens if I lose the key?', a: 'A lost key fee of $200 applies as outlined in the rental agreement.' },
      {
        q: 'How do I contact customer support?',
        a: 'Call 470-796-1836 or email support@rentgoldenway.com.',
      },
    ],
  },
]

export const allFaqs = faqGroups.flatMap((g) => g.items)

/** A short, high-intent subset for the homepage and contact page. */
export const featuredFaqs = [
  'What is the minimum rental period?',
  'Is a deposit required?',
  'Can I use the vehicle for Uber, Lyft, DoorDash, or delivery?',
  'What documents do I need to rent?',
]
  .map((q) => allFaqs.find((f) => f.q === q))
  .filter((f): f is Faq => Boolean(f))
