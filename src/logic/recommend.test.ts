import { describe, expect, it } from 'vitest'
import { DAYS } from '../data/days'
import { ELEMENTS, ELEMENT_NAME, ELEMENT_TONES } from '../data/elements'
import { CONTROLS, GENERATES } from '../data/cycles'
import { clashes } from '../data/harmony'
import { limitText, recommend } from './recommend'
import { dayVariant } from './week'
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
  it('Agua en día de Fuego: nunca rojo vivo, y casi siempre burdeos/granate', () => {
    let close = 0
    const N = 28
    for (let v = 0; v < N; v++) {
      const fuego = recommend('agua', 'fuego', v).parts.find((p) => p.element === 'fuego')!
      expect(fuego.tones.map((t) => t.name)).not.toContain('rojo')
      if (['burdeos', 'granate'].includes(fuego.tones[0].name)) close++
    }
    expect(close / N).toBeGreaterThanOrEqual(0.6)
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

  it('dos días con el mismo elemento (lunes/miércoles) no repiten look en la misma semana', () => {
    const lunes = new Date(2026, 10, 23)
    const miercoles = new Date(2026, 10, 25)
    for (const U of ELEMENTS) {
      const a = recommend(U, 'agua', dayVariant(lunes)).parts.map((p) => p.tones[0].name).join('+')
      const b = recommend(U, 'agua', dayVariant(miercoles)).parts.map((p) => p.tones[0].name).join('+')
      expect(a, `U=${U}`).not.toBe(b)
    }
  })

  it('hay variedad real a lo largo de las semanas (no siempre el mismo tono principal)', () => {
    for (const U of ELEMENTS) {
      for (const D of ELEMENTS) {
        const tops = new Set(
          Array.from({ length: 28 }, (_, v) => recommend(U, D, v).parts[0].tones[0].name),
        )
        // Para Agua en día de Agua (70/30) la base es siempre su elemento, pero tiene varios tonos.
        expect(tops.size, `${U}/${D}`).toBeGreaterThan(1)
      }
    }
  })

  it('cada día ofrece otras ideas: mismos elementos y %, combinaciones distintas y sin choques', () => {
    for (const [U, D] of pairs) {
      for (const v of variants) {
        const look = recommend(U, D, v)
        expect(look.ideas.length, `${U}/${D}/v${v}`).toBeGreaterThanOrEqual(1)
        const key = (parts: typeof look.parts) => parts.map((p) => p.tones[0].name).join('+')
        const seen = new Set([key(look.parts)])
        for (const idea of look.ideas) {
          // mismos elementos, % y roles que el look principal
          expect(idea.parts.map((p) => [p.element, p.pct, p.role])).toEqual(
            look.parts.map((p) => [p.element, p.pct, p.role]),
          )
          // distinta de las demás
          expect(seen.has(key(idea.parts)), `${U}/${D}/v${v} repetida`).toBe(false)
          seen.add(key(idea.parts))
          // sin choques entre tonos mostrados
          for (let i = 0; i < idea.parts.length; i++)
            for (let j = i + 1; j < idea.parts.length; j++)
              for (const a of idea.parts[i].tones)
                for (const b of idea.parts[j].tones)
                  expect(clashes(a.name, b.name), `${U}/${D}: ${a.name}+${b.name}`).toBe(false)
          expect(idea.sentence.length).toBeGreaterThan(10)
        }
      }
    }
  })

  it('para Agua hay al menos 2 ideas extra casi todos los días (más de 3 en total)', () => {
    const look = recommend('agua', 'fuego', 0)
    expect(look.ideas.length).toBe(2)
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
