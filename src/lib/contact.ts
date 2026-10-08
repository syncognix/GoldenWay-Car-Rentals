import { site } from '../config/site'
import { isEmail, isPhone, required, type Errors } from './validation'
import { mailtoHref, postJson, type SubmitResult } from './submit'

export type ContactDraft = { name: string; email: string; phone: string; message: string }
export type ContactField = keyof ContactDraft

export const emptyContact = (): ContactDraft => ({ name: '', email: '', phone: '', message: '' })

export function validateContact(d: ContactDraft): Errors<ContactField> {
  const e: Errors<ContactField> = {}
  if (!required(d.name)) e.name = 'Enter your name.'
  if (!isEmail(d.email)) e.email = 'Enter a valid email address.'
  if (d.phone.trim() && !isPhone(d.phone)) e.phone = 'Enter a valid 10-digit phone number, or leave it blank.'
  if (d.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).'
  return e
}

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT

export const submitContact = (d: ContactDraft): Promise<SubmitResult> =>
  postJson(ENDPOINT, { type: 'contact_message', submittedAt: new Date().toISOString(), ...d })

export const contactEmailHref = (d: ContactDraft) =>
  mailtoHref(
    site.email.display,
    `Website enquiry — ${d.name}`,
    `${d.message}\n\n— ${d.name}\n${d.email}${d.phone ? `\n${d.phone}` : ''}`,
  )
