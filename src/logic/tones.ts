import { ELEMENT_TONES } from '../data/elements'
import { clashes, harmony } from '../data/harmony'
import type { Element, Tone } from '../types'

/**
 * Tonos de `element` ordenados del más cercano a la energía de `user` al menos cercano.
 * El orden dentro de cada grupo es el de la tabla de datos (estable).
 */
export const tonesFor = (element: Element, user: Element): Tone[] => {
  const all = ELEMENT_TONES[element]
  if (element === user) return [...all]
  const close = all.filter((t) => t.affinity.includes(user))
  const rest = all.filter((t) => !t.affinity.includes(user))
  return [...close, ...rest]
}

interface Combo {
  tones: Tone[]
  score: number
}

/** Luminosidad percibida de un color #rrggbb (0 – 255). */
const luminance = (hex: string): number => {
  const n = parseInt(hex.slice(1), 16)
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
}

/** Cuánto pesa estar cerca de la energía de la usuaria frente a la armonía y el contraste. */
const AFFINITY_BONUS = 0.6
/** Margen de puntuación dentro del cual las combinaciones se consideran igual de buenas y rotan. */
const NEAR_WINDOW = 4
const MAX_ROTATION = 40

/**
 * Todas las combinaciones (un tono por parte) con su puntuación: cercanía a la usuaria + armonía
 * entre tonos + un punto si hay contraste claro/oscuro (looks menos planos).
 */
const scoreCombos = (candidates: Tone[][], user: Element): Combo[] => {
  const out: Combo[] = []
  const walk = (i: number, picked: Tone[], score: number) => {
    if (i === candidates.length) {
      const lums = picked.map((t) => luminance(t.hex))
      const contrast = Math.max(...lums) - Math.min(...lums) >= 90 ? 1 : 0
      return void out.push({ tones: picked, score: score + contrast })
    }
    candidates[i].forEach((t, idx) => {
      let s = score + (t.affinity.includes(user) ? AFFINITY_BONUS : 0) - 0.05 * idx
      for (const p of picked) s += harmony(p.name, t.name)
      walk(i + 1, [...picked, t], s)
    })
  }
  walk(0, [], 0)
  return out.sort((a, b) => b.score - a.score)
}

/**
 * Tonos a mostrar por parte para una combinación elegida: el tono elegido primero y después sus
 * compañeros compatibles. Nada de lo que se muestra puede chocar con lo ya mostrado.
 */
const displayFor = (chosen: Tone[], candidates: Tone[][], pcts: number[]): Tone[][] => {
  const shown: Tone[] = []
  return chosen.map((_, i) => {
    const others = chosen.filter((_, j) => j !== i)
    const rest = candidates[i]
      .filter(
        (t) =>
          t !== chosen[i] &&
          !others.some((o) => clashes(o.name, t.name)) &&
          !shown.some((s) => clashes(s.name, t.name)),
      )
      .sort(
        (a, b) =>
          others.reduce((s, o) => s + harmony(o.name, b.name), 0) -
          others.reduce((s, o) => s + harmony(o.name, a.name), 0),
      )
    const list = [chosen[i], ...rest].slice(0, pcts[i] >= 40 ? 3 : 2)
    shown.push(...list)
    return list
  })
}

/** En cuántas partes coinciden dos combinaciones (mismo tono principal). */
const sharedTones = (a: Tone[], b: Tone[]): number => a.filter((t, i) => t === b[i]).length

/**
 * Varias ideas de look para el mismo día: la primera es la del día (`variant` rota entre las mejores
 * combinaciones) y las siguientes son otras combinaciones igual de armoniosas, lo más distintas posible.
 * Todas respetan los elementos y los % de las reglas; solo cambian los tonos concretos.
 */
export const pickIdeas = (
  elements: Element[],
  pcts: number[],
  user: Element,
  variant = 0,
  count = 3,
): Tone[][][] => {
  const candidates = elements.map((el) => tonesFor(el, user))
  const combos = scoreCombos(candidates, user)
  const near = combos.filter((c) => c.score >= combos[0].score - NEAR_WINDOW).slice(0, MAX_ROTATION)
  // Reparto uniforme (secuencia de razón áurea): días consecutivos caen en zonas muy distintas
  // de la lista, y a lo largo de las semanas pasan por todas las combinaciones por igual.
  const start = Math.floor(((Math.abs(variant) * 0.6180339887) % 1) * near.length)

  const chosen: Combo[] = [near[start]]
  const ordered = near.map((_, k) => near[(start + k) % near.length]).slice(1)
  // Primero las que cambian al menos dos tonos respecto a las ya elegidas; si faltan, cualquiera distinta.
  for (const strict of [true, false]) {
    for (const c of ordered) {
      if (chosen.length >= count) break
      if (chosen.includes(c)) continue
      const limit = strict ? elements.length - 1 : elements.length
      if (chosen.every((p) => sharedTones(p.tones, c.tones) < limit)) chosen.push(c)
    }
  }
  return chosen.map((c) => displayFor(c.tones, candidates, pcts))
}

/** La combinación principal del día (ver `pickIdeas`). */
export const pickTones = (
  elements: Element[],
  pcts: number[],
  user: Element,
  variant = 0,
): Tone[][] => pickIdeas(elements, pcts, user, variant, 1)[0]
