export type Errors<K extends string = string> = Partial<Record<K, string>>

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

/** US-friendly phone check: 10 digits, optionally prefixed with country code 1. */
export const isPhone = (v: string) => {
  const digits = v.replace(/\D/g, '')
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))
}

export const required = (v: string | undefined | null) => Boolean(v && v.trim())

export const hasErrors = (e: Errors) => Object.values(e).some(Boolean)
