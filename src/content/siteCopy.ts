/**
 * Copia textual del sitio organizada por sección.
 *
 * Todas las cadenas de texto visibles al usuario viven aquí.
 * Los componentes importan de este archivo en lugar de tener
 * strings hardcodeados — facilita editar el copy sin tocar JSX.
 */

export const siteCopy = {
  nav: {
    brand: 'Vlad Marinovich',
    links: [
      { id: 'evidence',     label: 'Trabajo'   },
      { id: 'thinking',     label: 'Criterio'  },
      { id: 'about',        label: 'Sobre mí'  },
      { id: 'contact',      label: 'Contacto'  },
    ],
    cta: 'Agendar llamada',
  },

  hero: {
    eyebrow:     'DISPONIBLE · Q2 2026',
    title:       'Convierto ideas en sistemas que funcionan solos.',
    subtitle:    'Ingeniería, estrategia y ejecución en una sola mente operativa. Diseño infraestructura digital, producto y decisiones con criterio de sistema.',
    supporting:  'No vendo servicios. Diseño claridad, estructura y tracción.',
    ctaPrimary:  'Agendar una llamada',
    ctaSecondary:'Ver evidencia',
    scrollHint:  'Entrar al sistema',
    // Métricas de impacto en la franja inferior del hero
    metrics: [
      { value: 'Sistemas reales',    label: 'en producción'         },
      { value: 'Diagnóstico',        label: 'que se vuelve decisión'},
      { value: 'Producto, data',     label: 'y operación'           },
      { value: '+4.200 patitas',     label: 'con casa nueva'        },
    ],
  },

  evidence: {
    eyebrow: 'EVIDENCIA',
    title:   'Construido antes de vendido.',
    body:    'No promesas. No posicionamiento vacío. Sistemas reales, interfaces reales y lectura estratégica aplicada a problemas reales.',
  },

  capabilities: {
    eyebrow: 'CAPACIDADES',
    title:   'No servicios. Capas de intervención.',
    body:    'Cada compromiso empieza igual: primero entiendo el sistema. Después decido qué conviene construir, qué conviene conectar y qué conviene eliminar.',
    items: [
      {
        title: 'Arquitectura digital',
        body:  'Diseño estructuras que ordenan producto, operación y datos para que el crecimiento no dependa del caos.',
      },
      {
        title: 'Activación de sistemas',
        body:  'Conecto piezas, flujos y decisiones para que lo importante deje de vivir repartido entre herramientas, intuiciones y urgencias.',
      },
      {
        title: 'Data e inteligencia operativa',
        body:  'Traduzco señales en lectura útil. Menos dashboard decorativo, más dirección real.',
      },
      {
        title: 'Experiencia y posicionamiento',
        body:  'Cuando hace falta, convierto complejidad en una experiencia clara, deseable y estratégicamente legible.',
      },
    ],
  },

  thinking: {
    eyebrow: 'CRITERIO',
    title:   'La diferencia no es hacer más. Es ver mejor.',
    body:    'La mayoría ejecuta demasiado pronto. Yo prefiero detectar primero qué tiene sentido construir, qué puede escalar y qué solo va a producir ruido.',
    principles: [
      {
        title: 'El sistema antes que la herramienta',
        body:  'No empiezo por stack, feature o moda. Empiezo por estructura, dependencias y lógica operativa.',
      },
      {
        title: 'La claridad antes que el volumen',
        body:  'Más herramientas no resuelven un sistema mal pensado. La claridad sí.',
      },
      {
        title: 'La evidencia antes que el discurso',
        body:  'No me interesa sonar capaz. Me interesa que el trabajo vuelva eso obvio.',
      },
      {
        title: 'Construir antes de vender',
        body:  'Mi credibilidad no nace de un pitch. Nace de haber convertido ideas en sistemas que hoy existen.',
      },
    ],
  },

  about: {
    eyebrow:       'SOBRE MÍ',
    title:         'Humano por fuera. Sistémico por dentro.',
    bodyPrimary:   'Pienso como partner, no como proveedor. Entro para entender el mapa completo, detectar lo que importa y construir la estructura correcta para moverlo.',
    bodySecondary: 'Construyo antes de vender. Salvando Patitas no es un discurso sobre impacto. Es la prueba de que cuando algo importa de verdad, también se puede diseñar con rigor.',
    quote:         'Sé exactamente lo que hago. Y lo que hago define el estándar.',
  },

  standards: {
    eyebrow:  'ESTÁNDARES',
    title:    'Esto funciona mejor con ambición real.',
    body:     'Trabajo mejor con founders, líderes, empresas y fundaciones que no están buscando alguien que ejecute, sino alguien que entienda el sistema, tome criterio y lo convierta en estructura.',
    yesTitle: 'Con quién sí',
    yesItems: [
      'Equipos con complejidad real',
      'Proyectos que necesitan criterio, no solo manos',
      'Empresas o fundaciones con visión de largo plazo',
      'Personas que valoran estructura, claridad y velocidad con sentido',
    ],
    noTitle: 'Con quién no',
    noItems: [
      'Proyectos rápidos y baratos sin dirección',
      'Equipos que quieren un empleado disfrazado de consultor',
      'Decisiones guiadas por moda, no por sistema',
      'Cualquier relación donde la estrategia sea opcional',
    ],
  },

  contact: {
    eyebrow:    'CONTACTO',
    title:      'Si llegaste hasta aquí, probablemente ya entendiste el nivel.',
    body:       'No necesitas un pitch. Solo una conversación honesta sobre lo que quieres resolver y si soy la persona correcta para construirlo contigo.',
    ctaPrimary:  'Agendar una llamada',
    ctaSecondary:'Escribir directo',
    microcopy:  'Cero formularios largos. Cero fricción. Solo una conversación útil.',
  },

  footer: {
    brand: 'VLADMARINOVICH.COM',
    note:  'Hecho con disciplina, criterio y sistemas que sí viven en producción.',
  },
}
