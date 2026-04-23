/**
 * Footer — barra de cierre de la página.
 *
 * Mínima: marca a la izquierda, links sociales a la derecha.
 * Fondo semi-transparente sobre el negro del documento.
 */

import { siteCopy } from '@/content/siteCopy'

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/vladmarinovich' },
  { label: 'GitHub',   href: 'https://github.com/vladmarinovich'      },
]

export default function Footer() {
  const f = siteCopy.footer

  return (
    <footer className="relative z-10 border-t border-white/[0.07] bg-background/80 backdrop-blur-sm px-6 md:px-12 py-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Marca */}
        <p className="font-mono text-xs tracking-[0.22em] text-textSecondary/40 uppercase">
          {f.brand}
        </p>

        {/* Nota central (desktop) */}
        <p className="hidden md:block font-mono text-[10px] tracking-[0.16em] text-textSecondary/25 uppercase text-center">
          {f.note}
        </p>

        {/* Links sociales */}
        <div className="flex items-center gap-6">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-[0.18em] text-textSecondary/40 hover:text-textSecondary transition-colors uppercase"
            >
              {s.label}
            </a>
          ))}
        </div>

      </div>
    </footer>
  )
}
