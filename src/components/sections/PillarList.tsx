import { Reveal } from '../ui/Reveal'
import type { Pillar } from '../../data/services'
import './PillarList.css'

/** Numbered editorial rows: index · kicker · title · body. */
export function PillarList({ items }: { items: Pillar[] }) {
  return (
    <ol role="list" className="pillars">
      {items.map((p, i) => (
        <Reveal as="li" key={p.id} kind="up" delay={i * 60} className="pillars__row">
          <span className="pillars__index t-mono">{p.index}</span>
          <div className="pillars__main">
            <span className="t-mono c-gold">{p.kicker}</span>
            <h3 className="pillars__title t-h3">{p.title}</h3>
          </div>
          <p className="pillars__body">{p.body}</p>
        </Reveal>
      ))}
    </ol>
  )
}
