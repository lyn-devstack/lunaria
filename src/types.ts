export type Element = 'agua' | 'metal' | 'madera' | 'fuego' | 'tierra'

export type Role = 'BASE' | 'PUENTE' | 'ACENTO'

export type Relation = 'fuerte' | 'ideal' | 'consume' | 'choque-U' | 'choque-D'

export type MetalName = 'oro amarillo' | 'oro blanco' | 'oro rosa' | 'plata'

export type JewelType = 'anillo' | 'colgante' | 'pulsera' | 'pendientes' | 'otro'

export interface Tone {
  name: string
  hex: string
  /** Elementos de usuaria para los que este tono es el "más cercano" a su energía. */
  affinity: Element[]
}

export interface LookPart {
  element: Element
  pct: number
  role: Role
  /** Tonos sugeridos, ordenados del más cercano a la usuaria al menos cercano. */
  tones: Tone[]
}

/** Otra combinación de tonos para el mismo día: mismos elementos y %, distintos colores. */
export interface LookIdea {
  parts: LookPart[]
  sentence: string
}

export interface Look {
  relation: Relation
  parts: LookPart[]
  /** Otras ideas de look para el mismo día (sin la principal). */
  ideas: LookIdea[]
  /** Elemento que controla a la usuaria y cuánto puede aparecer en el look. */
  limit: { element: Element; maxPct: number; inLook: boolean }
  warning?: string
  why: string
  sentence: string
}

/** Una piedra con su elemento (del catálogo, o elegido por la usuaria si es "otra piedra"). */
export interface Stone {
  name: string
  element: Element
}

/** Una joya real de la usuaria: tipo + metal + cero o más piedras. */
export interface Piece {
  id: string
  type: JewelType
  metal: MetalName
  stones: Stone[]
  name?: string
}

export interface Profile {
  version: 2
  onboarded: boolean
  element: Element
  birthMonth?: number
  birthYear?: number
  beforeFeb4?: boolean
  jewelry: Piece[]
}
