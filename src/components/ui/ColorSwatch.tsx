import type { Tone } from '../../types'

export function ColorSwatch({ tone }: { tone: Tone }) {
  return (
    <div className="swatch">
      <span className="swatch__dot" style={{ background: tone.hex }} />
      <span>{tone.name}</span>
    </div>
  )
}
