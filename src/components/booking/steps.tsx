import type { ReactNode } from 'react'
import { vehicles, vehicleName, categoryLabels } from '../../data/vehicles'
import { pickupPoints } from '../../data/locations'
import { addDays, diffDays, isSunday, isValidISODate, todayISO } from '../../lib/dates'
import { AGE_GROUPS, PICKUP_WINDOWS, USAGE, minimumDays, type BookingDraft, type BookingField } from '../../lib/booking'
import type { Errors } from '../../lib/validation'
import { site } from '../../config/site'
import { VehicleImage } from '../fleet/VehicleImage'
import { CheckField, SelectField, TextAreaField, TextField } from '../forms/Field'
import { Icon } from '../ui/Icon'

export type StepProps = {
  draft: BookingDraft
  errors: Errors<BookingField>
  set: <K extends BookingField>(key: K, value: BookingDraft[K]) => void
}

function StepIntro({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <header className="wiz-step__intro">
      <span className="t-mono c-gold">Step {index}</span>
      <h2 className="t-h3 wiz-step__title" tabIndex={-1}>
        {title}
      </h2>
      <p className="t-small">{children}</p>
    </header>
  )
}

/* ---------- 01 Vehicle ---------- */
export function StepVehicle({ draft, errors, set }: StepProps) {
  return (
    <fieldset className="wiz-step" aria-describedby={errors.vehicle ? 'vehicle-error' : undefined}>
      <legend className="sr-only">Choose your vehicle</legend>
      <StepIntro index="01" title="Choose your vehicle">
        Pick a car, or let our team suggest the best available match.
      </StepIntro>
      <div className="choice-grid">
        <label className={`choice choice--any ${draft.vehicle === 'any' ? 'is-checked' : ''}`}>
          <input type="radio" name="vehicle" value="any" checked={draft.vehicle === 'any'} onChange={() => set('vehicle', 'any')} />
          <span className="choice__any-icon" aria-hidden="true">
            <Icon name="spark" size={26} />
          </span>
          <span className="choice__name">No preference</span>
          <span className="choice__meta t-mono">Best available</span>
          <Check />
        </label>
        {vehicles.map((v) => (
          <label key={v.slug} className={`choice ${draft.vehicle === v.slug ? 'is-checked' : ''}`}>
            <input type="radio" name="vehicle" value={v.slug} checked={draft.vehicle === v.slug} onChange={() => set('vehicle', v.slug)} />
            <span className="choice__media">
              <VehicleImage vehicle={v} />
            </span>
            <span className="choice__name">{vehicleName(v)}</span>
            <span className="choice__meta t-mono">
              {categoryLabels[v.category]} · {v.seats} seats
            </span>
            <Check />
          </label>
        ))}
      </div>
      {errors.vehicle && <ErrorLine id="vehicle-error">{errors.vehicle}</ErrorLine>}
    </fieldset>
  )
}

/* ---------- 02 Dates ---------- */
export function StepDates({ draft, errors, set }: StepProps) {
  const today = todayISO()
  const days = isValidISODate(draft.pickupDate) && isValidISODate(draft.returnDate) ? diffDays(draft.pickupDate, draft.returnDate) : 0

  const onPickup = (v: string) => {
    set('pickupDate', v)
    if (v && (!draft.returnDate || draft.returnDate < addDays(v, minimumDays))) set('returnDate', addDays(v, minimumDays))
  }

  return (
    <fieldset className="wiz-step">
      <legend className="sr-only">Choose your dates and pickup point</legend>
      <StepIntro index="02" title="Choose your dates">
        Rentals run weekly or monthly with a firm {minimumDays}-day minimum.
      </StepIntro>

      <div className="wiz-subhead t-mono">Pickup point</div>
      <div className="choice-row" role="radiogroup" aria-label="Pickup point">
        {pickupPoints.map((p) => (
          <label key={p.id} className={`choice choice--compact ${draft.location === p.id ? 'is-checked' : ''}`}>
            <input type="radio" name="location" value={p.id} checked={draft.location === p.id} onChange={() => set('location', p.id)} />
            <span className="choice__name">{p.area}</span>
            <span className="choice__meta t-mono">{p.name}</span>
            <Check />
          </label>
        ))}
      </div>
      {errors.location && <ErrorLine>{errors.location}</ErrorLine>}
      <p className="t-small wiz-note">Pickup locations are confirmed with you by our team. Airport pickup isn’t available.</p>

      <div className="wiz-fields wiz-fields--3">
        <TextField
          type="date"
          label="Pickup date"
          required
          min={today}
          value={draft.pickupDate}
          error={errors.pickupDate}
          hint={isSunday(draft.pickupDate) ? 'Our office is closed on Sundays — we’ll confirm the nearest pickup time.' : undefined}
          onChange={(e) => onPickup(e.target.value)}
        />
        <TextField
          type="date"
          label="Return date"
          required
          min={draft.pickupDate ? addDays(draft.pickupDate, minimumDays) : addDays(today, minimumDays)}
          value={draft.returnDate}
          error={errors.returnDate}
          onChange={(e) => set('returnDate', e.target.value)}
        />
        <SelectField label="Preferred pickup window" value={draft.pickupWindow} onChange={(e) => set('pickupWindow', e.target.value)} hint={`Office hours: ${site.hours[0].days}, ${site.hours[0].label}`}>
          <option value="">No preference</option>
          {PICKUP_WINDOWS.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="wiz-duration" aria-live="polite">
        <span className="t-mono c-muted">Duration</span>
        <span className="wiz-duration__value t-num">{days > 0 ? `${days} days` : '—'}</span>
        {days > 0 && <span className="t-small">{days % 7 === 0 ? `${days / 7} week${days === 7 ? '' : 's'}` : `${Math.floor(days / 7)} weeks + ${days % 7} days`}</span>}
      </div>
    </fieldset>
  )
}

/* ---------- 03 Details ---------- */
export function StepDetails({ draft, errors, set }: StepProps) {
  return (
    <fieldset className="wiz-step">
      <legend className="sr-only">Your details</legend>
      <StepIntro index="03" title="Your details">
        So our team can confirm availability and pickup with you directly.
      </StepIntro>
      <div className="wiz-fields">
        <TextField label="First name" required autoComplete="given-name" value={draft.firstName} error={errors.firstName} onChange={(e) => set('firstName', e.target.value)} />
        <TextField label="Last name" required autoComplete="family-name" value={draft.lastName} error={errors.lastName} onChange={(e) => set('lastName', e.target.value)} />
        <TextField type="email" label="Email" required autoComplete="email" inputMode="email" value={draft.email} error={errors.email} onChange={(e) => set('email', e.target.value)} />
        <TextField type="tel" label="Phone" required autoComplete="tel" inputMode="tel" placeholder="(470) 000-0000" value={draft.phone} error={errors.phone} onChange={(e) => set('phone', e.target.value)} />
        <SelectField label="Age" required value={draft.ageGroup} error={errors.ageGroup} onChange={(e) => set('ageGroup', e.target.value)} hint={`Minimum rental age is ${site.terms.minimumAge}.`}>
          <option value="">Select…</option>
          {AGE_GROUPS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="How will you use the car?" value={draft.usage} onChange={(e) => set('usage', e.target.value)}>
          <option value="">Select…</option>
          {USAGE.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </SelectField>
        <TextAreaField className="wiz-fields__full" label="Notes (optional)" rows={4} value={draft.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Anything we should know — additional driver, add-ons, timing…" />
        <CheckField
          className="wiz-fields__full"
          checked={draft.licenseConfirmed}
          error={errors.licenseConfirmed}
          onChange={(e) => set('licenseConfirmed', e.target.checked)}
          label="I have a valid, non-expired driver’s license and a valid payment method."
        />
      </div>
    </fieldset>
  )
}

function Check() {
  return (
    <span className="choice__check" aria-hidden="true">
      <Icon name="check" size={13} />
    </span>
  )
}

function ErrorLine({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="field__error wiz-error" role="alert">
      <Icon name="alert" size={13} /> {children}
    </p>
  )
}
