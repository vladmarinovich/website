/**
 * Tipos centrales para la escena 3D y el estado de la interfaz.
 *
 * SceneSection — identifica la sección activa del scroll
 * ColorMode    — paleta de acento que reacciona a la sección
 * DeviceTier   — nivel de rendimiento del dispositivo detectado
 */

// Secciones del sitio en orden de aparición vertical
export type SceneSection =
  | 'hero'
  | 'evidence'
  | 'capabilities'
  | 'thinking'
  | 'about'
  | 'standards'
  | 'contact'

// Paleta de color activa según la sección visible
export type ColorMode = 'cyan' | 'purple' | 'orange' | 'neutral' | 'white'

// Tier del dispositivo para escalar la calidad de la escena 3D
export type DeviceTier = 'high' | 'medium' | 'low'
