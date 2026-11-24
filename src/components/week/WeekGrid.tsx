import { isSameDay, startOfDay, weekOf } from '../../logic/week'
import type { Element } from '../../types'
import { WeekDayCard } from './WeekDayCard'

interface Props {
  user: Element
  anchor: Date
  onSelect: (d: Date) => void
}

export function WeekGrid({ user, anchor, onSelect }: Props) {
  const today = startOfDay(new Date())
  return (
    <div className="week">
      {weekOf(anchor, user).map((entry) => (
        <WeekDayCard
          key={entry.date.toISOString()}
          entry={entry}
          isToday={isSameDay(entry.date, today)}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
