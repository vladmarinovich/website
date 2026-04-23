/**
 * Sección Capabilities — capas de intervención.
 *
 * Muestra cuatro áreas de trabajo en una grilla 2×2.
 * Usa separadores de 1px (gap-px sobre bg-white/6) en lugar
 * de bordes individuales — resulta en líneas más limpias.
 *
 * Color de acento: purple (sincronizado con sceneStore.colorMode)
 *
 * Legibilidad: body text a text-xl, items de grilla a text-base.
 */

import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

export default function Capabilities() {
  const c = siteCopy.capabilities

  return (
    <section id="capabilities" className="relative py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        <FadeUp>
          <p className="font-mono text-sm tracking-[0.22em] text-accent-purple mb-6 uppercase">
            {c.eyebrow}
          </p>

          <h2 className="text-4xl md:text-6xl font-bold text-textPrimary leading-none tracking-tight mb-6">
            {c.title}
          </h2>

          <p className="text-textSecondary text-xl max-w-2xl leading-relaxed mb-16">
            {c.body}
          </p>
        </FadeUp>

        {/* Grilla 2×2 — separadores de 1px */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
          {c.items.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08} className="bg-background">
              <div className="p-8">
                <h3 className="text-textPrimary font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-textSecondary text-lg leading-relaxed">{item.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>

      </div>
    </section>
  )
}
