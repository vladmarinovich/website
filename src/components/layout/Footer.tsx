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

import { useReducedMotion } from '@/hooks/useReducedMotion'

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

/* ── Portal echo — anillos CSS concéntricos respirando ────── */
function PortalEcho() {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <div className="relative h-[180px] flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] rounded-full border border-accent-cyan/15" />
      </div>
    )
  }

  return (
    <div
      className="relative z-10 h-[200px] md:h-[260px] flex items-center justify-center pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 3 anillos emanando — animación GPU (transform/opacity solamente) */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute top-1/2 left-1/2 w-[60px] h-[60px] rounded-full border border-accent-cyan/30 will-change-transform"
          style={{
            animation: `portalEmanate 12s linear infinite`,
            animationDelay: `${-i * 4}s`,
          }}
        />
      ))}

      {/* Punto central — el origen del portal */}
      <span className="relative w-1.5 h-1.5 rounded-full bg-accent-cyan/70 will-change-transform [animation:portalPulse_4s_ease-in-out_infinite]" />

      <style>{`
        @keyframes portalEmanate {
          0%   { transform: translate(-50%, -50%) scale(0.5);  opacity: 0; }
          10%  { opacity: 0.7; }
          70%  { opacity: 0.15; }
          100% { transform: translate(-50%, -50%) scale(15);   opacity: 0; }
        }
        @keyframes portalPulse {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

/* ── Footer ──────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden" style={{ background: '#05070B' }}>

      {/* Portal echo — el corredor sigue abierto */}
      <PortalEcho />

      {/* Email gigante — el ancla visual del footer */}
      <div className="relative z-10 px-6 md:px-12 pt-4 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.34em] text-accent-cyan/55 uppercase mb-6">
            (·) Línea directa
          </p>

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
          <p className="text-textPrimary/80 text-2xl md:text-3xl lg:text-4xl font-semibold leading-[1.15] tracking-[-0.02em] max-w-3xl">
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
            VLADMARINOVICH.COM <span className="text-textSecondary/25 mx-2">·</span> 2026
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
