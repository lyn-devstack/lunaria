import { useState } from 'react'
import type { Piece } from '../../types'
import { TarotCard } from '../ui/TarotCard'
import { JewelCard } from './JewelCard'
import { JewelForm } from './JewelForm'

interface Props {
  owned: Piece[]
  onChange: (pieces: Piece[]) => void
}

/** `null` = formulario cerrado · `'new'` = añadiendo · Piece = editando esa joya. */
type Editing = null | 'new' | Piece

export function JewelryBox({ owned, onChange }: Props) {
  const [editing, setEditing] = useState<Editing>(null)

  const save = (piece: Piece) => {
    const exists = owned.some((p) => p.id === piece.id)
    onChange(exists ? owned.map((p) => (p.id === piece.id ? piece : p)) : [...owned, piece])
    setEditing(null)
  }

  if (editing) {
    return (
      <TarotCard label={editing === 'new' ? 'Nueva joya' : 'Editar joya'} highlight>
        <JewelForm
          key={editing === 'new' ? 'new' : editing.id}
          initial={editing === 'new' ? undefined : editing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      </TarotCard>
    )
  }

  return (
    <div className="stack">
      <button className="btn btn--block" onClick={() => setEditing('new')}>
        + Añadir joya
      </button>

      {owned.length === 0 ? (
        <TarotCard label="Aún vacío">
          <p className="muted" style={{ textAlign: 'center' }}>
            Añade tus anillos, colgantes, pulseras o pendientes, con su metal y sus piedras. Así te diré cuál
            ponerte cada día.
          </p>
        </TarotCard>
      ) : (
        <TarotCard label={`Tus joyas · ${owned.length}`}>
          <ul className="jewel-list jewel-list--manage">
            {owned.map((p) => (
              <JewelCard
                key={p.id}
                piece={p}
                onEdit={() => setEditing(p)}
                onRemove={() => onChange(owned.filter((x) => x.id !== p.id))}
              />
            ))}
          </ul>
        </TarotCard>
      )}
    </div>
  )
}
