/**
 * Tipos para los casos de estudio mostrados en la sección Evidence.
 *
 * CaseMetric  — métrica de impacto (etiqueta + valor)
 * CaseAsset   — imagen o recurso visual del caso
 * CaseStudy   — documento completo de un caso de estudio
 */

// Métrica de resultado (ej: "Tiempo de implementación: 90 días")
export type CaseMetric = { label: string; value: string }

// Recurso visual: src es la ruta, kind define cómo encuadrarlo
export type CaseAsset = {
  src: string
  alt: string
  kind?: 'full' | 'crop' | 'detail'
}

// Estructura completa de un caso de estudio
export type CaseStudy = {
  id: string
  slug: string
  eyebrow: string        // Categoría visible sobre el título
  title: string
  category: string
  summary: string        // Resumen breve para la tarjeta
  challenge: string      // Problema que enfrentaba el cliente
  intervention: string   // Qué se hizo y cómo
  result: string         // Resultado concreto obtenido
  strategicRead: string  // Lectura estratégica del caso
  metrics?: CaseMetric[]
  assets: CaseAsset[]
}
