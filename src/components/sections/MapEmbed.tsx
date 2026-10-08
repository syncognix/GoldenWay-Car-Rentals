import { useState } from 'react'
import { mapsLinks, coordinates, addressLines } from '../../config/site'
import { Button } from '../ui/Button'
import { TechLabel } from '../ui/TechLabel'
import './MapEmbed.css'

/**
 * Click-to-load Google Map. Keeps third-party scripts and cookies off the page
 * (and out of LCP) until the visitor asks for the map.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="map-embed surface-dark">
      {loaded ? (
        <iframe
          title={`Map — ${addressLines.full}`}
          src={mapsLinks.embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map-embed__placeholder">
          <svg className="map-embed__grid" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {/* Stylised street grid around the pin */}
            {Array.from({ length: 14 }, (_, i) => (
              <line key={`v${i}`} x1={i * 32} y1="0" x2={i * 32 - 60} y2="300" />
            ))}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 30} x2="400" y2={i * 30 + 18} />
            ))}
            <path d="M-10 210 C 90 180, 160 150, 210 150 S 330 90, 420 60" className="map-embed__road" />
            <circle cx="210" cy="150" r="46" className="map-embed__halo" />
            <circle cx="210" cy="150" r="6" className="map-embed__pin" />
          </svg>
          <div className="map-embed__overlay">
            <TechLabel dot>{coordinates}</TechLabel>
            <p className="map-embed__addr">{addressLines.line1}</p>
            <div className="map-embed__actions">
              <Button variant="glass" size="sm" icon={null} leadingIcon="pin" onClick={() => setLoaded(true)}>
                Load interactive map
              </Button>
              <Button href={mapsLinks.directions} size="sm" icon="arrowUpRight">
                Directions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
