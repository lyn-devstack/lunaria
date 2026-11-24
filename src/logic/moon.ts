const SYNODIC = 29.530588853
/** Luna nueva de referencia: 6 de enero de 2000, 18:14 UTC. */
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14)
const DAY_MS = 86_400_000

export interface MoonPhase {
  /** Edad de la luna en días (0 – 29.53). */
  age: number
  /** Fracción iluminada (0 – 1). */
  illumination: number
  /** Fase en 8 tramos: 0 nueva … 4 llena … 7 menguante. */
  index: number
  name: string
  waxing: boolean
}

const NAMES = [
  'Luna nueva',
  'Luna creciente',
  'Cuarto creciente',
  'Gibosa creciente',
  'Luna llena',
  'Gibosa menguante',
  'Cuarto menguante',
  'Luna menguante',
]

export const moonPhase = (date: Date): MoonPhase => {
  // Mediodía local para que la fase sea estable durante todo el día.
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12).getTime()
  const days = (noon - REF_NEW_MOON) / DAY_MS
  const age = ((days % SYNODIC) + SYNODIC) % SYNODIC
  const fraction = age / SYNODIC
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2
  const index = Math.floor(fraction * 8 + 0.5) % 8
  return { age, illumination, index, name: NAMES[index], waxing: fraction < 0.5 }
}
