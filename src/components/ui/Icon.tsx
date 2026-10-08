import type { SVGProps } from 'react'

const paths = {
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  arrowLeft: <path d="M20 12H5m6-6-6 6 6 6" />,
  arrowUpRight: <path d="M7 17 17 7M9 7h8v8" />,
  phone: (
    <path d="M5.2 3.5h3.1l1.6 4.1-2.1 1.3a11 11 0 0 0 5.3 5.3l1.3-2.1 4.1 1.6v3.1a1.7 1.7 0 0 1-1.8 1.7A15.6 15.6 0 0 1 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4m8-4v4" />
    </>
  ),
  car: (
    <>
      <path d="M3.5 15.5v-3l2-4.5a2 2 0 0 1 1.8-1.2h9.4a2 2 0 0 1 1.8 1.2l2 4.5v3" />
      <path d="M2.5 15.5h19v2.5h-19z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 8h16M4 16h16" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2m0 15v2M4.6 4.6 6 6m12 12 1.4 1.4M2.5 12h2m15 0h2M4.6 19.4 6 18m12-12 1.4-1.4" />
    </>
  ),
  moon: <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  shield: <path d="M12 3 5 6v5.5c0 4.4 3 8.2 7 9.5 4-1.3 7-5.1 7-9.5V6l-7-3Z" />,
  infinity: <path d="M7.5 15.5a3.5 3.5 0 1 1 0-7c3.5 0 5.5 7 9 7a3.5 3.5 0 1 0 0-7c-3.5 0-5.5 7-9 7Z" />,
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2" />
    </>
  ),
  spark: <path d="M12 3v5m0 8v5M3 12h5m8 0h5M6 6l3 3m6 6 3 3M6 18l3-3m6-6 3-3" />,
  facebook: <path d="M14 8.5V7c0-.8.5-1.2 1.2-1.2H17V3h-2.6C11.8 3 11 4.7 11 6.8v1.7H9V11.5h2V21h3v-9.5h2.4l.6-3H14Z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
    </>
  ),
  google: <path d="M20.5 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.6-3.9 2.6-6.5ZM12 21c2.4 0 4.5-.8 5.9-2.2L15 16.6c-.8.5-1.8.9-3 .9-2.3 0-4.3-1.6-5-3.7H4v2.3A9 9 0 0 0 12 21Zm-5-7.2a5.4 5.4 0 0 1 0-3.5V8H4a9 9 0 0 0 0 8.1l3-2.3ZM12 6.6c1.3 0 2.5.5 3.4 1.3L18 5.3A9 9 0 0 0 4 8l3 2.3c.7-2.1 2.7-3.7 5-3.7Z" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />,
  external: <path d="M14 4h6v6m0-6-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19L12 3.5Z" />
      <path d="M12 10v4.5m0 2.5v.5" />
    </>
  ),
} as const

export type IconName = keyof typeof paths

type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number }

export function Icon({ name, size = 18, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}
