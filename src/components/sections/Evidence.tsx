/**
 * Sección Evidence — casos de estudio.
 *
 * Introduce los tres proyectos con copy de contexto.
 * Las tarjetas de casos son el punto de entrada al panel
 * expandido editorial (Fase 4 — aún pendiente).
 */

import { siteCopy } from '@/content/siteCopy'

export default function Evidence() {
  const c = siteCopy.evidence

  return (
    <section id="evidence" className="relative py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Eyebrow de sección */}
        <p className="font-mono text-xs tracking-[0.25em] text-accent-cyan mb-6 uppercase">
          {c.eyebrow}
        </p>

        <h2 className="text-4xl md:text-6xl font-bold text-textPrimary leading-none tracking-tight mb-6">
          {c.title}
        </h2>

        <p className="text-textSecondary text-lg max-w-2xl leading-relaxed">
          {c.body}
        </p>

        {/* Placeholder — se reemplaza en Fase 4 con las tarjetas reales */}
        <div className="mt-16 border border-white/[0.06] rounded-sm p-8 text-textSecondary font-mono text-xs tracking-widest text-center opacity-30">
          CASE STUDIES — FASE 4
        </div>

      </div>
    </section>
  )
}
