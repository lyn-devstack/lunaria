/**
 * Armonía entre tonos concretos (por nombre), independiente del elemento.
 * - CLASH: parejas que chocan o caen en tópico (verde + rojo = Navidad).
 * - CHIC: parejas que combinan con elegancia.
 * Es una interpretación editable; cualquier pareja no listada es neutra.
 */
export const CLASH: [string, string][] = [
  ['verde', 'rojo'],
  ['verde botella', 'rojo'],
  ['verde', 'granate'],
  ['verde', 'burdeos'],
  ['verde', 'rosa'],
  ['turquesa', 'rojo'],
  ['rojo', 'naranja'],
  ['rojo', 'rosa'],
  ['naranja', 'rosa'],
  ['naranja', 'granate'],
  ['mostaza', 'rojo'],
]

export const CHIC: [string, string][] = [
  // Fuego con el resto
  ['burdeos', 'verde botella'],
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
  ['verde botella', 'negro'],
  ['verde botella', 'gris'],
  ['turquesa', 'azul marino'],
  ['turquesa', 'crudo'],
  ['turquesa', 'plateado'],
  ['turquesa', 'camel'],
  ['verde', 'blanco'],
  ['verde', 'crudo'],
  ['verde', 'camel'],
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

/** Puntuación de una pareja de tonos: -10 choque · +2 elegante · 0 neutra. */
export const harmony = (a: string, b: string): number =>
  clashSet.has(key(a, b)) ? -10 : chicSet.has(key(a, b)) ? 2 : 0
