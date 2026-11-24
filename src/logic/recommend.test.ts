import { describe, expect, it } from 'vitest'
import { DAYS } from '../data/days'
import { ELEMENTS, ELEMENT_NAME, ELEMENT_TONES } from '../data/elements'
import { CONTROLS, GENERATES } from '../data/cycles'
import { limitText, recommend } from './recommend'
import { controllerOf, nourisherOf, relationOf } from './relations'

const pairs = ELEMENTS.flatMap((U) => ELEMENTS.map((D) => [U, D] as const))

describe('relaciones', () => {
  it('cada par (U, D) cae en una relación', () => {
    for (const [U, D] of pairs) expect(relationOf(U, D)).toBeDefined()
  })
  it('clasifica correctamente', () => {
    expect(relationOf('agua', 'agua')).toBe('fuerte')
    expect(relationOf('agua', 'metal')).toBe('ideal') // Metal genera Agua
    expect(relationOf('agua', 'madera')).toBe('consume') // Agua genera Madera
    expect(relationOf('agua', 'fuego')).toBe('choque-U') // Agua controla Fuego
    expect(relationOf('agua', 'tierra')).toBe('choque-D') // Tierra controla Agua
  })
  it('nutridor y controlador', () => {
    expect(nourisherOf('agua')).toBe('metal')
    expect(nourisherOf('madera')).toBe('agua')
    expect(controllerOf('agua')).toBe('tierra')
    expect(controllerOf('fuego')).toBe('agua')
  })
  it('los ciclos son permutaciones completas', () => {
    expect(new Set(Object.values(GENERATES)).size).toBe(5)
    expect(new Set(Object.values(CONTROLS)).size).toBe(5)
  })
})

describe('recommend: porcentajes por caso', () => {
  const pct = (U: any, D: any) => recommend(U, D).parts.map((p) => [p.element, p.pct])

  it('U = D → U 70 · nutridor 30', () => {
    expect(pct('fuego', 'fuego')).toEqual([
      ['fuego', 70],
      ['madera', 30],
    ])
  })
  it('D genera a U → D 50 · U 50', () => {
    expect(pct('agua', 'metal')).toEqual([
      ['agua', 50],
      ['metal', 50],
    ])
  })
  it('U genera a D → D 40 · U 40 · nutridor de U 20', () => {
    expect(pct('agua', 'madera')).toEqual([
      ['agua', 40],
      ['madera', 40],
      ['metal', 20],
    ])
  })
  it('U controla a D → U 60 · puente (lo que U genera) 25 · D 15', () => {
    expect(pct('agua', 'fuego')).toEqual([
      ['agua', 60],
      ['madera', 25],
      ['fuego', 15],
    ])
  })
  it('D controla a U → puente (lo que D genera) 40 · U 40 · D 20', () => {
    // U = Agua, D = Tierra: Tierra genera Metal
    expect(pct('agua', 'tierra')).toEqual([
      ['agua', 40],
      ['metal', 40],
      ['tierra', 20],
    ])
  })
})

describe('recommend: invariantes sobre las 25 combinaciones', () => {
  it.each(pairs)('U=%s D=%s: suma 100, un solo BASE, tonos válidos', (U, D) => {
    const look = recommend(U, D)
    expect(look.parts.reduce((s, p) => s + p.pct, 0)).toBe(100)
    expect(look.parts.filter((p) => p.role === 'BASE')).toHaveLength(1)
    expect(look.parts[0].role).toBe('BASE')
    for (const p of look.parts) {
      expect(p.tones.length).toBeGreaterThan(0)
      for (const t of p.tones) expect(ELEMENT_TONES[p.element]).toContain(t)
    }
    // Sin elementos repetidos
    expect(new Set(look.parts.map((p) => p.element)).size).toBe(look.parts.length)
    expect(look.sentence.length).toBeGreaterThan(10)
  })

  it('solo el choque U controla a D lleva aviso', () => {
    for (const [U, D] of pairs) {
      const look = recommend(U, D)
      expect(Boolean(look.warning)).toBe(look.relation === 'choque-U')
    }
    expect(recommend('agua', 'fuego').warning).toBe('No vayas 100% en tu color: añade el acento del día')
  })
})

describe('recommend: lenguaje del límite', () => {
  it('nunca dice "evita X" si X aparece en el look', () => {
    for (const [U, D] of pairs) {
      const look = recommend(U, D)
      const text = limitText(look.limit)
      const inLook = look.parts.some((p) => p.element === look.limit.element)
      expect(look.limit.inLook).toBe(inLook)
      if (inLook) {
        expect(text.toLowerCase()).not.toContain('evita')
        expect(text).toMatch(/^No más del \d+% de /)
      } else {
        expect(text).toBe(`Evita grandes cantidades de ${ELEMENT_NAME[look.limit.element]}`)
      }
    }
  })
  it('cuando D controla a U, el límite coincide con el % de D', () => {
    const look = recommend('agua', 'tierra')
    expect(limitText(look.limit)).toBe('No más del 20% de Tierra')
  })
})

describe('recommend: tono más cercano a U', () => {
  it('Agua en día de Fuego: burdeos/granate antes que rojo vivo', () => {
    const fuego = recommend('agua', 'fuego').parts.find((p) => p.element === 'fuego')!
    const names = fuego.tones.map((t) => t.name)
    expect(names[0]).toBe('burdeos')
    expect(names).not.toContain('rojo')
  })
})

describe('semana', () => {
  it('cada día tiene elemento válido', () => {
    expect(DAYS).toHaveLength(7)
    for (const d of DAYS) expect(ELEMENTS).toContain(d.element)
  })
})
