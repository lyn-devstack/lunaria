import type { Element, Tone } from '../types'

export const ELEMENTS: Element[] = ['agua', 'metal', 'madera', 'fuego', 'tierra']

export const ELEMENT_NAME: Record<Element, string> = {
  agua: 'Agua',
  metal: 'Metal',
  madera: 'Madera',
  fuego: 'Fuego',
  tierra: 'Tierra',
}

export const ELEMENT_GLYPH: Record<Element, string> = {
  agua: '☾',
  metal: '✧',
  madera: '❦',
  fuego: '✺',
  tierra: '◈',
}

/** Color de acento de la interfaz para cada elemento (no es una recomendación de look). */
export const ELEMENT_UI: Record<Element, string> = {
  agua: '#5b7fbf',
  metal: '#c9ccd6',
  madera: '#4f9d7a',
  fuego: '#c4505a',
  tierra: '#b98a58',
}

/**
 * Colores de cada elemento. `affinity` indica para qué elemento de usuaria es el tono más cercano
 * (ej.: para Agua en día de Fuego, burdeos y granate antes que rojo vivo). Es una interpretación
 * editable: el orden de cada lista es el orden por defecto.
 */
export const ELEMENT_TONES: Record<Element, Tone[]> = {
  agua: [
    { name: 'negro', hex: '#0d0d12', affinity: ['tierra', 'metal'] },
    { name: 'azul marino', hex: '#16264a', affinity: ['metal', 'madera'] },
    { name: 'azul oscuro', hex: '#24467a', affinity: ['madera', 'fuego'] },
  ],
  metal: [
    { name: 'blanco', hex: '#f4f1ea', affinity: ['madera', 'fuego'] },
    { name: 'crudo', hex: '#e6dcc8', affinity: ['tierra', 'fuego'] },
    { name: 'gris', hex: '#9a9ca6', affinity: ['agua', 'madera'] },
    { name: 'plateado', hex: '#c7cad3', affinity: ['agua', 'madera'] },
  ],
  madera: [
    { name: 'verde', hex: '#3f9a5e', affinity: ['fuego', 'agua'] },
    { name: 'verde botella', hex: '#155a41', affinity: ['agua', 'tierra'] },
    { name: 'turquesa', hex: '#2aa6a0', affinity: ['agua', 'metal'] },
  ],
  fuego: [
    { name: 'rojo', hex: '#c8283a', affinity: ['madera'] },
    { name: 'burdeos', hex: '#6d1830', affinity: ['agua', 'madera'] },
    { name: 'granate', hex: '#8a1f33', affinity: ['agua', 'tierra'] },
    { name: 'naranja', hex: '#e07a2f', affinity: ['tierra', 'madera'] },
    { name: 'rosa', hex: '#e59ab0', affinity: ['metal'] },
  ],
  tierra: [
    { name: 'marrón', hex: '#6a4630', affinity: ['agua'] },
    { name: 'beige', hex: '#d8c3a0', affinity: ['metal'] },
    { name: 'camel', hex: '#b98a54', affinity: ['madera', 'fuego'] },
    { name: 'mostaza', hex: '#c9a02e', affinity: ['madera', 'fuego'] },
    { name: 'terracota', hex: '#b55b3d', affinity: ['fuego'] },
  ],
}
