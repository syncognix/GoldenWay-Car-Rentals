import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'react-router'
import {
  AGE_GROUPS,
  BOOKING_STEPS,
  USAGE,
  bookingEmailHref,
  draftFromSearch,
  emptyDraft,
  labelOf,
  submitBookingRequest,
  summarize,
  validateStep,
  type BookingDraft,
  type BookingField,
} from '../../lib/booking'
import { hasErrors, type Errors } from '../../lib/validation'
import type { SubmitResult } from '../../lib/submit'
import { site } from '../../config/site'
import { useSmoothScroll } from '../../providers/scroll-context'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { LiquidGlassCard } from '../glass/Glass'
import { BookingSummary } from './BookingSummary'
import { StepDates, StepDetails, StepVehicle } from './steps'
import './BookingWizard.css'

const STORAGE_KEY = 'gw-booking-draft'

function loadDraft(sp: URLSearchParams): BookingDraft {
  let saved: Partial<BookingDraft> = {}
  try {
    saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<BookingDraft>
  } catch {
    /* ignore unavailable storage */
  }
  // URL params (from the hero panel or a vehicle page) win over saved state.
  return { ...emptyDraft(), ...saved, ...draftFromSearch(sp) }
}

type Status = 'idle' | 'submitting' | SubmitResult['status']

export function BookingWizard() {
  const [params] = useSearchParams()
  const [draft, setDraft] = useState<BookingDraft>(() => loadDraft(params))
  // Arriving with a vehicle (and dates) pre-selected skips the steps already answered.
  const [step, setStep] = useState(() => (draft.vehicle && params.get('pickupDate') ? 2 : draft.vehicle ? 1 : 0))
  const [dir, setDir] = useState(1)
  const [errors, setErrors] = useState<Errors<BookingField>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<SubmitResult | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const { scrollTo } = useSmoothScroll()
  const reduced = useReducedMotion()

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } catch {
      /* ignore */
    }
  }, [draft])

  const set: <K extends BookingField>(k: K, v: BookingDraft[K]) => void = (k, v) => {
    setDraft((d) => ({ ...d, [k]: v }))
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  }

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
    setErrors({})
    if (rootRef.current) scrollTo(rootRef.current, { offset: -110 })
    // Move focus to the new step heading once it has rendered.
    window.setTimeout(() => rootRef.current?.querySelector<HTMLElement>('.wiz-step__title')?.focus({ preventScroll: true }), 450)
  }

  const next = () => {
    const errs = validateStep(step, draft)
    setErrors(errs)
    if (hasErrors(errs)) {
      window.setTimeout(() => rootRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], .wiz-error')?.focus?.(), 50)
      return
    }
    goTo(step + 1)
  }

  const submit = async () => {
    // Re-validate everything before sending.
    for (let s = 0; s < 3; s++) {
      const errs = validateStep(s, draft)
      if (hasErrors(errs)) {
        setErrors(errs)
        goTo(s)
        return
      }
    }
    setStatus('submitting')
    const res = await submitBookingRequest(draft)
    setResult(res)
    setStatus(res.status)
    if (res.status === 'sent') {
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
    }
    if (rootRef.current) scrollTo(rootRef.current, { offset: -110 })
  }

  const s = summarize(draft)
  const done = status === 'sent' || status === 'unconfigured'

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * 40, filter: 'blur(6px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * -40, filter: 'blur(6px)' }),
  }

  return (
    <div ref={rootRef} className="wizard">
      {/* Progress */}
      <ol className="wiz-progress" role="list" aria-label="Booking steps">
        {BOOKING_STEPS.map((st, i) => {
          const state = done || i < step ? 'done' : i === step ? 'current' : 'todo'
          return (
            <li key={st.id} className={`wiz-progress__item is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
              <button type="button" disabled={done || i >= step} onClick={() => goTo(i)} className="wiz-progress__btn">
                <span className="wiz-progress__index t-mono">{state === 'done' ? <Icon name="check" size={12} /> : st.index}</span>
                <span className="wiz-progress__title">{st.title}</span>
              </button>
              {i === step && !done && <motion.span layoutId="wiz-progress-bar" className="wiz-progress__bar" />}
            </li>
          )
        })}
      </ol>

      <div className="wizard__layout">
        <div className="wizard__main">
          {done || status === 'error' ? (
            <ResultPanel status={status} result={result} draft={draft} onRetry={submit} />
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                if (step < 3) next()
                else submit()
              }}
            >
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {step === 0 && <StepVehicle draft={draft} errors={errors} set={set} />}
                  {step === 1 && <StepDates draft={draft} errors={errors} set={set} />}
                  {step === 2 && <StepDetails draft={draft} errors={errors} set={set} />}
                  {step === 3 && (
                    <div className="wiz-step">
                      <header className="wiz-step__intro">
                        <span className="t-mono c-gold">Step 04</span>
                        <h2 className="t-h3 wiz-step__title" tabIndex={-1}>
                          Review & confirm
                        </h2>
                        <p className="t-small">Check your request. Nothing is charged online — our team confirms availability and next steps with you.</p>
                      </header>
                      <dl className="wiz-review">
                        {[
                          ['Vehicle', s.vehicle, 0],
                          ['Pickup point', s.location, 1],
                          ['Pickup', `${s.pickup}${draft.pickupWindow ? ` · ${s.window}` : ''}`, 1],
                          ['Return', `${s.return} · ${s.days} days`, 1],
                          ['Name', `${draft.firstName} ${draft.lastName}`, 2],
                          ['Contact', `${draft.email} · ${draft.phone}`, 2],
                          ['Age', labelOf(AGE_GROUPS, draft.ageGroup), 2],
                          ['Use', labelOf(USAGE, draft.usage), 2],
                          ...(draft.notes ? [['Notes', draft.notes, 2] as const] : []),
                        ].map(([k, v, st]) => (
                          <div key={k as string} className="wiz-review__row">
                            <dt className="t-mono">{k}</dt>
                            <dd>{v}</dd>
                            <button type="button" className="wiz-review__edit" onClick={() => goTo(st as number)}>
                              Edit<span className="sr-only"> {k}</span>
                            </button>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="wiz-nav">
                {step > 0 ? (
                  <Button variant="outline" icon={null} leadingIcon="arrowLeft" onClick={() => goTo(step - 1)}>
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                <Button type="submit" size="lg" magnetic disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
                  {step < 3 ? 'Continue' : status === 'submitting' ? 'Sending…' : 'Send booking request'}
                </Button>
              </div>
            </form>
          )}
        </div>

        <aside className="wizard__aside" aria-label="Your booking summary">
          <BookingSummary draft={draft} />
        </aside>
      </div>
    </div>
  )
}

function ResultPanel({ status, result, draft, onRetry }: { status: Status; result: SubmitResult | null; draft: BookingDraft; onRetry: () => void }) {
  if (status === 'sent') {
    return (
      <LiquidGlassCard className="wiz-result" role="status">
        <span className="wiz-result__icon wiz-result__icon--ok">
          <Icon name="check" size={26} />
        </span>
        <h2 className="t-h3">Request received.</h2>
        <p className="t-body">
          Thank you, {draft.firstName}. Our team will contact you at {draft.phone} or {draft.email} to confirm availability and your pickup.
          {result?.status === 'sent' && result.reference ? ` Your reference is ${result.reference}.` : ''}
        </p>
        <Button to="/" variant="outline">
          Back to home
        </Button>
      </LiquidGlassCard>
    )
  }

  // No backend connected (or it failed): hand the request off honestly.
  const isError = status === 'error'
  return (
    <LiquidGlassCard className="wiz-result" role={isError ? 'alert' : 'status'}>
      <span className="wiz-result__icon">
        <Icon name={isError ? 'alert' : 'mail'} size={24} />
      </span>
      <h2 className="t-h3">{isError ? 'We couldn’t send your request.' : 'Your request is ready to send.'}</h2>
      <p className="t-body">
        {isError
          ? `${result?.status === 'error' ? result.message : ''} Your details are saved — send them by email, call us, or try again.`
          : 'Online submission isn’t connected yet, so nothing has been sent. Send your prepared request by email in one tap, or call us and we’ll take it from there.'}
      </p>
      <div className="wiz-result__actions">
        <Button href={bookingEmailHref(draft)} leadingIcon="mail" icon={null}>
          Email my request
        </Button>
        <Button href={site.phone.href} variant="outline" leadingIcon="phone" icon={null}>
          {site.phone.display}
        </Button>
        {isError && (
          <Button variant="text" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </LiquidGlassCard>
  )
}
