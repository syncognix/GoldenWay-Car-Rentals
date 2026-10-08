/** Date helpers working on local ISO dates (YYYY-MM-DD), timezone-safe. */

const pad = (n: number) => String(n).padStart(2, '0')

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export const todayISO = () => toISODate(new Date())

export const addDays = (iso: string, days: number) => {
  const d = parseISODate(iso)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export const diffDays = (fromISO: string, toISO: string) =>
  Math.round((parseISODate(toISO).getTime() - parseISODate(fromISO).getTime()) / 86_400_000)

export const isValidISODate = (iso: string) => /^\d{4}-\d{2}-\d{2}$/.test(iso) && !Number.isNaN(parseISODate(iso).getTime())

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) =>
  isValidISODate(iso) ? new Intl.DateTimeFormat('en-US', opts).format(parseISODate(iso)) : '—'

export const isSunday = (iso: string) => isValidISODate(iso) && parseISODate(iso).getDay() === 0
