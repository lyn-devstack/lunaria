import type { DayInfo } from '../../data/days'
import { TYPE_LABEL, pieceTitle } from '../../data/jewelry'
import { bestPerType, pickJewelry } from '../../logic/accessories'
import type { Look, Piece } from '../../types'
import { TarotCard } from '../ui/TarotCard'

interface Props {
  day: DayInfo
  look: Look
  owned: Piece[]
  onOpenJewelry: () => void
}

export function AccessoriesPanel({ day, look, owned, onOpenJewelry }: Props) {
  const picks = pickJewelry(owned, look, day)
  const best = bestPerType(picks)
  const extra = picks.length - best.length

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
      ) : best.length === 0 ? (
        <p className="muted small" style={{ marginTop: 12 }}>
          Ninguna joya de tu joyero encaja hoy con el look; elige alguna del metal del día.
        </p>
      ) : (
        <>
          <ul className="jewel-list">
            {best.map(({ piece, reason }) => (
              <li key={piece.id}>
                <span className="legend__role">{TYPE_LABEL[piece.type]}</span>
                <br />
                <strong>{pieceTitle(piece)}</strong>
                <p className="muted small">{reason}</p>
              </li>
            ))}
          </ul>
          {extra > 0 && (
            <p className="muted small" style={{ marginTop: 8 }}>
              +{extra} {extra === 1 ? 'joya más encaja' : 'joyas más encajan'} hoy, pero te propongo la mejor de cada tipo.
            </p>
          )}
        </>
      )}
    </TarotCard>
  )
}
