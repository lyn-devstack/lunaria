import type { DayInfo } from '../../data/days'
import { pickJewelry } from '../../logic/accessories'
import type { Look } from '../../types'
import { TarotCard } from '../ui/TarotCard'

interface Props {
  day: DayInfo
  look: Look
  owned: string[]
  onOpenJewelry: () => void
}

export function AccessoriesPanel({ day, look, owned, onOpenJewelry }: Props) {
  const picks = pickJewelry(owned, look, day)

  return (
    <TarotCard label="Accesorios">
      <p className="metal-line">
        <span className="muted small">Metal del día</span>
        <strong>{day.metalLabel}</strong>
      </p>

      {owned.length === 0 ? (
        <p className="muted small" style={{ marginTop: 12 }}>
          Añade tus joyas en{' '}
          <button className="chip chip--sm" onClick={onOpenJewelry}>
            Mi joyero
          </button>{' '}
          y te diré cuáles encajan con tu look.
        </p>
      ) : picks.length === 0 ? (
        <p className="muted small" style={{ marginTop: 12 }}>
          Ninguna joya de tu joyero encaja hoy con el look; elige alguna del metal del día.
        </p>
      ) : (
        <ul className="jewel-list">
          {picks.map(({ jewel, reason }) => (
            <li key={jewel.id}>
              <strong>
                {jewel.metal}
                {jewel.stone ? ` · ${jewel.stone}` : ''}
              </strong>
              <p className="muted small">{reason}</p>
            </li>
          ))}
        </ul>
      )}
    </TarotCard>
  )
}
