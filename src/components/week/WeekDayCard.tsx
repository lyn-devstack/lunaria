import { ELEMENT_NAME } from '../../data/elements'
import type { WeekEntry } from '../../logic/week'
import { ProportionBar } from '../today/ProportionBar'
import { ElementGlyph } from '../ui/ElementGlyph'

interface Props {
  entry: WeekEntry
  isToday: boolean
  onSelect: (d: Date) => void
}

export function WeekDayCard({ entry, isToday, onSelect }: Props) {
  const { date, day, look } = entry
  return (
    <button
      className={`weekday${isToday ? ' weekday--today' : ''}`}
      onClick={() => onSelect(date)}
      aria-label={`${day.name} ${date.getDate()}: ver el look`}
    >
      <div className="weekday__date">
        <div className="weekday__short">{day.short}</div>
        <div className="weekday__num">{date.getDate()}</div>
      </div>
      <div>
        <div className="weekday__head">
          <span>
            <ElementGlyph element={day.element} /> Energía {ELEMENT_NAME[day.element]}
          </span>
          <span className="muted">{day.metalLabel}</span>
        </div>
        <ProportionBar parts={look.parts} mini />
        <p className="weekday__sentence">
          {look.parts.map((p) => `${p.tones[0].name} ${p.pct}%`).join(' · ')}
        </p>
      </div>
    </button>
  )
}
