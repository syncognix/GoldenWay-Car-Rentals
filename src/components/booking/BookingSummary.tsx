import { getVehicle } from '../../data/vehicles'
import { summarize, type BookingDraft } from '../../lib/booking'
import { site, formatCurrency } from '../../config/site'
import { ReededGlassPanel } from '../glass/Glass'
import { VehicleImage } from '../fleet/VehicleImage'
import { TechLabel } from '../ui/TechLabel'
import './BookingSummary.css'

/** Live summary of the request. Shows published rates only — no invented totals. */
export function BookingSummary({ draft }: { draft: BookingDraft }) {
  const s = summarize(draft)
  const vehicle = getVehicle(draft.vehicle)

  return (
    <ReededGlassPanel className="bsum">
      <TechLabel dot as="p">
        Your request
      </TechLabel>
      {vehicle && (
        <div className="bsum__media">
          <VehicleImage vehicle={vehicle} />
        </div>
      )}
      <dl className="bsum__list">
        <div>
          <dt className="t-mono">Vehicle</dt>
          <dd>{draft.vehicle ? s.vehicle : '—'}</dd>
        </div>
        <div>
          <dt className="t-mono">Pickup point</dt>
          <dd>{s.location}</dd>
        </div>
        <div>
          <dt className="t-mono">Dates</dt>
          <dd>
            {draft.pickupDate ? s.pickup : '—'}
            {draft.returnDate && (
              <>
                <br />→ {s.return}
              </>
            )}
          </dd>
        </div>
        <div>
          <dt className="t-mono">Duration</dt>
          <dd className="t-num">{s.days > 0 ? `${s.days} days` : '—'}</dd>
        </div>
      </dl>
      <div className="bsum__rate">
        <span className="t-mono c-muted">Weekly rate from</span>
        <span className="bsum__price t-num">{formatCurrency(site.terms.weeklyRateFrom)}</span>
      </div>
      <ul role="list" className="bsum__terms t-small">
        <li>No deposit · no credit check</li>
        <li>Insurance included · unlimited miles</li>
        <li>Final pricing and add-ons confirmed by our team</li>
      </ul>
    </ReededGlassPanel>
  )
}
