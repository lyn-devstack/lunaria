import { AccessoriesPanel } from '../components/today/AccessoriesPanel'
import { DayEnergy } from '../components/today/DayEnergy'
import { DayPicker } from '../components/today/DayPicker'
import { TodayLook } from '../components/today/TodayLook'
import { YourElement } from '../components/today/YourElement'
import { MoonPhase } from '../components/layout/MoonPhase'
import { dayInfo } from '../data/days'
import { recommend } from '../logic/recommend'
import { dayVariant } from '../logic/week'
import type { Profile } from '../types'

interface Props {
  profile: Profile
  picker: {
    date: Date
    isToday: boolean
    isTomorrow: boolean
    goToday: () => void
    goTomorrow: () => void
    setDate: (d: Date) => void
  }
  onOpenJewelry: () => void
}

export function Today({ profile, picker, onOpenJewelry }: Props) {
  const day = dayInfo(picker.date)
  const look = recommend(profile.element, day.element, dayVariant(picker.date))

  const title = picker.date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="stack">
      <DayPicker
        date={picker.date}
        isToday={picker.isToday}
        isTomorrow={picker.isTomorrow}
        onToday={picker.goToday}
        onTomorrow={picker.goTomorrow}
        onPick={picker.setDate}
      />
      <h2 className="datetitle">{title}</h2>
      <MoonPhase date={picker.date} />

      <YourElement element={profile.element} />
      <DayEnergy day={day} />
      <TodayLook look={look} />
      <AccessoriesPanel day={day} look={look} owned={profile.jewelry} onOpenJewelry={onOpenJewelry} />
    </div>
  )
}
