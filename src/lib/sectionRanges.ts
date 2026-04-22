/**
 * Mapa de rangos de scroll por sección (valores 0–1).
 *
 * Cada entrada define el rango del scroll global en el que
 * esa sección es considerada "activa". La escena 3D y los
 * efectos de color usan estos rangos para interpolar estados.
 *
 * Ejemplo: evidence está activa cuando progress está entre 0.14 y 0.34
 */

export const SECTION_RANGES = {
  hero:         [0.0,  0.14],
  evidence:     [0.14, 0.34],
  capabilities: [0.34, 0.50],
  thinking:     [0.50, 0.66],
  about:        [0.66, 0.78],
  standards:    [0.78, 0.90],
  contact:      [0.90, 1.00],
} as const
