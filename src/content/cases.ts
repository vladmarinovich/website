/**
 * Casos de estudio mostrados en la sección Evidence.
 *
 * Toda la información es real y verificable.
 * Los assets apuntan a /public/assets/cases/
 */

import type { CaseStudy } from '@/types/case'

export const cases: CaseStudy[] = [
  {
    id:       'salvando-patitas',
    slug:     'salvando-patitas',
    eyebrow:  'CASO 01',
    title:    'Salvando Patitas',
    category: 'Salesforce · Operaciones · Impacto social',
    summary:  'Sistema operativo completo para una fundación de rescate animal. Cuatro módulos que reemplazaron hojas de cálculo, WhatsApp y papel por trazabilidad real en tiempo real.',

    challenge:
      'La fundación operaba sin memoria institucional. Los datos vivían dispersos entre mensajes, hojas sueltas y la cabeza de cada voluntario. No había forma de saber el estado financiero real, la trazabilidad de cada caso ni el historial de un animal. Las decisiones operativas se tomaban en la marcha, sin información.',

    intervention:
      'Diseñé y construí un sistema operativo con cuatro módulos integrados: Rescate (gestión de casos activos), Veterinaria (historial clínico y tratamientos), Hogar de paso (disponibilidad y seguimiento) y Donaciones (gastos, pagos e ingresos). Todo conectado, todo trazable, todo en tiempo real.',

    result:
      'Evidencia trazada por cada caso. Estado financiero visible en minutos, no en semanas. El equipo opera con información real en lugar de intuición. Control total de la operación y transparencia total con donantes y aliados.',

    strategicRead:
      'Este no es un proyecto de impacto social disfrazado de tecnología. Es la demostración de que puedo tomar una operación caótica, entender sus dependencias reales y construir la infraestructura que la hace funcionar sola — con o sin voluntarios disponibles.',

    metrics: [
      { label: 'Casos gestionados',   value: '39'           },
      { label: 'Adopciones exitosas', value: '50+'          },
      { label: 'Módulos activos',     value: '4'            },
    ],
    assets: [
      { src: '/assets/cases/salvando-patitas/casos-generales.png', alt: 'Salvando Patitas — vista general del sistema', kind: 'full'   },
      { src: '/assets/cases/salvando-patitas/finanzas.png',        alt: 'Salvando Patitas — módulo de donaciones y finanzas', kind: 'detail' },
    ],
  },

  {
    id:       'casa-ronald-bigquery',
    slug:     'casa-ronald-bigquery',
    eyebrow:  'CASO 02',
    title:    'Casa Ronald Colombia',
    category: 'BigQuery · Google Ads · IA',
    summary:  'Data warehouse con arquitectura medallón que centraliza campañas de múltiples cuentas Google Ads, detecta fugas de presupuesto y conecta un agente de IA para diagnóstico y optimización en tiempo real.',

    challenge:
      'Múltiples cuentas de Google Ads sin visión centralizada. Errores de registro de conversiones que distorsionaban las decisiones. Presupuesto subvencionado (Google Grants) subutilizado. Campañas activas que no rendían y nadie lo sabía. Dinero quemado sin diagnóstico.',

    intervention:
      'Diseñé un data warehouse en Google BigQuery con arquitectura medallón (Bronze → Silver → Gold) para centralizar, enriquecer y estructurar la data de todas las cuentas. Sobre esa base se conecta un agente de IA capaz de diagnosticar errores, detectar fugas y asesorar sobre estrategia de inversión publicitaria.',

    result:
      'Toda la información de campañas centralizada y limpia en un solo lugar. Errores de tracking identificados. Oportunidades de optimización del presupuesto Google Grants documentadas y priorizadas. Base lista para BI, ML e IA.',

    strategicRead:
      'El problema no era falta de datos — era falta de estructura para leerlos. Un data warehouse bien diseñado no es un repositorio: es el sistema nervioso desde el que se pueden tomar decisiones de inversión con criterio real.',

    metrics: [
      { label: 'Arquitectura',          value: 'Medallón'     },
      { label: 'Fuente principal',       value: 'Google Ads + Grants' },
      { label: 'Capa de inteligencia',   value: 'Agente IA'   },
    ],
    assets: [
      { src: '/assets/cases/casa-ronald/mockup-1.png', alt: 'Casa Ronald — análisis de campañas', kind: 'full'   },
      { src: '/assets/cases/casa-ronald/mockup-2.png', alt: 'Casa Ronald — diagnóstico de errores', kind: 'crop'   },
      { src: '/assets/cases/casa-ronald/mockup-3.png', alt: 'Casa Ronald — recomendaciones', kind: 'detail' },
      { src: '/assets/cases/casa-ronald/mockup-4.png', alt: 'Casa Ronald — optimización de presupuesto', kind: 'detail' },
    ],
  },

  {
    id:       'orion-bi',
    slug:     'orion-bi',
    eyebrow:  'CASO 03',
    title:    'Orion BI',
    category: 'Producto · IA · Performance Marketing',
    summary:  'Plataforma de inteligencia publicitaria que unifica Meta Ads, Google Ads, TikTok y GA4 en un solo panel. Modelos predictivos de ROAS y un asistente de IA que analiza campañas en lenguaje natural.',

    challenge:
      'Agencias, e-commerce y consultores navegando entre cuatro plataformas distintas para entender qué está pasando. Reportes manuales que consumen tiempo. Dashboards que describen el pasado pero no orientan la siguiente jugada. Decisiones basadas en intuición cuando el dato existía pero era inaccesible.',

    intervention:
      'Diseñé la arquitectura de producto y la experiencia completa de Orion BI: unificación multicanal (Meta Ads, Google Ads, TikTok, GA4), modelos de machine learning para predecir ROAS y CPA, alertas inteligentes que detectan anomalías automáticamente y un asistente de IA que responde preguntas sobre campañas en lenguaje natural.',

    result:
      'Un producto con visión clara, arquitectura definida y experiencia diseñada para quien decide — no para quien analiza. MVP en desarrollo activo, con integraciones piloto en progreso hacia versión beta.',

    strategicRead:
      'La mayoría de los BI tools están diseñados para analistas. Orion está diseñado para quien necesita decidir. Esa diferencia lo cambia todo — desde la arquitectura de datos hasta la interfaz.',

    metrics: [
      { label: 'Canales unificados',  value: '4'              },
      { label: 'Estado',             value: 'MVP en desarrollo' },
      { label: 'Enfoque',            value: 'Decisión > Análisis' },
    ],
    assets: [
      { src: '/assets/cases/orionbi/mockup.webp', alt: 'Orion BI — plataforma de inteligencia publicitaria', kind: 'full' },
    ],
  },
]
