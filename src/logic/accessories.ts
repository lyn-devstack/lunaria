import { STONE_ELEMENT, parseJewel } from '../data/jewelry'
import type { DayInfo } from '../data/days'
import type { Jewel, Look } from '../types'

export interface JewelPick {
  jewel: Jewel
  reason: string
  score: number
}

/**
 * Joyas del joyero a recomendar: las que tienen una piedra cuyo elemento está en el look
 * (más peso cuanto mayor es su %), con un extra si el metal coincide con el del día.
 * Las joyas sin piedra solo se recomiendan si su metal es el del día.
 */
export const pickJewelry = (owned: string[], look: Look, day: DayInfo): JewelPick[] => {
  const picks: JewelPick[] = []
  for (const id of owned) {
    const jewel = parseJewel(id)
    if (!jewel) continue
    const metalMatches = day.metals.includes(jewel.metal)

    if (jewel.stone) {
      const part = look.parts.find((p) => p.element === STONE_ELEMENT[jewel.stone!])
      if (!part) continue
      picks.push({
        jewel,
        score: part.pct + (metalMatches ? 5 : 0),
        reason: `${jewel.stone} es de ${part.element} (${part.pct}% de tu look)${metalMatches ? ' y su metal es el del día' : ''}`,
      })
    } else if (metalMatches) {
      picks.push({ jewel, score: 1, reason: 'su metal es el del día' })
    }
  }
  return picks.sort((a, b) => b.score - a.score)
}
