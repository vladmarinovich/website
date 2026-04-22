/**
 * Sección Contact — llamada a la acción final.
 *
 * Ocupa el 100% de la altura de la ventana para dar peso
 * de cierre a la experiencia de scroll.
 *
 * En Fase 5 la escena 3D transicionará a modo "white burst"
 * cuando esta sección entre en el viewport.
 *
 * CTAs:
 *  - Primario → link a calendario / agendamiento
 *  - Secundario → mailto directo
 */

import { siteCopy } from '@/content/siteCopy'

export default function Contact() {
  const c = siteCopy.contact

  return (
    <section id="contact" className="relative min-h-screen flex items-center py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto w-full">

        <p className="font-mono text-xs tracking-[0.25em] text-textSecondary mb-6 uppercase">
          {c.eyebrow}
        </p>

        {/* Titular de cierre — la más grande del sitio */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-textPrimary leading-none tracking-tight max-w-4xl mb-8">
          {c.title}
        </h2>

        <p className="text-textSecondary text-lg max-w-xl leading-relaxed mb-12">
          {c.body}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Primario — fondo blanco total (modo white de la escena) */}
          <a
            href="#"
            className="px-6 py-3 bg-textPrimary text-background font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            {c.ctaPrimary}
          </a>

          {/* Secundario — mailto directo, estilo ghost */}
          <a
            href="mailto:consultor@vladmarinovich.com"
            className="px-6 py-3 border border-white/10 text-textSecondary font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:border-white/25 hover:text-textPrimary transition-all"
          >
            {c.ctaSecondary}
          </a>
        </div>

        {/* Microcopy — reduce la fricción percibida */}
        <p className="font-mono text-xs text-textSecondary/40 tracking-[0.15em]">
          {c.microcopy}
        </p>

      </div>
    </section>
  )
}
