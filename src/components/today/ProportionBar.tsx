import type { LookPart } from '../../types'

const readableOn = (hex: string): string => {
  const n = parseInt(hex.slice(1), 16)
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
  return lum > 150 ? '#1a1220' : '#f4efe6'
}

interface Props {
  parts: LookPart[]
  mini?: boolean
}

/** Barra horizontal de proporciones: un segmento por elemento, con el tono principal de cada uno. */
export function ProportionBar({ parts, mini }: Props) {
  const label = parts.map((p) => `${p.tones[0].name} ${p.pct}%`).join(', ')
  return (
    <div className={`bar${mini ? ' bar--mini' : ''}`} role="img" aria-label={`Proporciones: ${label}`}>
      {parts.map((p) => (
        <div
          key={p.element}
          className="bar__seg"
          style={{ width: `${p.pct}%`, background: p.tones[0].hex, color: readableOn(p.tones[0].hex) }}
        >
          {mini ? null : `${p.pct}%`}
        </div>
      ))}
    </div>
  )
}
