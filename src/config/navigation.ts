export type NavLink = { label: string; to: string }

export const primaryNav: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Fleet', to: '/fleet' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'Locations', to: '/locations' },
  { label: 'FAQ', to: '/faq' },
]

/** Extra destinations surfaced in the mobile menu. */
export const secondaryNav: NavLink[] = [
  { label: 'Why GoldenWay', to: '/why-goldenway' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Contact', to: '/contact' },
]

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Fleet',
    links: [
      { label: 'All vehicles', to: '/fleet' },
      { label: 'Sedans', to: '/fleet?category=sedan' },
      { label: 'SUV', to: '/fleet?category=suv' },
      { label: 'Hybrid', to: '/fleet?category=hybrid' },
      { label: 'Book a car', to: '/book' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About GoldenWay', to: '/about' },
      { label: 'Why GoldenWay', to: '/why-goldenway' },
      { label: 'Gallery', to: '/gallery' },
      { label: 'Reviews', to: '/reviews' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'How it works', to: '/how-it-works' },
      { label: 'Locations', to: '/locations' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Rental policies', to: '/policies' },
      { label: 'Privacy', to: '/policies#privacy' },
      { label: 'Terms of use', to: '/policies#terms-of-use' },
    ],
  },
]
