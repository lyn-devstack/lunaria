import { ELEMENT_NAME } from '../data/elements'
import type { DayInfo } from '../data/days'
import type { Element, Look, Piece } from '../types'

export interface PiecePick {
  piece: Piece
  score: number
  metalMatch: boolean
  reason: string
}

/**
 * Joyas a recomendar: puntúan por la suma de los % de los elementos (distintos) de sus piedras
 * que están en el look, con un extra si su metal es el del día. Una joya con varias piedras
 * (esmeralda + diamantes = Madera + Metal) suma los dos elementos.
 * Sin ninguna piedra en el look, solo se recomienda si su metal es el del día.
 */
export const pickJewelry = (owned: Piece[], look: Look, day: DayInfo): PiecePick[] => {
  const picks: PiecePick[] = []
  for (const piece of owned) {
    const metalMatch = day.metals.includes(piece.metal)

    // Piedras de la joya agrupadas por elemento, solo las que están en el look.
    const byElement = new Map<Element, string[]>()
    for (const s of piece.stones) {
      if (!look.parts.some((p) => p.element === s.element)) continue
      byElement.set(s.element, [...(byElement.get(s.element) ?? []), s.name])
    }

    let score = 0
    const reasons: string[] = []
    for (const [element, names] of byElement) {
      const pct = look.parts.find((p) => p.element === element)!.pct
      score += pct
      reasons.push(`${names.join(', ')}: ${ELEMENT_NAME[element]} ${pct}%`)
    }

    if (score === 0 && !metalMatch) continue
    if (metalMatch) {
      score += score > 0 ? 5 : 1
      reasons.push('metal del día')
    }
    picks.push({ piece, score, metalMatch, reason: reasons.join(' · ') })
  }
  return picks.sort((a, b) => b.score - a.score)
}

/** La mejor pieza de cada tipo (un anillo, un colgante…), manteniendo el orden por puntuación. */
export const bestPerType = (picks: PiecePick[]): PiecePick[] => {
  const seen = new Set<string>()
  return picks.filter((p) => (seen.has(p.piece.type) ? false : (seen.add(p.piece.type), true)))
}
