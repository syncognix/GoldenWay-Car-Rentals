import { Reveal, SplitLines } from '../ui/Reveal'
import { TechLabel } from '../ui/TechLabel'
import { Button } from '../ui/Button'
import { PillarList } from './PillarList'
import { pillars, brandStory } from '../../data/services'
import './StorySection.css'

/** Editorial "Why GoldenWay" with a sticky statement column. */
export function StorySection() {
  return (
    <section className="story section" data-chapter="Why GoldenWay" aria-labelledby="story-title">
      <div className="container story__grid">
        <div className="story__sticky">
          <TechLabel index="04" glitch>
            Why GoldenWay
          </TechLabel>
          <SplitLines
            id="story-title"
            className="story__title t-h2"
            lines={[
              <span className="t-serif">Easy.</span>,
              <span className="t-serif">Transparent.</span>,
              <span className="t-serif-i c-gold">Dependable.</span>,
            ]}
          />
          <Reveal kind="blur" as="p" className="t-lead">
            {brandStory.mission}
          </Reveal>
          <Reveal kind="fade" delay={200}>
            <Button to="/why-goldenway" variant="outline">
              The GoldenWay difference
            </Button>
          </Reveal>
        </div>
        <PillarList items={pillars} />
      </div>
    </section>
  )
}
