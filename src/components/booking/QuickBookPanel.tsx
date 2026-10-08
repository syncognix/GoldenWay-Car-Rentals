import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { ReededGlassPanel } from '../glass/Glass'
import { SelectField, TextField } from '../forms/Field'
import { Button } from '../ui/Button'
import { TechLabel } from '../ui/TechLabel'
import { pickupPoints } from '../../data/locations'
import { vehicles, vehicleName } from '../../data/vehicles'
import { addDays, todayISO } from '../../lib/dates'
import { draftToSearch, minimumDays, validateDates } from '../../lib/booking'
import { hasErrors, type Errors } from '../../lib/validation'
import './QuickBookPanel.css'

/**
 * Hero search panel. Validates the 7-day minimum up front, then hands the
 * selection to /book as URL params. It never implies live availability.
 */
export function QuickBookPanel({ className }: { className?: string }) {
  const navigate = useNavigate()
  const [location, setLocation] = useState(pickupPoints.find((p) => p.primary)?.id ?? '')
  const [pickupDate, setPickup] = useState('')
  const [returnDate, setReturn] = useState('')
  const [vehicle, setVehicle] = useState('any')
  const [errors, setErrors] = useState<Errors<'pickupDate' | 'returnDate'>>({})

  const today = todayISO()

  const onPickup = (v: string) => {
    setPickup(v)
    // Keep return valid as the pickup moves.
    if (v && (!returnDate || returnDate < addDays(v, minimumDays))) setReturn(addDays(v, minimumDays))
    setErrors({})
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateDates({ pickupDate, returnDate })
    setErrors(errs)
    if (hasErrors(errs)) return
    navigate(`/book?${draftToSearch({ vehicle, location, pickupDate, returnDate })}`)
  }

  return (
    <ReededGlassPanel as="form" className={`quick-book ${className ?? ''}`} aria-labelledby="quick-book-title" onSubmit={onSubmit} noValidate>
      <div className="quick-book__head">
        <TechLabel dot as="p">
          <span id="quick-book-title">Request a rental</span>
        </TechLabel>
        <span className="t-mono c-muted">{minimumDays}-day minimum</span>
      </div>
      <div className="quick-book__grid">
        <SelectField tone="glass" label="Pickup point" value={location} onChange={(e) => setLocation(e.target.value)}>
          {pickupPoints.map((p) => (
            <option key={p.id} value={p.id}>
              {p.area} — {p.name}
            </option>
          ))}
        </SelectField>
        <TextField
          tone="glass"
          type="date"
          label="Pickup date"
          min={today}
          value={pickupDate}
          error={errors.pickupDate}
          onChange={(e) => onPickup(e.target.value)}
        />
        <TextField
          tone="glass"
          type="date"
          label="Return date"
          min={pickupDate ? addDays(pickupDate, minimumDays) : addDays(today, minimumDays)}
          value={returnDate}
          error={errors.returnDate}
          onChange={(e) => {
            setReturn(e.target.value)
            setErrors({})
          }}
        />
        <SelectField tone="glass" label="Vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
          <option value="any">No preference</option>
          {vehicles.map((v) => (
            <option key={v.slug} value={v.slug}>
              {vehicleName(v)}
            </option>
          ))}
        </SelectField>
      </div>
      <Button type="submit" block magnetic className="quick-book__submit">
        Find your car
      </Button>
      <p className="quick-book__note">Availability is confirmed by our team before your rental.</p>
    </ReededGlassPanel>
  )
}
