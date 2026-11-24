import { CONTROLS, GENERATES } from '../data/cycles'
import type { Element, Relation } from '../types'

/** El elemento que genera (nutre) a `el`. */
export const nourisherOf = (el: Element): Element =>
  (Object.keys(GENERATES) as Element[]).find((k) => GENERATES[k] === el) as Element

/** El elemento que controla a `el`. */
export const controllerOf = (el: Element): Element =>
  (Object.keys(CONTROLS) as Element[]).find((k) => CONTROLS[k] === el) as Element

/** Relación entre la usuaria (U) y el elemento del día (D). Con 5 elementos es siempre una de estas 5. */
export const relationOf = (U: Element, D: Element): Relation => {
  if (U === D) return 'fuerte'
  if (GENERATES[D] === U) return 'ideal'
  if (GENERATES[U] === D) return 'consume'
  if (CONTROLS[U] === D) return 'choque-U'
  return 'choque-D'
}
