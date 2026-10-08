import { useRef, useState, type CSSProperties } from 'react'
import { gallery, type GalleryItem } from '../../data/gallery'
import { getVehicle } from '../../data/vehicles'
import { getImage } from '../../media'
import { isCutout, vehicleImages } from '../../lib/vehicleImages'
import { useGsap, MOTION_DESKTOP } from '../../hooks/useGsap'
import { useReveal } from '../../hooks/useReveal'
import { gsap } from '../../lib/gsap'
import { CinematicBackdrop } from '../media/CinematicBackdrop'
import { SmartImage } from '../media/SmartImage'
import { VehiclePlaceholder } from '../fleet/VehicleImage'
import { GlassModal } from '../glass/GlassModal'
import { TechLabel } from '../ui/TechLabel'
import './MixedGallery.css'

type Props = { limit?: number }

type Resolved = GalleryItem & { src?: string }

const resolve = (item: GalleryItem): Resolved => {
  if (item.kind === 'photo') {
    const v = getVehicle(item.vehicle)
    return { ...item, src: v ? vehicleImages(v)[item.image] : undefined }
  }
  if (item.kind === 'scene') return { ...item, src: getImage(item.image) }
  return item
}

/** Parallax speeds per slot — a slow, layered campaign feel. */
const SPEEDS = [-6, 10, -2, 14, -10, 6, 0, 12, -8, 4, 16, -4]

/**
 * Editorial mixed-media composition: vehicle photos, cinematic scenes and
 * typographic cards on an asymmetric grid with parallax and mask reveals.
 * Photos open in a glass lightbox.
 */
export function MixedGallery({ limit }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const items = (limit ? gallery.slice(0, limit) : gallery).map(resolve)
  const viewable = items.filter((i) => i.kind !== 'type' && i.src)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useReveal(ref, { threshold: 0.05 })
  useGsap(
    ref,
    ({ mm, scope }) => {
      mm.add(MOTION_DESKTOP, () => {
        scope.querySelectorAll<HTMLElement>('[data-speed]').forEach((el) => {
          const speed = Number(el.dataset.speed)
          gsap.fromTo(
            el,
            { yPercent: speed },
            { yPercent: -speed, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })
      })
    },
    [items.length],
  )

  const open = (item: Resolved) => {
    const idx = viewable.findIndex((v) => v.id === item.id)
    if (idx >= 0) setOpenIndex(idx)
  }
  const close = () => setOpenIndex(null)
  const prev = () => setOpenIndex((i) => (i === null ? i : (i - 1 + viewable.length) % viewable.length))
  const next = () => setOpenIndex((i) => (i === null ? i : (i + 1) % viewable.length))
  const current = openIndex !== null ? viewable[openIndex] : null

  return (
    <>
      <div ref={ref} className="mixed-gallery">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`mg-slot mg-slot--${(i % 12) + 1} mg-slot--${item.kind}`}
            data-speed={SPEEDS[i % SPEEDS.length]}
          >
            <Tile item={item} index={i} onOpen={open} />
          </div>
        ))}
      </div>

      <GlassModal open={current !== null} onClose={close} onPrev={prev} onNext={next} label={current && 'caption' in current ? current.caption : 'Gallery'}>
        {current && current.src && (
          <figure className="mg-lightbox">
            <img src={current.src} alt={'caption' in current ? current.caption : ''} referrerPolicy="no-referrer" />
            <figcaption className="t-mono">
              {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(viewable.length).padStart(2, '0')} — {'caption' in current ? current.caption : ''}
            </figcaption>
          </figure>
        )}
      </GlassModal>
    </>
  )
}

function Tile({ item, index, onOpen }: { item: Resolved; index: number; onOpen: (i: Resolved) => void }) {
  const delay = { '--reveal-delay': `${(index % 4) * 90}ms` } as CSSProperties

  if (item.kind === 'type') {
    return (
      <div className="mg-type" data-reveal="blur" style={delay}>
        <TechLabel>{item.eyebrow}</TechLabel>
        <p className="mg-type__text t-serif">{item.text}</p>
      </div>
    )
  }

  const caption = item.caption
  const media =
    item.kind === 'scene' && !item.src ? (
      <CinematicBackdrop variant={item.backdrop} seed={index + 3} />
    ) : (
      <SmartImage
        src={item.src}
        alt={caption}
        fallback={<VehiclePlaceholder label={caption} />}
        className={`mg-media__img ${item.kind === 'photo' && isCutout(item.src) ? 'vehicle-image--cutout' : ''}`}
      />
    )

  const frame = (
    <div className="mg-media__frame" style={delay}>
      {media}
    </div>
  )

  return (
    <figure className="mg-media" data-reveal-group>
      {item.src ? (
        <button type="button" className="mg-media__btn" onClick={() => onOpen(item)} data-cursor="view" aria-label={`View ${caption}`}>
          {frame}
        </button>
      ) : (
        frame
      )}
      <figcaption className="mg-media__cap">
        <span className="t-mono c-gold">{item.kind === 'scene' ? item.label : String(index + 1).padStart(2, '0')}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  )
}
