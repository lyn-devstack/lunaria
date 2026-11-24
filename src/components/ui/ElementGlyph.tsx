import { ELEMENT_GLYPH, ELEMENT_UI } from '../../data/elements'
import type { Element } from '../../types'

export function ElementGlyph({ element }: { element: Element }) {
  return (
    <span aria-hidden="true" style={{ color: ELEMENT_UI[element] }}>
      {ELEMENT_GLYPH[element]}
    </span>
  )
}
