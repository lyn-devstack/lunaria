import type { Element, MetalName } from '../types'

export interface DayInfo {
  /** Índice de Date.getDay(): 0 = domingo. */
  index: number
  name: string
  short: string
  element: Element
  planet: string
  metals: MetalName[]
  metalLabel: string
}

/** "Plateado" incluye la plata y el oro blanco. */
const SILVER: MetalName[] = ['plata', 'oro blanco']

export const DAYS: DayInfo[] = [
  { index: 0, name: 'Domingo', short: 'Dom', element: 'fuego', planet: 'Sol', metals: ['oro amarillo', 'oro rosa'], metalLabel: 'dorado u oro rosa' },
  { index: 1, name: 'Lunes', short: 'Lun', element: 'agua', planet: 'Luna', metals: SILVER, metalLabel: 'plateado' },
  { index: 2, name: 'Martes', short: 'Mar', element: 'fuego', planet: 'Marte', metals: ['oro amarillo', 'oro rosa'], metalLabel: 'dorado u oro rosa' },
  { index: 3, name: 'Miércoles', short: 'Mié', element: 'agua', planet: 'Mercurio', metals: SILVER, metalLabel: 'plateado' },
  { index: 4, name: 'Jueves', short: 'Jue', element: 'madera', planet: 'Júpiter', metals: ['oro amarillo'], metalLabel: 'dorado discreto' },
  { index: 5, name: 'Viernes', short: 'Vie', element: 'metal', planet: 'Venus', metals: [...SILVER, 'oro amarillo'], metalLabel: 'plateado o dorado' },
  { index: 6, name: 'Sábado', short: 'Sáb', element: 'tierra', planet: 'Saturno', metals: ['oro amarillo'], metalLabel: 'dorado' },
]

export const dayInfo = (date: Date): DayInfo => DAYS[date.getDay()]
