/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST endpoint for booking requests (JSON). Leave unset to use the email hand-off. */
  readonly VITE_BOOKING_ENDPOINT?: string
  /** POST endpoint for contact messages (JSON). */
  readonly VITE_CONTACT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
