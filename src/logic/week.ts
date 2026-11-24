import { dayInfo, type DayInfo } from '../data/days'
import type { Element, Look } from '../types'
import { recommend } from './recommend'

export const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const addDays = (d: Date, n: number): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

/** Lunes de la semana que contiene `d`. */
export const mondayOf = (d: Date): Date => addDays(startOfDay(d), -((d.getDay() + 6) % 7))

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/** Número de semana (desde 1970, empezando en lunes): rota las combinaciones de tonos cada semana. */
export const weekVariant = (d: Date): number => {
  const m = mondayOf(d)
  return Math.floor(Date.UTC(m.getFullYear(), m.getMonth(), m.getDate()) / (7 * 86_400_000))
}

/**
 * Variante de tonos de un día concreto: cambia cada semana Y cada día, así que dos días con el mismo
 * elemento (lunes/miércoles, martes/domingo) no repiten look.
 */
export const dayVariant = (d: Date): number => weekVariant(d) * 7 + d.getDay()

export interface WeekEntry {
  date: Date
  day: DayInfo
  look: Look
}

export const weekOf = (d: Date, user: Element): WeekEntry[] => {
  const monday = mondayOf(d)
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i)
    const day = dayInfo(date)
    return { date, day, look: recommend(user, day.element, dayVariant(date)) }
  })
}
