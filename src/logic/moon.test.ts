import { describe, expect, it } from 'vitest'
import { moonPhase } from './moon'
import { addDays, isSameDay, mondayOf, weekOf } from './week'

describe('moonPhase', () => {
  it('luna nueva el 6 de enero de 2000', () => {
    const m = moonPhase(new Date(2000, 0, 6))
    expect(m.index).toBe(0)
    expect(m.illumination).toBeLessThan(0.05)
  })
  it('luna llena el 21 de enero de 2000', () => {
    const m = moonPhase(new Date(2000, 0, 21))
    expect(m.index).toBe(4)
    expect(m.illumination).toBeGreaterThan(0.95)
  })
  it('la edad siempre está en [0, 29.53)', () => {
    for (let i = -400; i < 800; i += 7) {
      const m = moonPhase(addDays(new Date(2026, 5, 1), i))
      expect(m.age).toBeGreaterThanOrEqual(0)
      expect(m.age).toBeLessThan(29.531)
      expect(m.index).toBeGreaterThanOrEqual(0)
      expect(m.index).toBeLessThan(8)
    }
  })
})

describe('semana', () => {
  it('empieza en lunes, también si la fecha es domingo', () => {
    const domingo = new Date(2026, 10, 22) // domingo
    expect(domingo.getDay()).toBe(0)
    expect(mondayOf(domingo).getDay()).toBe(1)
    expect(isSameDay(mondayOf(domingo), new Date(2026, 10, 16))).toBe(true)
  })
  it('devuelve 7 días consecutivos de lunes a domingo', () => {
    const w = weekOf(new Date(2026, 10, 24), 'agua')
    expect(w).toHaveLength(7)
    expect(w.map((e) => e.day.short)).toEqual(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'])
  })
})
