import { describe, expect, it } from 'vitest'
import { DAYS } from '../data/days'
import { jewelId, parseJewel } from '../data/jewelry'
import { pickJewelry } from './accessories'
import { recommend } from './recommend'

describe('metal del día', () => {
  const label = (i: number) => DAYS[i].metalLabel
  it('coincide con la tabla', () => {
    expect(label(1)).toBe('plateado') // lunes
    expect(label(3)).toBe('plateado') // miércoles
    expect(label(2)).toBe('dorado u oro rosa') // martes
    expect(label(0)).toBe('dorado u oro rosa') // domingo
    expect(label(4)).toBe('dorado discreto') // jueves
    expect(label(5)).toBe('plateado o dorado') // viernes
    expect(label(6)).toBe('dorado') // sábado
  })
})

describe('jewelId / parseJewel', () => {
  it('es reversible', () => {
    expect(parseJewel(jewelId('oro rosa', 'rubí'))).toMatchObject({ metal: 'oro rosa', stone: 'rubí' })
    expect(parseJewel(jewelId('plata', null))).toMatchObject({ metal: 'plata', stone: null })
  })
  it('descarta ids inválidos', () => {
    expect(parseJewel('bronce|rubí')).toBeNull()
    expect(parseJewel('oro|piedra-inventada')).toBeNull()
  })
})

describe('pickJewelry', () => {
  // Usuaria Agua en día Fuego (martes): look Agua 60 · Madera 25 · Fuego 15
  const look = recommend('agua', 'fuego')
  const martes = DAYS[2]

  it('recomienda solo joyas cuya piedra está en el look', () => {
    const owned = [
      jewelId('plata', 'ónix'), // Agua → sí
      jewelId('oro', 'esmeralda'), // Madera → sí
      jewelId('oro', 'rubí'), // Fuego → sí
      jewelId('oro', 'citrino'), // Tierra → no
      jewelId('oro', 'perla'), // Metal → no
    ]
    const picks = pickJewelry(owned, look, martes).map((p) => p.jewel.stone)
    expect(picks).toEqual(['ónix', 'esmeralda', 'rubí'])
  })

  it('ordena por peso en el look y suma un extra si el metal es el del día', () => {
    const owned = [jewelId('oro', 'esmeralda'), jewelId('oro', 'ónix')]
    const [first, second] = pickJewelry(owned, look, martes)
    expect(first.jewel.stone).toBe('ónix') // 60%+5
    expect(second.jewel.stone).toBe('esmeralda') // 25%+5
    expect(first.score).toBe(65)
  })

  it('una joya sin piedra solo cuenta si su metal es el del día', () => {
    const owned = [jewelId('oro', null), jewelId('plata', null)]
    const picks = pickJewelry(owned, look, martes)
    expect(picks).toHaveLength(1)
    expect(picks[0].jewel.metal).toBe('oro')
  })

  it('ignora ids corruptos', () => {
    expect(pickJewelry(['basura'], look, martes)).toEqual([])
  })
})
