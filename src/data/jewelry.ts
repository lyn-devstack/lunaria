import type { Element, JewelType, MetalName, Piece, Stone } from '../types'

export const METALS: MetalName[] = ['oro amarillo', 'oro blanco', 'oro rosa', 'plata']

export const JEWEL_TYPES: { id: JewelType; label: string }[] = [
  { id: 'anillo', label: 'Anillo' },
  { id: 'colgante', label: 'Cadena / colgante' },
  { id: 'pulsera', label: 'Pulsera' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'otro', label: 'Otro' },
]

export const TYPE_LABEL: Record<JewelType, string> = Object.fromEntries(
  JEWEL_TYPES.map((t) => [t.id, t.label]),
) as Record<JewelType, string>

/** Piedras del catálogo por elemento. La aguamarina cuenta como Agua (por su azul). */
export const STONES: Record<Element, string[]> = {
  agua: ['ónix', 'obsidiana', 'zafiro', 'lapislázuli', 'aguamarina'],
  metal: ['diamante', 'perla', 'cuarzo blanco'],
  madera: ['esmeralda', 'jade', 'malaquita'],
  fuego: ['rubí', 'granate', 'cuarzo rosa', 'amatista'],
  tierra: ['citrino', 'ojo de tigre', 'ámbar'],
}

export const STONE_ELEMENT: Record<string, Element> = Object.fromEntries(
  (Object.entries(STONES) as [Element, string[]][]).flatMap(([el, list]) => list.map((s) => [s, el])),
)

/** Piedra del catálogo por nombre, o null si no existe. */
export const catalogStone = (name: string): Stone | null =>
  name in STONE_ELEMENT ? { name, element: STONE_ELEMENT[name] } : null

export const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

/** Nombre a mostrar: el que puso la usuaria o uno generado ("Anillo de oro amarillo con esmeralda y diamante"). */
export const pieceTitle = (p: Piece): string => {
  if (p.name?.trim()) return p.name.trim()
  const names = p.stones.map((s) => s.name)
  const withStones =
    names.length === 0
      ? ''
      : ` con ${names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`}`
  return `${TYPE_LABEL[p.type]} de ${p.metal}${withStones}`
}

export const isPiece = (x: unknown): x is Piece => {
  const p = x as Piece
  return (
    !!p &&
    typeof p.id === 'string' &&
    JEWEL_TYPES.some((t) => t.id === p.type) &&
    METALS.includes(p.metal) &&
    Array.isArray(p.stones) &&
    p.stones.every(
      (s) => s && typeof s.name === 'string' && ['agua', 'metal', 'madera', 'fuego', 'tierra'].includes(s.element),
    )
  )
}
