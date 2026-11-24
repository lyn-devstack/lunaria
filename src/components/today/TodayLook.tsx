import { ELEMENT_NAME } from '../../data/elements'
import { limitText } from '../../logic/recommend'
import type { Look } from '../../types'
import { TarotCard } from '../ui/TarotCard'
import { ProportionBar } from './ProportionBar'

const ROLE_LABEL = { BASE: 'Base', PUENTE: 'Puente', ACENTO: 'Acento' } as const

/** "Tu look de hoy": la ÚNICA sección que dice qué ponerse. */
export function TodayLook({ look }: { look: Look }) {
  return (
    <TarotCard label="Tu look de hoy" highlight>
      <ProportionBar parts={look.parts} />

      <ul className="legend">
        {look.parts.map((p) => (
          <li key={p.element} className="legend__item">
            <span className="legend__dots" aria-hidden="true">
              {p.tones.map((t) => (
                <span key={t.name} style={{ background: t.hex }} />
              ))}
            </span>
            <span>
              <span className="legend__role">
                {ROLE_LABEL[p.role]} · {ELEMENT_NAME[p.element]}
              </span>
              <br />
              <span className="legend__tones">{p.tones.map((t) => t.name).join(', ')}</span>
            </span>
            <span className="legend__pct">{p.pct}%</span>
          </li>
        ))}
      </ul>

      <p className="look-sentence">{look.sentence}</p>
      <p className="look-why">{look.why}</p>

      {look.warning && (
        <p className="look-warning">
          <span aria-hidden="true">✦</span>
          {look.warning}
        </p>
      )}
      <p className="look-limit">{limitText(look.limit)}</p>
    </TarotCard>
  )
}
