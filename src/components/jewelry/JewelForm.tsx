import { useState } from 'react'
import { ELEMENTS, ELEMENT_NAME } from '../../data/elements'
import { JEWEL_TYPES, METALS, STONES, catalogStone, newId } from '../../data/jewelry'
import type { Element, JewelType, MetalName, Piece, Stone } from '../../types'
import { ElementGlyph } from '../ui/ElementGlyph'

interface Props {
  initial?: Piece
  onSave: (piece: Piece) => void
  onCancel: () => void
}

const sameStone = (a: Stone, b: Stone) => a.name === b.name && a.element === b.element

export function JewelForm({ initial, onSave, onCancel }: Props) {
  const [type, setType] = useState<JewelType>(initial?.type ?? 'anillo')
  const [metal, setMetal] = useState<MetalName>(initial?.metal ?? 'oro amarillo')
  const [stones, setStones] = useState<Stone[]>(initial?.stones ?? [])
  const [name, setName] = useState(initial?.name ?? '')
  const [customName, setCustomName] = useState('')
  const [customElement, setCustomElement] = useState<Element>('agua')

  const has = (s: Stone) => stones.some((x) => sameStone(x, s))
  const toggle = (s: Stone) => setStones((cur) => (has(s) ? cur.filter((x) => !sameStone(x, s)) : [...cur, s]))

  const addCustom = () => {
    const n = customName.trim().toLowerCase()
    if (!n) return
    // Si coincide con una del catálogo, se usa la del catálogo (su elemento manda).
    const s = catalogStone(n) ?? { name: n, element: customElement }
    if (!has(s)) setStones((cur) => [...cur, s])
    setCustomName('')
  }

  const customOnes = stones.filter((s) => !catalogStone(s.name) || catalogStone(s.name)!.element !== s.element)

  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ id: initial?.id ?? newId(), type, metal, stones, name: name.trim() || undefined })
      }}
    >
      <div className="field">
        <span className="field__label">Tipo</span>
        <div className="chips" role="radiogroup" aria-label="Tipo de joya">
          {JEWEL_TYPES.map((t) => (
            <button
              type="button"
              key={t.id}
              role="radio"
              aria-checked={type === t.id}
              className="chip chip--sm"
              onClick={() => setType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Metal</span>
        <div className="chips" role="radiogroup" aria-label="Metal">
          {METALS.map((m) => (
            <button
              type="button"
              key={m}
              role="radio"
              aria-checked={metal === m}
              className="chip chip--sm"
              onClick={() => setMetal(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Piedras (puedes elegir varias, o ninguna)</span>
        {ELEMENTS.map((el) => (
          <div key={el} className="stone-group">
            <span className="stone-group__label">
              <ElementGlyph element={el} /> {ELEMENT_NAME[el]}
            </span>
            <div className="chips">
              {STONES[el].map((n) => {
                const s = { name: n, element: el }
                return (
                  <button
                    type="button"
                    key={n}
                    className="chip chip--sm"
                    aria-pressed={has(s)}
                    onClick={() => toggle(s)}
                  >
                    {n}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <div className="stone-group">
          <span className="stone-group__label">Otra piedra</span>
          <div className="custom-stone">
            <input
              className="input"
              placeholder="Ej.: labradorita"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustom()
                }
              }}
              aria-label="Nombre de otra piedra"
            />
            <select
              className="input"
              value={customElement}
              onChange={(e) => setCustomElement(e.target.value as Element)}
              aria-label="Elemento de la piedra"
            >
              {ELEMENTS.map((el) => (
                <option key={el} value={el}>
                  {ELEMENT_NAME[el]}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn--ghost" onClick={addCustom} disabled={!customName.trim()}>
              Añadir
            </button>
          </div>
          {customOnes.length > 0 && (
            <div className="chips">
              {customOnes.map((s) => (
                <button
                  type="button"
                  key={s.name + s.element}
                  className="chip chip--sm"
                  aria-pressed
                  onClick={() => toggle(s)}
                  title="Quitar"
                >
                  {s.name} · {ELEMENT_NAME[s.element]} ✕
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <label className="field">
        <span className="field__label">Nombre (opcional)</span>
        <input
          className="input"
          placeholder="Ej.: mi anillo de esmeralda"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn">
          {initial ? 'Guardar cambios' : 'Añadir a mi joyero'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
