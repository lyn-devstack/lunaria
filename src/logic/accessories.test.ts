import { describe, expect, it } from 'vitest'
import { DAYS } from '../data/days'
import { catalogStone, isPiece, pieceTitle } from '../data/jewelry'
import { parseProfile } from '../storage/profile'
import type { JewelType, MetalName, Piece } from '../types'
import { bestPerType, pickJewelry } from './accessories'
import { recommend } from './recommend'

const stone = (n: string) => catalogStone(n)!
const piece = (id: string, type: JewelType, metal: MetalName, stones: string[] = [], name?: string): Piece => ({
  id,
  type,
  metal,
  stones: stones.map(stone),
  name,
})

describe('metal del día', () => {
  it('coincide con la tabla', () => {
    expect(DAYS[1].metalLabel).toBe('plateado') // lunes
    expect(DAYS[3].metalLabel).toBe('plateado') // miércoles
    expect(DAYS[2].metalLabel).toBe('dorado u oro rosa') // martes
    expect(DAYS[0].metalLabel).toBe('dorado u oro rosa') // domingo
    expect(DAYS[4].metalLabel).toBe('dorado discreto') // jueves
    expect(DAYS[5].metalLabel).toBe('plateado o dorado') // viernes
    expect(DAYS[6].metalLabel).toBe('dorado') // sábado
  })
  it('plateado incluye plata y oro blanco; dorado, oro amarillo y rosa según el día', () => {
    expect(DAYS[1].metals).toEqual(expect.arrayContaining(['plata', 'oro blanco']))
    expect(DAYS[1].metals).not.toContain('oro amarillo')
    expect(DAYS[2].metals).toEqual(['oro amarillo', 'oro rosa'])
    expect(DAYS[4].metals).toEqual(['oro amarillo'])
    expect(DAYS[5].metals).toEqual(expect.arrayContaining(['plata', 'oro blanco', 'oro amarillo']))
  })
})

describe('catálogo de piedras', () => {
  it('la aguamarina es de Agua', () => {
    expect(catalogStone('aguamarina')).toEqual({ name: 'aguamarina', element: 'agua' })
  })
  it('piedra desconocida → null', () => {
    expect(catalogStone('piedra-inventada')).toBeNull()
  })
})

describe('pieceTitle / isPiece', () => {
  it('genera el nombre con tipo, metal y piedras', () => {
    expect(pieceTitle(piece('1', 'anillo', 'oro amarillo', ['esmeralda', 'diamante']))).toBe(
      'Anillo de oro amarillo con esmeralda y diamante',
    )
    expect(pieceTitle(piece('2', 'pulsera', 'plata'))).toBe('Pulsera de plata')
  })
  it('usa el nombre de la usuaria si lo puso', () => {
    expect(pieceTitle(piece('3', 'anillo', 'oro blanco', [], '  Mi anillo  '))).toBe('Mi anillo')
  })
  it('valida piezas', () => {
    expect(isPiece(piece('1', 'anillo', 'oro rosa', ['rubí']))).toBe(true)
    expect(isPiece({ id: 'x', type: 'corona', metal: 'oro rosa', stones: [] })).toBe(false)
    expect(isPiece({ id: 'x', type: 'anillo', metal: 'bronce', stones: [] })).toBe(false)
    expect(isPiece(null)).toBe(false)
  })
})

describe('pickJewelry', () => {
  // Usuaria Agua en día Fuego (martes): look Agua 60 · Madera 25 · Fuego 15
  const look = recommend('agua', 'fuego')
  const martes = DAYS[2]

  it('suma los elementos de varias piedras (esmeralda + diamantes = Madera + Metal)', () => {
    // Look de Madera 40 · ... usamos Agua en día de Madera: Agua 40 · Madera 40 · Metal 20
    const l = recommend('agua', 'madera')
    const anillo = piece('a', 'anillo', 'oro amarillo', ['esmeralda', 'diamante'])
    const [pick] = pickJewelry([anillo], l, DAYS[4]) // jueves: oro amarillo
    expect(pick.score).toBe(40 + 20 + 5) // Madera + Metal + metal del día
    expect(pick.reason).toContain('esmeralda: Madera 40%')
    expect(pick.reason).toContain('diamante: Metal 20%')
    expect(pick.reason).toContain('metal del día')
  })

  it('un anillo de oro amarillo y otro de oro blanco: cada día gana el del metal que toca', () => {
    const amarillo = piece('a', 'anillo', 'oro amarillo', ['esmeralda', 'diamante'])
    const blanco = piece('b', 'anillo', 'oro blanco', ['aguamarina', 'diamante'])
    const l = recommend('agua', 'madera') // Agua 40 · Madera 40 · Metal 20

    // Jueves (dorado): amarillo = 40+20+5 = 65; blanco = 40(Agua)+20 = 60
    expect(pickJewelry([amarillo, blanco], l, DAYS[4])[0].piece.id).toBe('a')
    // Lunes (plateado): blanco = 40+20+5 = 65; amarillo = 60
    expect(pickJewelry([amarillo, blanco], l, DAYS[1])[0].piece.id).toBe('b')
  })

  it('descarta joyas sin ninguna piedra en el look y con metal que no es el del día', () => {
    const owned = [
      piece('1', 'anillo', 'plata', ['citrino']), // Tierra: no está en el look
      piece('2', 'anillo', 'plata', ['ónix']), // Agua 60: sí
    ]
    expect(pickJewelry(owned, look, martes).map((p) => p.piece.id)).toEqual(['2'])
  })

  it('una joya sin piedras solo cuenta si su metal es el del día', () => {
    const owned = [piece('1', 'pulsera', 'oro amarillo'), piece('2', 'pulsera', 'plata')]
    const picks = pickJewelry(owned, look, martes)
    expect(picks.map((p) => p.piece.id)).toEqual(['1'])
    expect(picks[0].reason).toBe('metal del día')
  })

  it('piedra de elemento personalizado ("otra piedra") también puntúa', () => {
    const custom: Piece = { id: 'c', type: 'colgante', metal: 'plata', stones: [{ name: 'labradorita', element: 'agua' }] }
    expect(pickJewelry([custom], look, martes)[0].score).toBe(60)
  })

  it('ordena por puntuación', () => {
    const owned = [
      piece('rubi', 'anillo', 'plata', ['rubí']), // Fuego 15
      piece('onix', 'anillo', 'plata', ['ónix']), // Agua 60
      piece('esm', 'anillo', 'plata', ['esmeralda']), // Madera 25
    ]
    expect(pickJewelry(owned, look, martes).map((p) => p.piece.id)).toEqual(['onix', 'esm', 'rubi'])
  })
})

describe('bestPerType', () => {
  it('deja la mejor pieza de cada tipo', () => {
    const look = recommend('agua', 'fuego')
    const owned = [
      piece('a1', 'anillo', 'plata', ['ónix']), // 60
      piece('a2', 'anillo', 'plata', ['esmeralda']), // 25
      piece('p1', 'pulsera', 'plata', ['esmeralda']), // 25
    ]
    const best = bestPerType(pickJewelry(owned, look, DAYS[2]))
    expect(best.map((p) => p.piece.id)).toEqual(['a1', 'p1'])
  })
})

describe('parseProfile (migración)', () => {
  const base = { onboarded: true, element: 'agua', birthMonth: 7, birthYear: 1992 }

  it('migra la v1 conservando elemento y nacimiento, y descarta el joyero antiguo', () => {
    const p = parseProfile({ ...base, version: 1, jewelry: ['oro|rubí'] })!
    expect(p.version).toBe(2)
    expect(p.element).toBe('agua')
    expect(p.birthYear).toBe(1992)
    expect(p.jewelry).toEqual([])
  })
  it('lee la v2 y filtra piezas corruptas', () => {
    const ok = piece('1', 'anillo', 'oro blanco', ['aguamarina', 'diamante'])
    const p = parseProfile({ ...base, version: 2, jewelry: [ok, { id: 'malo' }] })!
    expect(p.jewelry).toEqual([ok])
  })
  it('rechaza datos inválidos', () => {
    expect(parseProfile(null)).toBeNull()
    expect(parseProfile({ ...base, version: 9, jewelry: [] })).toBeNull()
    expect(parseProfile({ ...base, element: 'aire', version: 2, jewelry: [] })).toBeNull()
  })
})
