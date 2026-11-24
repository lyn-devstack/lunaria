import { WeekGrid } from '../components/week/WeekGrid'
import { ELEMENT_NAME } from '../data/elements'
import type { Profile } from '../types'

interface Props {
  profile: Profile
  anchor: Date
  onSelect: (d: Date) => void
}

export function Week({ profile, anchor, onSelect }: Props) {
  return (
    <div>
      <h2 className="page-title">Mi semana</h2>
      <p className="page-lead">
        Tu look para cada día, siendo {ELEMENT_NAME[profile.element]}. Toca un día para ver el detalle.
      </p>
      <WeekGrid user={profile.element} anchor={anchor} onSelect={onSelect} />
    </div>
  )
}
