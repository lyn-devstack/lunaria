import type { Element, Jewel, MetalName } from '../types'

export const METALS: MetalName[] = ['oro', 'plata', 'oro rosa']

export const STONES: Record<Element, string[]> = {
  agua: ['ónix', 'obsidiana', 'zafiro', 'lapislázuli'],
  metal: ['diamante', 'perla', 'cuarzo blanco'],
  madera: ['esmeralda', 'jade', 'malaquita'],
  fuego: ['rubí', 'granate', 'cuarzo rosa', 'amatista'],
  tierra: ['citrino', 'ojo de tigre', 'ámbar'],
}

export const STONE_ELEMENT: Record<string, Element> = Object.fromEntries(
  (Object.entries(STONES) as [Element, string[]][]).flatMap(([el, list]) => list.map((s) => [s, el])),
)

export const jewelId = (metal: MetalName, stone: string | null) => `${metal}|${stone ?? 'solo metal'}`

export const parseJewel = (id: string): Jewel | null => {
  const [metal, stone] = id.split('|')
  if (!METALS.includes(metal as MetalName)) return null
  if (stone === 'solo metal') return { id, metal: metal as MetalName, stone: null }
  return stone in STONE_ELEMENT ? { id, metal: metal as MetalName, stone } : null
}
