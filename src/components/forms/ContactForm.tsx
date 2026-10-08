import { useState, type FormEvent } from 'react'
import { contactEmailHref, emptyContact, submitContact, validateContact, type ContactDraft, type ContactField } from '../../lib/contact'
import { hasErrors, type Errors } from '../../lib/validation'
import type { SubmitResult } from '../../lib/submit'
import { site } from '../../config/site'
import { TextAreaField, TextField } from './Field'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import './ContactForm.css'

type Status = 'idle' | 'submitting' | SubmitResult['status']

export function ContactForm() {
  const [draft, setDraft] = useState<ContactDraft>(emptyContact)
  const [errors, setErrors] = useState<Errors<ContactField>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const set = (k: ContactField, v: string) => {
    setDraft((d) => ({ ...d, [k]: v }))
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validateContact(draft)
    setErrors(errs)
    if (hasErrors(errs)) {
      e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus('submitting')
    const res = await submitContact(draft)
    setStatus(res.status)
    if (res.status === 'error') setMessage(res.message)
  }

  if (status === 'sent') {
    return (
      <div className="contact-result" role="status">
        <span className="contact-result__icon contact-result__icon--ok">
          <Icon name="check" size={24} />
        </span>
        <h3 className="t-h3">Message sent.</h3>
        <p className="t-body">Thank you, {draft.name.split(' ')[0]}. Our team will reply to {draft.email}.</p>
      </div>
    )
  }

  if (status === 'unconfigured' || status === 'error') {
    return (
      <div className="contact-result" role={status === 'error' ? 'alert' : 'status'}>
        <span className="contact-result__icon">
          <Icon name={status === 'error' ? 'alert' : 'mail'} size={22} />
        </span>
        <h3 className="t-h3">{status === 'error' ? 'We couldn’t send your message.' : 'Your message is ready to send.'}</h3>
        <p className="t-body">
          {status === 'error'
            ? `${message} You can send it by email instead, or call us.`
            : 'Online messaging isn’t connected yet, so nothing has been sent. Send it from your email app in one tap — it’s already written.'}
        </p>
        <div className="contact-result__actions">
          <Button href={contactEmailHref(draft)} leadingIcon="mail" icon={null}>
            Email my message
          </Button>
          <Button href={site.phone.href} variant="outline" leadingIcon="phone" icon={null}>
            Call {site.phone.display}
          </Button>
          <Button variant="text" icon={null} onClick={() => setStatus('idle')}>
            Edit message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form className="contact-form" noValidate onSubmit={onSubmit}>
      <div className="contact-form__grid">
        <TextField label="Name" required autoComplete="name" value={draft.name} error={errors.name} onChange={(e) => set('name', e.target.value)} />
        <TextField type="email" label="Email" required autoComplete="email" inputMode="email" value={draft.email} error={errors.email} onChange={(e) => set('email', e.target.value)} />
        <TextField
          className="contact-form__full"
          type="tel"
          label="Phone (optional)"
          autoComplete="tel"
          inputMode="tel"
          value={draft.phone}
          error={errors.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
        <TextAreaField
          className="contact-form__full"
          label="Message"
          required
          rows={6}
          value={draft.message}
          error={errors.message}
          placeholder="How can we help?"
          onChange={(e) => set('message', e.target.value)}
        />
      </div>
      <div className="contact-form__foot">
        <p className="t-small">For bookings, the booking request form is the fastest route.</p>
        <Button type="submit" size="lg" magnetic disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}
