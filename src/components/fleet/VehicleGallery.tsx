import { useState } from 'react'
import { vehicleName, type Vehicle } from '../../data/vehicles'
import { vehicleImages } from '../../lib/vehicleImages'
import { GlassModal } from '../glass/GlassModal'
import { Reveal } from '../ui/Reveal'
import { VehicleImage } from './VehicleImage'
import './VehicleGallery.css'

/** Vehicle photo grid with a keyboard-navigable lightbox. */
export function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const images = vehicleImages(vehicle)
  const name = vehicleName(vehicle)
  const [open, setOpen] = useState<number | null>(null)
  const prev = () => setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length))
  const next = () => setOpen((i) => (i === null ? i : (i + 1) % images.length))
  const close = () => setOpen(null)

  return (
    <>
      <ul role="list" className={`vgallery vgallery--${Math.min(images.length, 5)}`}>
        {images.map((_, i) => (
          <Reveal as="li" key={i} kind="mask" delay={i * 80} className="vgallery__item">
            <button type="button" className="vgallery__btn" onClick={() => setOpen(i)} data-cursor="view" aria-label={`Enlarge photo ${i + 1} of ${images.length}`}>
              <VehicleImage vehicle={vehicle} index={i} />
            </button>
          </Reveal>
        ))}
      </ul>
      <GlassModal open={open !== null} onClose={close} onPrev={images.length > 1 ? prev : undefined} onNext={images.length > 1 ? next : undefined} label={`${name} photos`}>
        {open !== null && (
          <figure className="vgallery__lightbox">
            <img src={images[open]} alt={`${name} — photo ${open + 1}`} referrerPolicy="no-referrer" />
            <figcaption className="t-mono">
              {String(open + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')} — {name}
            </figcaption>
          </figure>
        )}
      </GlassModal>
    </>
  )
}
