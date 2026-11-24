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

/** Todas las combinaciones (un tono por parte) con su puntuación de armonía y cercanía a la usuaria. */
const scoreCombos = (candidates: Tone[][], user: Element): Combo[] => {
  const out: Combo[] = []
  const walk = (i: number, picked: Tone[], score: number) => {
    if (i === candidates.length) return void out.push({ tones: picked, score })
    candidates[i].forEach((t, idx) => {
      let s = score + (t.affinity.includes(user) ? 1 : 0) - 0.1 * idx
      for (const p of picked) s += harmony(p.name, t.name)
      walk(i + 1, [...picked, t], s)
    })
  }
  walk(0, [], 0)
  return out.sort((a, b) => b.score - a.score)
}

/**
 * Elige un tono principal por parte buscando que combinen entre sí (sin choques tipo Navidad)
 * y que estén cerca de la energía de la usuaria. `variant` rota entre las mejores combinaciones
 * (casi igual de buenas) para no repetir siempre el mismo look.
 * Devuelve, por parte, los tonos a mostrar: el elegido primero y después sus compañeros compatibles.
 */
export const pickTones = (
  elements: Element[],
  pcts: number[],
  user: Element,
  variant = 0,
): Tone[][] => {
  const candidates = elements.map((el) => tonesFor(el, user))
  const combos = scoreCombos(candidates, user)
  const near = combos.filter((c) => c.score >= combos[0].score - 1.5).slice(0, 4)
  const chosen = near[Math.abs(variant) % near.length].tones

  // Los tonos ya mostrados en partes anteriores también cuentan: nada de lo que se muestra puede chocar.
  const shown: Tone[] = []
  return elements.map((_, i) => {
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
