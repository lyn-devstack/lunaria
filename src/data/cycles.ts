import type { Element } from '../types'

/** Ciclo generador: Madera→Fuego→Tierra→Metal→Agua→Madera. */
export const GENERATES: Record<Element, Element> = {
  madera: 'fuego',
  fuego: 'tierra',
  tierra: 'metal',
  metal: 'agua',
  agua: 'madera',
}

/** Ciclo de control: Madera→Tierra→Agua→Fuego→Metal→Madera. */
export const CONTROLS: Record<Element, Element> = {
  madera: 'tierra',
  tierra: 'agua',
  agua: 'fuego',
  fuego: 'metal',
  metal: 'madera',
}
