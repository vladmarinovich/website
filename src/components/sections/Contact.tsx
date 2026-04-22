/**
 * Sección Contact — llamada a la acción final.
 *
 * Ocupa el 100% de la altura de la ventana para dar peso
 * de cierre a la experiencia de scroll.
 *
 * La escena 3D transiciona a modo "white burst" cuando esta
 * sección entra en el viewport (controlado por contactBurstProgress
 * en sceneStore — Fase 3).
 *
 * CTAs:
 *  - Primario → link a calendario / agendamiento
 *  - Secundario → mailto directo
 *
 * Animaciones: contenido entra con FadeUp staggerado para que
 * el momento de "llegada" al final del sitio se sienta limpio y poderoso.
 */

import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

export default function Contact() {
  const c = siteCopy.contact

  return (
    <section id="contact" className="relative min-h-screen flex items-center py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto w-full">

        {/* Eyebrow */}
        <FadeUp delay={0.05}>
          <p className="font-mono text-xs tracking-[0.25em] text-textSecondary mb-6 uppercase">
            {c.eyebrow}
          </p>
        </FadeUp>

        {/* Titular de cierre — la más grande del sitio */}
        <FadeUp delay={0.15}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-textPrimary leading-none tracking-tight max-w-4xl mb-8">
            {c.title}
          </h2>
        </FadeUp>

        {/* Descripción */}
        <FadeUp delay={0.25}>
          <p className="text-textSecondary text-lg max-w-xl leading-relaxed mb-12">
            {c.body}
          </p>
        </FadeUp>

        {/* CTAs + microcopy */}
        <FadeUp delay={0.35}>
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
        </FadeUp>

      </div>
    </section>
  )
}
