/**
 * Casos de estudio mostrados en la sección Evidence.
 *
 * Cada CaseStudy incluye el problema, la intervención, el resultado
 * y métricas de impacto concretas. El panel expandido los muestra
 * en su totalidad cuando el usuario abre un caso.
 */

import type { CaseStudy } from '@/types/case'

export const cases: CaseStudy[] = [
  {
    id:       'salvando-patitas',
    slug:     'salvando-patitas',
    eyebrow:  'CASO 01',
    title:    'Salvando Patitas',
    category: 'Producto · Operaciones · Impacto',
    summary:  'Plataforma digital de adopción de mascotas construida desde cero para una fundación colombiana. Diseño, desarrollo, infraestructura y operación.',

    // El problema real que enfrentaba la organización
    challenge:
      'Una fundación con misión real pero sin estructura digital. Operaban con formularios en papel, WhatsApp y hojas de cálculo. El proceso de adopción era lento, opaco y no escalable.',

    // Qué se construyó y cómo
    intervention:
      'Diseñé y construí la plataforma completa: sistema de gestión de animales, flujo de adopción digital, automatizaciones con n8n, integración con Brevo y Google Sheets, y panel de administración para el equipo.',

    // Resultado medible
    result:
      'Más de 4.200 animales con casa nueva. Tiempo de respuesta de adopción reducido de días a horas. Equipo operando con claridad sin depender de procesos manuales.',

    // Por qué este caso importa estratégicamente
    strategicRead:
      'No fue un proyecto de voluntariado. Fue la demostración de que puedo diseñar sistemas reales con impacto medible desde cero, bajo restricciones reales.',

    metrics: [
      { label: 'Animales adoptados',           value: '+4.200'  },
      { label: 'Reducción en tiempo respuesta', value: '~80%'   },
      { label: 'Automatizaciones activas',      value: '12+'    },
    ],
    assets: [
      { src: '/src/assets/images/cases/salvando-patitas/.gitkeep', alt: 'Salvando Patitas platform', kind: 'full' },
    ],
  },

  {
    id:       'casa-ronald-bigquery',
    slug:     'casa-ronald-bigquery',
    eyebrow:  'CASO 02',
    title:    'Casa Ronald Colombia — Data Warehouse',
    category: 'Data · Arquitectura · Estrategia',
    summary:  'Diseño e implementación de un data warehouse en Google BigQuery para centralizar la información operativa de Casa Ronald Colombia.',

    challenge:
      'Una organización sin fines de lucro con datos dispersos en múltiples fuentes: donaciones, estadísticas de impacto, operación de casas. Sin visibilidad centralizada, sin capacidad de tomar decisiones basadas en datos.',

    intervention:
      'Diseñé la arquitectura del DW en GCP BigQuery (dataset casa_ronald_dw). Definí el modelo de datos, los pipelines de ingesta y la estructura para migración futura a Azure. Construido con criterio de escalabilidad desde el inicio.',

    result:
      'Organización con capacidad de centralizar y leer su propia operación. Base técnica sólida para reportes de impacto, transparencia con donantes y toma de decisiones estratégicas.',

    strategicRead:
      'Los datos sin estructura son ruido. Este proyecto convirtió la operación dispersa de una fundación en inteligencia accionable.',

    metrics: [
      { label: 'Fuentes integradas', value: '6+'            },
      { label: 'Dataset principal',  value: 'casa_ronald_dw'},
      { label: 'Plataforma',         value: 'GCP BigQuery'  },
    ],
    assets: [
      { src: '/src/assets/images/cases/casa-ronald/.gitkeep', alt: 'Casa Ronald BigQuery DW', kind: 'full' },
    ],
  },

  {
    id:       'orion-bi',
    slug:     'orion-bi',
    eyebrow:  'CASO 03',
    title:    'Orion BI',
    category: 'Producto · Data · Visualización',
    summary:  'Plataforma de business intelligence diseñada para equipos que necesitan leer su operación sin depender de analistas o dashboards decorativos.',

    challenge:
      'Equipos con datos pero sin lectura. Dashboards que nadie usa porque no responden preguntas reales. Decisiones tomadas por intuición cuando el dato existía pero no era accesible.',

    intervention:
      'Diseñé la arquitectura de producto y la experiencia de Orion BI: una plataforma que convierte señales operativas en lectura útil para quien decide, no para quien analiza.',

    result:
      'Producto con visión clara, arquitectura definida y experiencia diseñada para el usuario que toma decisiones, no para el técnico que construye reportes.',

    strategicRead:
      'La mayoría de los BI tools están diseñados para analistas. Orion está diseñado para quien necesita decidir. Esa diferencia lo cambia todo.',

    metrics: [
      { label: 'Enfoque',           value: 'Decisión > Análisis'  },
      { label: 'Usuarios objetivo', value: 'Founders & Líderes'   },
      { label: 'Estado',            value: 'Producto en desarrollo'},
    ],
    assets: [
      { src: '/src/assets/images/cases/orionbi/.gitkeep', alt: 'Orion BI platform', kind: 'full' },
    ],
  },
]
