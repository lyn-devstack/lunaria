import { describe, expect, it } from 'vitest'
import { birthElement, effectiveYear, elementFromYear } from './birthElement'

describe('elementFromYear', () => {
  it.each([
    [1990, 'metal'],
    [1991, 'metal'],
    [1992, 'agua'],
    [1993, 'agua'],
    [1994, 'madera'],
    [1995, 'madera'],
    [1996, 'fuego'],
    [1997, 'fuego'],
    [1998, 'tierra'],
    [1999, 'tierra'],
  ])('%i → %s', (year, el) => {
    expect(elementFromYear(year)).toBe(el)
  })
})

describe('effectiveYear', () => {
  it('enero usa el año anterior', () => {
    expect(effectiveYear(1, 1996)).toBe(1995)
  })
  it('febrero antes del 4 usa el año anterior', () => {
    expect(effectiveYear(2, 1996, true)).toBe(1995)
  })
  it('febrero desde el 4 usa el mismo año', () => {
    expect(effectiveYear(2, 1996, false)).toBe(1996)
  })
  it('otros meses usan el mismo año (incluso si se pasa beforeFeb4)', () => {
    expect(effectiveYear(7, 1996, true)).toBe(1996)
    expect(effectiveYear(12, 2000)).toBe(2000)
  })
})

describe('birthElement', () => {
  it('enero de 1990 cuenta como 1989 → Tierra', () => {
    expect(birthElement(1, 1990)).toBe('tierra')
  })
  it('febrero de 2000 antes del 4 cuenta como 1999 → Tierra', () => {
    expect(birthElement(2, 2000, true)).toBe('tierra')
  })
  it('febrero de 2000 desde el 4 → Metal', () => {
    expect(birthElement(2, 2000, false)).toBe('metal')
  })
  it('julio de 1996 → Fuego', () => {
    expect(birthElement(7, 1996)).toBe('fuego')
  })
})
