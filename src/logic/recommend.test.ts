import { describe, expect, it } from 'vitest'
import { DAYS } from '../data/days'
import { ELEMENTS, ELEMENT_NAME, ELEMENT_TONES } from '../data/elements'
import { CONTROLS, GENERATES } from '../data/cycles'
import { clashes } from '../data/harmony'
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
  it('Agua en día de Fuego: burdeos/granate, no rojo vivo, en cualquier semana', () => {
    for (let v = 0; v < 8; v++) {
      const fuego = recommend('agua', 'fuego', v).parts.find((p) => p.element === 'fuego')!
      expect(['burdeos', 'granate']).toContain(fuego.tones[0].name)
      expect(fuego.tones.map((t) => t.name)).not.toContain('rojo')
    }
  })
})

describe('recommend: combinaciones que combinan', () => {
  const variants = Array.from({ length: 8 }, (_, v) => v)
  const cases = pairs.flatMap(([U, D]) => variants.map((v) => [U, D, v] as const))

  it('nunca hay un choque (tipo verde + rojo) entre los tonos mostrados de partes distintas', () => {
    for (const [U, D, v] of cases) {
      const { parts } = recommend(U, D, v)
      for (let i = 0; i < parts.length; i++)
        for (let j = i + 1; j < parts.length; j++)
          for (const a of parts[i].tones)
            for (const b of parts[j].tones)
              expect(clashes(a.name, b.name), `${U}/${D}/v${v}: ${a.name} + ${b.name}`).toBe(false)
    }
  })

  it('el resultado es determinista para la misma semana', () => {
    expect(recommend('fuego', 'madera', 3)).toEqual(recommend('fuego', 'madera', 3))
  })

  it('rota entre combinaciones distintas según la semana', () => {
    const tops = new Set(
      variants.map((v) =>
        recommend('fuego', 'madera', v)
          .parts.map((p) => p.tones[0].name)
          .join('+'),
      ),
    )
    expect(tops.size).toBeGreaterThan(1)
  })

  it('Fuego en día de Madera (jueves) ya no es verde + rojo', () => {
    for (const v of variants) {
      const names = recommend('fuego', 'madera', v).parts.map((p) => p.tones[0].name)
      expect(names.includes('rojo') && names.includes('verde')).toBe(false)
    }
  })

  it('los porcentajes y elementos no cambian con la variante', () => {
    for (const [U, D] of pairs) {
      const base = recommend(U, D, 0).parts.map((p) => [p.element, p.pct, p.role])
      for (const v of variants)
        expect(recommend(U, D, v).parts.map((p) => [p.element, p.pct, p.role])).toEqual(base)
    }
  })
})

describe('semana', () => {
  it('cada día tiene elemento válido', () => {
    expect(DAYS).toHaveLength(7)
    for (const d of DAYS) expect(ELEMENTS).toContain(d.element)
  })
})
