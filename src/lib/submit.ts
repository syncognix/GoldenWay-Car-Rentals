/**
 * Transport for form submissions. Configure an endpoint with environment
 * variables (see .env.example) to send JSON to an API, CRM webhook or email
 * service. With no endpoint configured, callers receive `unconfigured` and the
 * UI offers phone/email hand-off instead of pretending the request was sent.
 */

export type SubmitResult =
  | { status: 'sent'; reference?: string }
  | { status: 'unconfigured' }
  | { status: 'error'; message: string }

export async function postJson(endpoint: string | undefined, payload: unknown, timeoutMs = 15000): Promise<SubmitResult> {
  if (!endpoint) return { status: 'unconfigured' }
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (!res.ok) return { status: 'error', message: `The server responded with ${res.status}.` }
    const data = (await res.json().catch(() => ({}))) as { reference?: string; id?: string }
    return { status: 'sent', reference: data.reference ?? data.id }
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError'
    return { status: 'error', message: aborted ? 'The request timed out.' : 'We could not reach the server.' }
  } finally {
    window.clearTimeout(timer)
  }
}

/** mailto: link with a prefilled subject and body. */
export const mailtoHref = (to: string, subject: string, body: string) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
