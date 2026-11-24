import { useState } from 'react'
import { ELEMENT_NAME } from '../../data/elements'
import { TYPE_LABEL, pieceTitle } from '../../data/jewelry'
import type { Piece } from '../../types'
import { ElementGlyph } from '../ui/ElementGlyph'

interface Props {
  piece: Piece
  onEdit: () => void
  onRemove: () => void
}

export function JewelCard({ piece, onEdit, onRemove }: Props) {
  const [confirming, setConfirming] = useState(false)

  return (
    <li className="jewel-card">
      <div>
        <strong className="jewel-card__title">{pieceTitle(piece)}</strong>
        <p className="muted small">
          {TYPE_LABEL[piece.type]} · {piece.metal}
        </p>
        {piece.stones.length > 0 && (
          <p className="jewel-card__stones">
            {piece.stones.map((s) => (
              <span key={s.name + s.element} className="stone-tag">
                <ElementGlyph element={s.element} /> {s.name}
                <span className="muted"> · {ELEMENT_NAME[s.element]}</span>
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="jewel-card__actions">
        {!confirming ? (
          <>
            <button className="chip chip--sm" onClick={onEdit}>
              Editar
            </button>
            <button className="chip chip--sm" onClick={() => setConfirming(true)}>
              Quitar
            </button>
          </>
        ) : (
          <>
            <button className="chip chip--sm chip--danger" onClick={onRemove}>
              Sí, quitar
            </button>
            <button className="chip chip--sm" onClick={() => setConfirming(false)}>
              No
            </button>
          </>
        )}
      </div>
    </li>
  )
}
