import { describe, expect, it } from 'vitest'
import { ELEMENT_TONES } from './elements'
import { harmony, harmonyStyle, isNeutral, theoryScore } from './harmony'

const ALL = Object.values(ELEMENT_TONES).flat().map((t) => t.name)

describe('theoryScore (teoría del color)', () => {
  it('complementarios vivos puntúan mal (verde + rojo = Navidad)', () => {
    expect(theoryScore('verde', 'rojo')).toBeLessThan(0)
    expect(theoryScore('verde', 'rosa')).toBeLessThan(0)
  })
  it('complementarios profundos puntúan bien (burdeos + verde botella)', () => {
    expect(theoryScore('burdeos', 'verde botella')).toBeGreaterThan(0)
  })
  it('un neutro con un color siempre funciona', () => {
    for (const n of ['negro', 'crudo', 'gris', 'camel'])
      for (const c of ['burdeos', 'verde', 'rosa', 'turquesa']) expect(theoryScore(n, c)).toBeGreaterThanOrEqual(1.5)
  })
  it('neutro con neutro es seguro pero sobrio (menos que neutro con color)', () => {
    expect(theoryScore('negro', 'gris')).toBeLessThan(theoryScore('negro', 'burdeos'))
  })
  it('monocromático (mismo matiz, distinta luminosidad) puntúa alto', () => {
    expect(theoryScore('burdeos', 'rosa')).toBeGreaterThanOrEqual(1.5)
  })
  it('es simétrica y está definida para todos los pares', () => {
    for (const a of ALL)
      for (const b of ALL) {
        expect(Number.isFinite(harmony(a, b))).toBe(true)
        expect(harmony(a, b)).toBe(harmony(b, a))
      }
  })
  it('los choques de la lista siguen puntuando como choque', () => {
    expect(harmony('verde', 'rojo')).toBe(-10)
    expect(harmony('verde', 'naranja')).toBe(-10)
  })
})

describe('isNeutral', () => {
  it('reconoce los neutros de moda, incluido el azul marino', () => {
    for (const n of ['negro', 'azul marino', 'blanco', 'crudo', 'gris', 'plateado', 'beige', 'camel', 'marrón'])
      expect(isNeutral(n), n).toBe(true)
    for (const c of ['burdeos', 'verde', 'turquesa', 'rosa', 'naranja']) expect(isNeutral(c), c).toBe(false)
  })
})

describe('harmonyStyle', () => {
  it('monocromático', () => {
    expect(harmonyStyle(['azul marino', 'azul oscuro']).kind).toBe('monocromatico')
  })
  it('neutros', () => {
    expect(harmonyStyle(['negro', 'gris', 'blanco']).kind).toBe('neutros')
  })
  it('neutros con un color', () => {
    expect(harmonyStyle(['negro', 'burdeos']).kind).toBe('neutros-color')
    expect(harmonyStyle(['azul marino', 'gris', 'turquesa']).kind).toBe('neutros-color')
  })
  it('complementarios', () => {
    expect(harmonyStyle(['negro', 'burdeos', 'verde botella']).kind).toBe('complementarios')
  })
  it('análogos', () => {
    expect(harmonyStyle(['rojo', 'naranja']).kind).toBe('analogos')
  })
  it('siempre devuelve etiqueta y explicación', () => {
    for (const a of ALL)
      for (const b of ALL) {
        const s = harmonyStyle([a, b])
        expect(s.label.length).toBeGreaterThan(0)
        expect(s.help.length).toBeGreaterThan(0)
      }
  })
})
