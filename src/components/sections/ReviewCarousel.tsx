import { useRef } from 'react'
import type { Review } from '../../data/reviews'
import { Icon } from '../ui/Icon'
import './ReviewCarousel.css'

/** Horizontal, swipeable review rail. Renders only genuine review data. */
export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const railRef = useRef<HTMLUListElement>(null)
  const scrollBy = (dir: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="reviews">
      <ul ref={railRef} role="list" className="reviews__rail" data-cursor="drag" aria-label="Customer reviews">
        {reviews.map((r) => (
          <li key={r.id} className="reviews__card">
            <figure>
              {typeof r.rating === 'number' && (
                <div className="reviews__stars" role="img" aria-label={`Rated ${r.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < r.rating! ? 'is-on' : ''} aria-hidden="true">
                      ★
                    </span>
                  ))}
                </div>
              )}
              <blockquote className="reviews__quote t-serif">“{r.quote}”</blockquote>
              <figcaption className="reviews__by">
                <span>{r.name}</span>
                {(r.context || r.source) && (
                  <span className="t-mono c-muted">{[r.context, r.source].filter(Boolean).join(' · ')}</span>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {reviews.length > 1 && (
        <div className="reviews__nav">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous reviews">
            <Icon name="arrowLeft" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next reviews">
            <Icon name="arrowRight" />
          </button>
        </div>
      )}
    </div>
  )
}
