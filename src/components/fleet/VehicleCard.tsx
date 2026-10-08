import { Link } from 'react-router'
import { categoryLabels, vehicleName, type Vehicle } from '../../data/vehicles'
import { formatCurrency, site } from '../../config/site'
import { VehicleImage } from './VehicleImage'
import { VehicleSpecs } from './VehicleSpecs'
import { Icon } from '../ui/Icon'
import './VehicleCard.css'

type Props = { vehicle: Vehicle; index: number; total: number; featured?: boolean }

/** Cinematic vehicle card — image-led, whole card is one link target. */
export function VehicleCard({ vehicle: v, index, total, featured }: Props) {
  const name = vehicleName(v)
  return (
    <article className={`vcard ${featured ? 'vcard--featured' : ''}`}>
      <div className="vcard__media" data-cursor="view">
        <VehicleImage vehicle={v} />
        <span className="vcard__index t-mono">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="vcard__cat t-mono">{categoryLabels[v.category]}</span>
      </div>
      <div className="vcard__body">
        <div className="vcard__titles">
          <p className="t-mono c-gold">
            {v.year ? `${v.year} · ` : ''}
            {v.make}
          </p>
          <h3 className="vcard__name">
            <Link to={`/fleet/${v.slug}`} className="vcard__link">
              {v.color ? `${v.color} ` : ''}
              {v.model}
              <span className="sr-only"> — view {name}</span>
            </Link>
          </h3>
        </div>
        <VehicleSpecs vehicle={v} />
        <div className="vcard__foot">
          <p>
            <span className="t-mono c-muted">Weekly from </span>
            <span className="vcard__price t-num">{formatCurrency(v.weeklyRate ?? site.terms.weeklyRateFrom)}</span>
          </p>
          <span className="vcard__cta" aria-hidden="true">
            View vehicle <Icon name="arrowRight" size={15} />
          </span>
        </div>
      </div>
    </article>
  )
}
