import { useState } from 'react'
import { BirthForm } from '../components/onboarding/BirthForm'
import { ElementGlyph } from '../components/ui/ElementGlyph'
import { TarotCard } from '../components/ui/TarotCard'
import { ELEMENTS, ELEMENT_NAME } from '../data/elements'
import type { Element, Profile } from '../types'

interface Props {
  profile: Profile
  onUpdate: (patch: Partial<Profile>) => void
  onReset: () => void
}

export function Settings({ profile, onUpdate, onReset }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [saved, setSaved] = useState(false)

  const flash = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="stack">
      <h2 className="page-title">Ajustes</h2>

      <TarotCard label="Tu elemento">
        <div className="chips" role="radiogroup" aria-label="Elemento personal" style={{ justifyContent: 'center' }}>
          {ELEMENTS.map((el: Element) => (
            <button
              key={el}
              role="radio"
              aria-checked={profile.element === el}
              className="chip"
              onClick={() => onUpdate({ element: el })}
            >
              <ElementGlyph element={el} /> {ELEMENT_NAME[el]}
            </button>
          ))}
        </div>
        <p className="muted small" style={{ textAlign: 'center', marginTop: 12 }}>
          Puedes elegirlo a mano o recalcularlo con tu fecha de nacimiento.
        </p>
      </TarotCard>

      <TarotCard label="Recalcular">
        <BirthForm
          initial={{ month: profile.birthMonth, year: profile.birthYear, beforeFeb4: profile.beforeFeb4 }}
          submitLabel="Calcular y guardar"
          onSubmit={(d) => {
            onUpdate({ element: d.element, birthMonth: d.month, birthYear: d.year, beforeFeb4: d.beforeFeb4 })
            flash()
          }}
        />
        {saved && (
          <p className="muted small" role="status" style={{ textAlign: 'center', marginTop: 12 }}>
            Guardado ✦
          </p>
        )}
      </TarotCard>

      <TarotCard label="Tus datos">
        <p className="muted small" style={{ marginBottom: 12 }}>
          Todo se guarda solo en este dispositivo (localStorage). No hay cuentas ni servidor.
        </p>
        {!confirming ? (
          <button className="btn btn--danger btn--block" onClick={() => setConfirming(true)}>
            Borrar mis datos
          </button>
        ) : (
          <div className="stack">
            <p className="small">Se borrarán tu elemento y tu joyero. ¿Seguro?</p>
            <button className="btn btn--danger btn--block" onClick={onReset}>
              Sí, borrar todo
            </button>
            <button className="btn btn--ghost btn--block" onClick={() => setConfirming(false)}>
              Cancelar
            </button>
          </div>
        )}
      </TarotCard>
    </div>
  )
}
