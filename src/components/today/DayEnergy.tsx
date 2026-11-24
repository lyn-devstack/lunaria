import type { DayInfo } from '../../data/days'
import { ELEMENT_NAME, ELEMENT_TONES } from '../../data/elements'
import { ColorSwatch } from '../ui/ColorSwatch'
import { ElementGlyph } from '../ui/ElementGlyph'
import { TarotCard } from '../ui/TarotCard'

export function DayEnergy({ day }: { day: DayInfo }) {
  return (
    <TarotCard label="Energía del día">
      <div className="element-hero">
        <div className="element-hero__glyph">
          <ElementGlyph element={day.element} />
        </div>
        <div>
          <p className="element-hero__name">{ELEMENT_NAME[day.element]}</p>
          <p className="element-hero__sub">
            {day.name} · {day.planet}
          </p>
        </div>
      </div>

      <div className="swatches">
        {ELEMENT_TONES[day.element].map((t) => (
          <ColorSwatch key={t.name} tone={t} />
        ))}
      </div>

      <p className="notice">Esto es la energía del día, no lo que tienes que ponerte.</p>
    </TarotCard>
  )
}
