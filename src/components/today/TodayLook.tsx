import { ELEMENT_NAME } from '../../data/elements'
import { limitText } from '../../logic/recommend'
import type { Look, Role } from '../../types'
import { TarotCard } from '../ui/TarotCard'
import { ProportionBar } from './ProportionBar'

const ROLE_LABEL: Record<Role, string> = { BASE: 'Base', PUENTE: 'Puente', ACENTO: 'Acento' }

/** Qué significa cada rol, en una línea y sin jerga. */
const ROLE_HELP: Record<Role, string> = {
  BASE: 'la mayor parte de tu look',
  PUENTE: 'une tu color con el del día',
  ACENTO: 'solo un toque, en los detalles',
}

/** "Tu look de hoy": la ÚNICA sección que dice qué ponerse. */
export function TodayLook({ look }: { look: Look }) {
  return (
    <TarotCard label="Tu look de hoy" highlight>
      <p className="look-help">
        Todo lo de esta tarjeta es lo que te pones, en estas proporciones.
      </p>

      <ProportionBar parts={look.parts} />
      <p className="look-style">
        <strong>{look.style.label}</strong> · {look.style.help}
      </p>

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
              <span className="legend__help"> — {ROLE_HELP[p.role]}</span>
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

      {look.ideas.length > 0 && (
        <div className="ideas">
          <h3 className="ideas__title">Otras ideas para hoy</h3>
          <p className="muted small">Mismos elementos y mismas proporciones, con otros tonos.</p>
          <ul className="ideas__list">
            {look.ideas.map((idea, i) => (
              <li key={i} className="idea">
                <ProportionBar parts={idea.parts} mini />
                <p className="idea__text">
                  {idea.parts.map((p) => `${p.tones[0].name} ${p.pct}%`).join(' · ')}
                </p>
                <p className="idea__style">{idea.style.label}</p>
                <p className="idea__sentence muted small">{idea.sentence}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </TarotCard>
  )
}
