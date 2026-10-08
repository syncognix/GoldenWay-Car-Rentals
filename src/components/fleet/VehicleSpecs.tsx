import { vehicleSpecList, type Vehicle } from '../../data/vehicles'
import './VehicleSpecs.css'

/** Compact spec chips built strictly from published vehicle data. */
export function VehicleSpecs({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  return (
    <ul role="list" className={`vehicle-specs t-mono ${className ?? ''}`} aria-label="Specifications">
      {vehicleSpecList(vehicle).map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  )
}
