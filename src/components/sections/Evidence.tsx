/**
 * Sección Evidence — casos de estudio.
 *
 * Introduce los tres proyectos con copy de contexto.
 * Las tarjetas de casos son el punto de entrada al panel
 * expandido editorial (Fase 4 — aún pendiente).
 *
 * Legibilidad: body text a text-xl.
 */

import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

export default function Evidence() {
  const c = siteCopy.evidence

  return (
    <section id="evidence" className="relative py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        <FadeUp>
          <p className="font-mono text-xs tracking-[0.25em] text-accent-cyan mb-6 uppercase">
            {c.eyebrow}
          </p>

          <h2 className="text-4xl md:text-6xl font-bold text-textPrimary leading-none tracking-tight mb-6">
            {c.title}
          </h2>

          <p className="text-textSecondary text-xl max-w-2xl leading-relaxed">
            {c.body}
          </p>
        </FadeUp>

        {/* Placeholder — se reemplaza en Fase 4 con las tarjetas reales */}
        <FadeUp delay={0.12}>
          <div className="mt-16 border border-white/[0.06] rounded-sm p-8 text-textSecondary/30 font-mono text-xs tracking-widest text-center">
            CASE STUDIES — FASE 4
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
