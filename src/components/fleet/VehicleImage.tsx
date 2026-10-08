import { SmartImage } from '../media/SmartImage'
import type { Vehicle } from '../../data/vehicles'
import { vehicleName } from '../../data/vehicles'
import { vehicleImages } from '../../lib/vehicleImages'
import './VehicleImage.css'

type Props = {
  vehicle: Vehicle
  index?: number
  className?: string
  priority?: boolean
}

/** Vehicle photo with a designed "photo coming soon" frame as fallback. */
export function VehicleImage({ vehicle, index = 0, className, priority }: Props) {
  const name = vehicleName(vehicle)
  const src = vehicleImages(vehicle)[index]
  return (
    <SmartImage
      src={src}
      alt={index === 0 ? name : `${name} — photo ${index + 1}`}
      priority={priority}
      className={`vehicle-image ${className ?? ''}`}
      fallback={<VehiclePlaceholder label={name} />}
    />
  )
}

export function VehiclePlaceholder({ label }: { label: string }) {
  return (
    <div className="vehicle-ph" role="img" aria-label={`${label} — photo coming soon`}>
      <svg viewBox="0 0 400 140" className="vehicle-ph__car" aria-hidden="true">
        <path
          d="M18 104c0-10 6-17 18-20l52-12c18-20 42-34 76-36h66c32 0 58 14 82 34l50 8c14 3 22 12 22 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path d="M118 70c16-14 32-22 54-23h58c22 0 40 8 56 23" fill="none" stroke="currentColor" strokeWidth="1" opacity=".6" />
        <line x1="10" y1="106" x2="390" y2="106" stroke="currentColor" strokeWidth=".8" opacity=".5" />
        <circle cx="104" cy="106" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="300" cy="106" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="t-mono">Photo coming soon</span>
    </div>
  )
}
