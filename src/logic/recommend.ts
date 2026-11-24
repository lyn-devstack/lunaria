import { GENERATES } from '../data/cycles'
import { ELEMENT_NAME } from '../data/elements'
import type { Element, Look, LookPart, Relation, Role } from '../types'
import { controllerOf, nourisherOf, relationOf } from './relations'
import { tonesFor } from './tones'

type Spec = { element: Element; pct: number; role: Role }

const specsFor = (relation: Relation, U: Element, D: Element): Spec[] => {
  switch (relation) {
    case 'fuerte':
      return [
        { element: U, pct: 70, role: 'BASE' },
        { element: nourisherOf(U), pct: 30, role: 'ACENTO' },
      ]
    case 'ideal':
      return [
        { element: U, pct: 50, role: 'BASE' },
        { element: D, pct: 50, role: 'PUENTE' },
      ]
    case 'consume':
      return [
        { element: U, pct: 40, role: 'BASE' },
        { element: D, pct: 40, role: 'PUENTE' },
        { element: nourisherOf(U), pct: 20, role: 'ACENTO' },
      ]
    case 'choque-U':
      return [
        { element: U, pct: 60, role: 'BASE' },
        { element: GENERATES[U], pct: 25, role: 'PUENTE' },
        { element: D, pct: 15, role: 'ACENTO' },
      ]
    case 'choque-D':
      return [
        { element: U, pct: 40, role: 'BASE' },
        { element: GENERATES[D], pct: 40, role: 'PUENTE' },
        { element: D, pct: 20, role: 'ACENTO' },
      ]
  }
}

const whyFor = (relation: Relation, U: Element, D: Element): string => {
  const u = ELEMENT_NAME[U]
  const d = ELEMENT_NAME[D]
  switch (relation) {
    case 'fuerte':
      return `Hoy el día también es ${d}: refuerza tu color y súmale el que te nutre.`
    case 'ideal':
      return `${d} alimenta a ${u}: mezcla a partes iguales el color del día y el tuyo.`
    case 'consume':
      return `Tu ${u} da energía a ${d} y se agota: equilibra con el color del día y recarga con el que te nutre.`
    case 'choque-U':
      return `Tu ${u} domina a ${d}: mantén tu color de base y usa un puente suave para que no choquen.`
    case 'choque-D':
      return `${d} controla a ${u}: suaviza con un color puente y limita la presencia del color del día.`
  }
}

const join = (items: string[]): string =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`

const sentenceFor = (parts: LookPart[]): string => {
  const frags = parts.map((p) => {
    const tone = p.tones[0].name
    if (p.role === 'BASE') return `base en ${tone} (vestido, jersey o pantalón)`
    if (p.role === 'PUENTE') return `${tone} en la segunda prenda (chaqueta, camisa o abrigo)`
    return `un toque de ${tone} en los detalles (bolso, pañuelo, zapatos o labios)`
  })
  const text = join(frags)
  return text.charAt(0).toUpperCase() + text.slice(1) + '.'
}

/** Motor de recomendación: elemento de la usuaria (U) + elemento del día (D) → look. */
export const recommend = (U: Element, D: Element): Look => {
  const relation = relationOf(U, D)
  const parts: LookPart[] = specsFor(relation, U, D).map((s) => {
    const tones = tonesFor(s.element, U)
    return { ...s, tones: tones.slice(0, s.pct >= 40 ? 3 : 2) }
  })

  const controller = controllerOf(U)
  const inLook = parts.find((p) => p.element === controller)
  const limit = { element: controller, maxPct: inLook?.pct ?? 0, inLook: Boolean(inLook) }

  return {
    relation,
    parts,
    limit,
    warning:
      relation === 'choque-U' ? 'No vayas 100% en tu color: añade el acento del día' : undefined,
    why: whyFor(relation, U, D),
    sentence: sentenceFor(parts),
  }
}

/** Texto del límite. Nunca dice "evita X" si X aparece en el look. */
export const limitText = (limit: Look['limit']): string =>
  limit.inLook
    ? `No más del ${limit.maxPct}% de ${ELEMENT_NAME[limit.element]}`
    : `Evita grandes cantidades de ${ELEMENT_NAME[limit.element]}`
