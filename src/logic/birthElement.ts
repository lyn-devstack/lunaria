import type { Element } from '../types'

const BY_LAST_DIGIT: Element[] = [
  'metal', // 0
  'metal', // 1
  'agua', // 2
  'agua', // 3
  'madera', // 4
  'madera', // 5
  'fuego', // 6
  'fuego', // 7
  'tierra', // 8
  'tierra', // 9
]

/** Elemento por la última cifra del año. */
export const elementFromYear = (year: number): Element => BY_LAST_DIGIT[Math.abs(year) % 10]

/** Año "efectivo" de nacimiento: enero → año anterior; febrero → anterior si nació antes del 4. */
export const effectiveYear = (month: number, year: number, beforeFeb4 = false): number => {
  if (month === 1) return year - 1
  if (month === 2 && beforeFeb4) return year - 1
  return year
}

export const birthElement = (month: number, year: number, beforeFeb4 = false): Element =>
  elementFromYear(effectiveYear(month, year, beforeFeb4))
