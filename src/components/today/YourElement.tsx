import { ELEMENT_NAME } from '../../data/elements'
import type { Element } from '../../types'
import { ElementGlyph } from '../ui/ElementGlyph'
import { TarotCard } from '../ui/TarotCard'

export function YourElement({ element }: { element: Element }) {
  return (
    <TarotCard label="Tu elemento">
      <div className="element-hero">
        <div className="element-hero__glyph">
          <ElementGlyph element={element} />
        </div>
        <div>
          <p className="element-hero__name">{ELEMENT_NAME[element]}</p>
          <p className="element-hero__sub">Es el tuyo y no cambia con los días.</p>
        </div>
      </div>
    </TarotCard>
  )
}
