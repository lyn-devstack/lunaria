import { ELEMENT_TONES } from './elements'

/**
 * Armonía entre tonos concretos (por nombre), independiente del elemento.
 * - CLASH: parejas que chocan o caen en tópico (verde + rojo = Navidad).
 * - CHIC: parejas que combinan con elegancia.
 * Es una interpretación editable; cualquier pareja no listada es neutra.
 */
export const CLASH: [string, string][] = [
  ['verde', 'rojo'],
  ['verde botella', 'rojo'],
  // Verde + rojizos = disfraz de Navidad. El ÚNICO verde que puede ir con burdeos es el oliva.
  ['verde botella', 'burdeos'],
  ['verde botella', 'granate'],
  ['verde botella', 'naranja'],
  ['verde botella', 'rosa'],
  ['verde oliva', 'rojo'],
  ['verde oliva', 'granate'],
  ['verde oliva', 'rosa'],
  ['verde oliva', 'naranja'],
  ['verde', 'granate'],
  ['verde', 'burdeos'],
  ['verde', 'rosa'],
  ['verde', 'naranja'],
  ['turquesa', 'rojo'],
  ['rojo', 'naranja'],
  ['rojo', 'rosa'],
  ['naranja', 'rosa'],
  ['naranja', 'granate'],
  ['mostaza', 'rojo'],
]

export const CHIC: [string, string][] = [
  // Fuego con el resto
  ['burdeos', 'verde oliva'],
  ['verde oliva', 'crudo'],
  ['verde oliva', 'camel'],
  ['verde oliva', 'marrón'],
  ['verde oliva', 'beige'],
  ['verde oliva', 'blanco'],
  ['verde oliva', 'negro'],
  ['verde oliva', 'azul marino'],
  ['verde oliva', 'mostaza'],
  ['verde oliva', 'terracota'],
  ['burdeos', 'camel'],
  ['burdeos', 'crudo'],
  ['burdeos', 'gris'],
  ['burdeos', 'plateado'],
  ['burdeos', 'rosa'],
  ['burdeos', 'azul marino'],
  ['granate', 'camel'],
  ['granate', 'beige'],
  ['granate', 'crudo'],
  ['granate', 'gris'],
  ['granate', 'azul marino'],
  ['rojo', 'negro'],
  ['rojo', 'crudo'],
  ['rojo', 'beige'],
  ['rojo', 'blanco'],
  ['rosa', 'gris'],
  ['rosa', 'azul marino'],
  ['rosa', 'crudo'],
  ['rosa', 'camel'],
  ['rosa', 'marrón'],
  ['naranja', 'azul marino'],
  ['naranja', 'crudo'],
  ['naranja', 'marrón'],
  ['naranja', 'azul oscuro'],
  // Tierra
  ['terracota', 'crudo'],
  ['terracota', 'verde botella'],
  ['terracota', 'azul marino'],
  ['mostaza', 'azul marino'],
  ['mostaza', 'negro'],
  ['mostaza', 'marrón'],
  ['mostaza', 'verde botella'],
  ['camel', 'negro'],
  ['camel', 'azul marino'],
  ['camel', 'blanco'],
  ['camel', 'verde botella'],
  ['beige', 'azul marino'],
  ['beige', 'negro'],
  ['beige', 'verde botella'],
  ['marrón', 'crudo'],
  ['marrón', 'turquesa'],
  // Madera
  ['verde botella', 'crudo'],
  ['turquesa', 'azul marino'],
  ['turquesa', 'crudo'],
  ['turquesa', 'plateado'],
  ['turquesa', 'camel'],
  ['verde', 'blanco'],
  ['verde', 'crudo'],
  ['verde', 'camel'],
  ['verde', 'azul marino'],
  ['verde', 'azul oscuro'],
  ['verde', 'negro'],
  ['verde', 'gris'],
  ['verde', 'beige'],
  ['verde', 'marrón'],
  ['verde', 'plateado'],
  ['turquesa', 'negro'],
  ['turquesa', 'blanco'],
  ['turquesa', 'gris'],
  ['turquesa', 'beige'],
  // Azul oscuro con colores claros o cálidos
  ['azul oscuro', 'crudo'],
  ['azul oscuro', 'blanco'],
  ['azul oscuro', 'camel'],
  ['azul oscuro', 'mostaza'],
  ['azul oscuro', 'rosa'],
  ['azul oscuro', 'beige'],
  // Metal y Agua
  ['plateado', 'azul marino'],
  ['gris', 'negro'],
  ['blanco', 'negro'],
  ['blanco', 'azul marino'],
  ['crudo', 'azul marino'],
  ['crudo', 'negro'],
  ['gris', 'azul marino'],
]

const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`)
const clashSet = new Set(CLASH.map(([a, b]) => key(a, b)))
const chicSet = new Set(CHIC.map(([a, b]) => key(a, b)))

export const clashes = (a: string, b: string): boolean => clashSet.has(key(a, b))

// ---------------------------------------------------------------------------------------------
// Teoría del color: monocromático, análogos y complementarios sobre la rueda cromática.
// ---------------------------------------------------------------------------------------------

const HEX: Record<string, string> = Object.fromEntries(
  Object.values(ELEMENT_TONES)
    .flat()
    .map((t) => [t.name, t.hex]),
)

/** Neutros de moda: combinan con casi todo y sirven de base. El resto son colores "con carácter". */
const NEUTRALS = new Set([
  'negro', 'azul marino', 'blanco', 'crudo', 'gris', 'plateado', 'beige', 'camel', 'marrón',
])
export const isNeutral = (name: string): boolean => NEUTRALS.has(name)

interface Hsl {
  h: number // 0 – 360
  s: number // 0 – 1
  l: number // 0 – 1
}

const toHsl = (name: string): Hsl => {
  const n = parseInt(HEX[name].slice(1), 16)
  const r = (n >> 16) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return { h: 0, s: 0, l }
  const s = d / (1 - Math.abs(2 * l - 1))
  const h =
    max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return { h: (h * 60 + 360) % 360, s, l }
}

/** Distancia entre dos tonos en la rueda cromática (0 – 180°). */
const hueDistance = (a: Hsl, b: Hsl): number => {
  const d = Math.abs(a.h - b.h) % 360
  return d > 180 ? 360 - d : d
}

/**
 * Puntuación por teoría del color de una pareja de tonos:
 * - monocromática (mismo tono, distinta luminosidad): elegante
 * - análoga (vecinos en la rueda): suave y armónica
 * - complementaria (opuestos): solo si uno es oscuro o apagado; si no, es estridente (verde + rojo vivo)
 * - neutro + color: siempre funciona
 */
export const theoryScore = (a: string, b: string): number => {
  const na = isNeutral(a)
  const nb = isNeutral(b)
  if (na && nb) return 0.5 // seguro, pero sobrio
  if (na || nb) return 1.5 // base neutra + color

  const ha = toHsl(a)
  const hb = toHsl(b)
  const d = hueDistance(ha, hb)
  if (d <= 20) return Math.abs(ha.l - hb.l) >= 0.1 ? 2 : 1 // monocromática
  if (d <= 60) return 1.5 // análogos
  if (d >= 135) {
    // complementarios: bien si alguno es profundo o apagado, mal si ambos son vivos
    const deep = Math.min(ha.l, hb.l) < 0.42 || Math.max(ha.s, hb.s) < 0.45
    return deep ? 2 : -3
  }
  return 0 // zona intermedia
}

/** Puntuación final de una pareja: choque -10 · teoría del color · +1 si está en la lista de elegantes. */
export const harmony = (a: string, b: string): number =>
  clashSet.has(key(a, b)) ? -10 : theoryScore(a, b) + (chicSet.has(key(a, b)) ? 1 : 0)

// ---------------------------------------------------------------------------------------------
// Estilo de una combinación (para mostrarlo y explicarlo)
// ---------------------------------------------------------------------------------------------

export type StyleKind = 'monocromatico' | 'analogos' | 'complementarios' | 'neutros-color' | 'neutros' | 'equilibrado'

export interface HarmonyStyle {
  kind: StyleKind
  label: string
  help: string
}

const STYLES: Record<StyleKind, HarmonyStyle> = {
  monocromatico: { kind: 'monocromatico', label: 'Monocromático', help: 'un mismo color en distintos tonos: elegante y estilizado' },
  analogos: { kind: 'analogos', label: 'Análogos', help: 'colores vecinos en la rueda: suave y armónico' },
  complementarios: { kind: 'complementarios', label: 'Complementarios', help: 'colores opuestos en la rueda: contraste con estilo' },
  'neutros-color': { kind: 'neutros-color', label: 'Neutros + un color', help: 'base neutra con un color que destaca' },
  neutros: { kind: 'neutros', label: 'Neutros', help: 'paleta sobria y atemporal' },
  equilibrado: { kind: 'equilibrado', label: 'Equilibrado', help: 'combinación variada y bien repartida' },
}

/** Clasifica la combinación de tonos principales de un look. */
export const harmonyStyle = (names: string[]): HarmonyStyle => {
  const hsl = names.map(toHsl)

  // Monocromático: dos o más tonos con color (aunque sean "neutros", como el azul marino) del mismo matiz.
  const tinted = hsl.filter((c) => c.s > 0.15)
  if (tinted.length >= 2 && tinted.every((a) => tinted.every((b) => hueDistance(a, b) <= 25))) {
    return STYLES.monocromatico
  }

  const colourful = names.filter((n) => !isNeutral(n))
  if (colourful.length === 0) return STYLES.neutros
  if (colourful.length === 1) return STYLES['neutros-color']

  const hs = colourful.map(toHsl)
  const dists = hs.flatMap((a, i) => hs.slice(i + 1).map((b) => hueDistance(a, b)))
  if (dists.some((d) => d >= 135)) return STYLES.complementarios
  if (dists.every((d) => d <= 60)) return STYLES.analogos
  return STYLES.equilibrado
}
