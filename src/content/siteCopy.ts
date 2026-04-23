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
    wordmark: 'VLADISLAV MARINOVICH',
    links: [
      { id: 'evidence',     label: 'Trabajo'   },
      { id: 'thinking',     label: 'Criterio'  },
      { id: 'about',        label: 'Sobre mí'  },
      { id: 'contact',      label: 'Contacto'  },
    ],
    cta: 'Agendar llamada',
  },

  hero: {
    eyebrow:    'INFRAESTRUCTURA QUE PIENSA.',
    // El subtitle actúa como H1 visual — la tesis vive ahí.
    subtitle:   'La mayoría de las organizaciones ya tiene la tecnología. El problema no es lo que falta — es lo que no está conectado.',
    supporting: 'En 120 días, eso se convierte en un sistema que opera solo.',
    ctaPrimary:  'Agendar una llamada',
    ctaSecondary:'Ver evidencia',
    scrollHint:  'Entrar al sistema',
  },

  evidence: {
    eyebrow: 'EVIDENCIA',
    title:   'No prometo. Muestro.',
    body:    'Sistemas reales, interfaces reales, criterio aplicado a problemas reales.',
  },

  capabilities: {
    eyebrow: 'CAPACIDADES',
    title:   'Veo lo que no está funcionando. Y sé exactamente por dónde entrar.',
    body:    'Primero entiendo el sistema. Después decido qué construir, qué conectar y qué eliminar.',
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
        body:  'Convierto complejidad en una experiencia clara, deseable y estratégicamente legible.',
      },
    ],
  },

  thinking: {
    eyebrow: 'CRITERIO',
    title:   'La diferencia no es lo que hago. Es lo que veo antes de hacerlo.',
    body:    'La mayoría ejecuta demasiado pronto. Yo prefiero detectar qué tiene sentido construir — y qué solo va a producir ruido.',
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
        body:  'No me interesa sonar capaz. Me interesa que el trabajo lo haga obvio.',
      },
      {
        title: 'Construir antes de vender',
        body:  'Mi credibilidad no nace de un pitch. Nace de haber convertido ideas en sistemas que hoy existen.',
      },
    ],
  },

  about: {
    eyebrow:       'SOBRE MÍ',
    title:         'Pienso como socio. Opero como fundador.',
    bodyPrimary:   'No entro a ejecutar tareas. Entro a entender el mapa completo, detectar lo que importa y construir la estructura correcta para moverlo.',
    bodySecondary: 'Salvando Patitas no es un discurso sobre impacto. Es la prueba de que cuando algo importa de verdad, también se puede diseñar con rigor.',
    quote:         'Sé exactamente lo que hago. Y lo que hago define el estándar.',
  },

  standards: {
    eyebrow:  'ESTÁNDARES',
    title:    'Trabajo mejor cuando el problema es real.',
    body:     'Con founders, líderes y equipos que no buscan manos — buscan criterio, estructura y velocidad con sentido.',
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
    eyebrow:     'CONTACTO',
    title:       'Si llegaste hasta aquí, ya sé que eres el tipo correcto.',
    body:        'Una conversación. Cero fricción.',
    ctaPrimary:  'Agendar una llamada',
    ctaSecondary:'Escribir directo',
    microcopy:   'Respondo el mismo día.',
  },

  footer: {
    brand: 'VLADMARINOVICH.COM',
    note:  'Diseñado, construido y operado por una sola mente.',
  },
}
