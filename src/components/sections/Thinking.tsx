/**
 * Sección Thinking — principios de trabajo.
 *
 * Lista los cuatro principios operativos con numeración monoespaciada.
 * Separadores de 1px entre cada ítem, sin exceso visual.
 *
 * Legibilidad: body text a text-xl, principios a text-base,
 * títulos de principio con más peso visual.
 */

import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

export default function Thinking() {
  const c = siteCopy.thinking

  return (
    <section id="thinking" className="relative py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        <FadeUp>
          <p className="font-mono text-sm tracking-[0.22em] text-textSecondary mb-6 uppercase">
            {c.eyebrow}
          </p>

          <h2 className="text-4xl md:text-6xl font-bold text-textPrimary leading-none tracking-tight mb-6">
            {c.title}
          </h2>

          <p className="text-textSecondary text-xl max-w-2xl leading-relaxed mb-16">
            {c.body}
          </p>
        </FadeUp>

        {/* Lista de principios — separados por bordes inferiores de 1px */}
        <div className="space-y-px">
          {c.principles.map((p, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div className="flex gap-8 py-8 border-b border-white/[0.06]">
                {/* Número — decorativo, tenue */}
                <span className="font-mono text-xs text-textSecondary/40 w-8 shrink-0 pt-1">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-textPrimary font-semibold text-lg mb-3">{p.title}</h3>
                  <p className="text-textSecondary text-lg leading-relaxed">{p.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

      </div>
    </section>
  )
}
