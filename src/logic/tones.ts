import { ELEMENT_TONES } from '../data/elements'
import type { Element, Tone } from '../types'

/**
 * Tonos de `element` ordenados del más cercano a la energía de `user` al menos cercano.
 * El orden dentro de cada grupo es el de la tabla de datos (estable).
 */
export const tonesFor = (element: Element, user: Element): Tone[] => {
  const all = ELEMENT_TONES[element]
  if (element === user) return [...all]
  const close = all.filter((t) => t.affinity.includes(user))
  const rest = all.filter((t) => !t.affinity.includes(user))
  return [...close, ...rest]
}
