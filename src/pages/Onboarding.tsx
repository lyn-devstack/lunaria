import { useState } from 'react'
import { BirthForm, type BirthData } from '../components/onboarding/BirthForm'
import { Brand } from '../components/layout/AppShell'
import { ElementGlyph } from '../components/ui/ElementGlyph'
import { GoldDivider } from '../components/ui/GoldDivider'
import { TarotCard } from '../components/ui/TarotCard'
import { ELEMENT_NAME } from '../data/elements'
import type { Profile } from '../types'

export function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [result, setResult] = useState<BirthData | null>(null)

  return (
    <div className="onboarding">
      <Brand />
      {!result ? (
        <TarotCard label="Bienvenida">
          <p className="muted" style={{ textAlign: 'center', marginBottom: 16 }}>
            Solo necesito tu mes y año de nacimiento para descubrir tu elemento.
          </p>
          <BirthForm submitLabel="Descubrir mi elemento" onSubmit={setResult} />
        </TarotCard>
      ) : (
        <TarotCard label="Tu elemento" highlight>
          <div className="reveal">
            <p className="muted small">Tu elemento personal es</p>
            <div className="reveal__glyph">
              <ElementGlyph element={result.element} />
            </div>
            <h2 className="reveal__name">{ELEMENT_NAME[result.element]}</h2>
            <GoldDivider />
            <p className="muted small" style={{ marginBottom: 16 }}>
              Podrás cambiarlo cuando quieras en Ajustes.
            </p>
            <div className="stack">
              <button
                className="btn btn--block"
                onClick={() =>
                  onDone({
                    version: 2,
                    onboarded: true,
                    element: result.element,
                    birthMonth: result.month,
                    birthYear: result.year,
                    beforeFeb4: result.beforeFeb4,
                    jewelry: [],
                  })
                }
              >
                Entrar en mi atelier
              </button>
              <button className="btn btn--ghost btn--block" onClick={() => setResult(null)}>
                Corregir mis datos
              </button>
            </div>
          </div>
        </TarotCard>
      )}
    </div>
  )
}
