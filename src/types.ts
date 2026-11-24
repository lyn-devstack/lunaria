export type Element = 'agua' | 'metal' | 'madera' | 'fuego' | 'tierra'

export type Role = 'BASE' | 'PUENTE' | 'ACENTO'

export type Relation = 'fuerte' | 'ideal' | 'consume' | 'choque-U' | 'choque-D'

export type MetalName = 'oro' | 'plata' | 'oro rosa'

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

export interface Look {
  relation: Relation
  parts: LookPart[]
  /** Elemento que controla a la usuaria y cuánto puede aparecer en el look. */
  limit: { element: Element; maxPct: number; inLook: boolean }
  warning?: string
  why: string
  sentence: string
}

export interface Jewel {
  id: string
  metal: MetalName
  stone: string | null
}

export interface Profile {
  version: 1
  onboarded: boolean
  element: Element
  birthMonth?: number
  birthYear?: number
  beforeFeb4?: boolean
  jewelry: string[]
}
