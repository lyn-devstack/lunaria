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
    return { date, day, look: recommend(user, day.element) }
  })
}
