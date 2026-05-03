/**
 * Footer — la salida del portal.
 *
 * Después del blanco del Contact, el sitio vuelve al negro y el corredor
 * cuántico re-aparece como ECO en el footer: anillos concéntricos
 * respirando hacia afuera. El portal nunca cerró del todo.
 *
 * Estructura editorial estilo Made in Evolve:
 *  - portal echo (anillos CSS animados)
 *  - email gigante como ancla visual (no astronautas — la dirección
 *    misma es el sello de presencia)
 *  - manifesto line — una sola frase con peso
 *  - lettered taxonomy: (a.) (b.) (c.) (d.)
 *  - legal precision
 *
 * Todo construido con código. Cero imágenes adicionales.
 */

const EMAIL = 'consultor@vladmarinovich.com'

const ZONES = [
  {
    letter: 'a',
    label:  'Contacto directo',
    items:  [
      { label: 'Escribir',     href: `mailto:${EMAIL}`                },
      { label: 'WhatsApp',     href: 'https://wa.link/ohnau7'          },
      { label: 'Agendar',      href: 'https://cal.com/vladmarinovich'  },
    ],
  },
  {
    letter: 'b',
    label:  'Ruta del sitio',
    items:  [
      { label: 'Trabajo',  href: '#evidence'      },
      { label: 'Criterio', href: '#thinking'      },
      { label: 'Sobre mí', href: '#about'         },
      { label: 'Estándar', href: '#standards'     },
    ],
  },
  {
    letter: 'c',
    label:  'Presencia',
    items:  [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/vladmarinovich' },
      { label: 'GitHub',   href: 'https://github.com/vladmarinovich'      },
    ],
  },
  {
    letter: 'd',
    label:  'Sistema',
    items:  [
      { label: 'Versión 1.0',           href: undefined },
      { label: 'Bogotá · Colombia',     href: undefined },
      { label: 'Operativo desde 2026',  href: undefined },
    ],
  },
]

/* ── Footer ──────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden" style={{ background: '#05070B' }}>

      {/* Separador de apertura — línea sutil + punto */}
      <div className="relative z-10 px-6 md:px-12 pt-20 md:pt-28 pb-10 flex items-center gap-4">
        <div className="h-px bg-white/[0.08] flex-1" />
        <span className="font-mono text-[10px] tracking-[0.32em] text-textSecondary/30 uppercase">vladmarinovich.com</span>
        <div className="h-px bg-white/[0.08] flex-1" />
      </div>

      {/* Email gigante — el ancla visual del footer */}
      <div className="relative z-10 px-6 md:px-12 pt-4 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">

          <a
            href={`mailto:${EMAIL}`}
            className="
              group block
              text-textPrimary font-semibold leading-[0.9] tracking-[-0.04em]
              text-[2.2rem] sm:text-[3rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[7.5rem]
              break-words
              transition-colors duration-500
              hover:text-accent-cyan
            "
          >
            {EMAIL}
            <span
              aria-hidden="true"
              className="inline-block ml-3 md:ml-6 align-middle text-textSecondary/30 group-hover:text-accent-cyan/80 group-hover:translate-x-2 transition-all duration-500"
            >
              ↗
            </span>
          </a>
        </div>
      </div>

      {/* Manifesto line — una frase con peso */}
      <div className="relative z-10 px-6 md:px-12 py-12 md:py-16 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <p className="text-textPrimary/80 text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-[-0.02em] max-w-3xl">
            Diseñado, construido y operado por una sola mente.
            <span className="text-textSecondary/40"> Sin equipo. Sin agencia. Sin máscara.</span>
          </p>
        </div>
      </div>

      {/* Zonas lettered — taxonomía editorial */}
      <div className="relative z-10 px-6 md:px-12 py-14 md:py-16 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {ZONES.map((zone) => (
            <div key={zone.letter}>
              {/* Letra + label */}
              <p className="font-mono text-[10px] tracking-[0.32em] text-textSecondary/40 uppercase mb-5">
                <span className="text-accent-cyan/70">({zone.letter}.)</span>{' '}
                {zone.label}
              </p>

              {/* Items */}
              <ul className="space-y-2">
                {zone.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') || item.href.startsWith('mailto') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-mono text-xs tracking-wide text-textSecondary/70 hover:text-textPrimary transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="font-mono text-xs tracking-wide text-textSecondary/40">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Línea de cierre — legal precision */}
      <div className="relative z-10 px-6 md:px-12 py-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">

          {/* Sello — wordmark */}
          <p className="font-mono text-[10px] tracking-[0.32em] text-textSecondary/45 uppercase">
            © 2026 Vladislav Marinovich <span className="text-textSecondary/25 mx-2">·</span> VLADMARINOVICH.COM
          </p>

          {/* Tech stack — colofón corto */}
          <p className="font-mono text-[10px] tracking-[0.18em] text-textSecondary/30 uppercase text-left md:text-right">
            Geist · Three.js r184 · React · Operado en silencio.
          </p>

        </div>
      </div>

    </footer>
  )
}
