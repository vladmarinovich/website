/**
 * Sección Thinking — principios de trabajo.
 *
 * Lista los cuatro principios operativos con numeración monoespaciada.
 * Separadores de 1px entre cada ítem, sin exceso visual.
 *
 * El índice (01, 02...) usa text-textSecondary/40 para ser
 * decorativo pero no competir con el contenido.
 */

import { siteCopy } from '@/content/siteCopy'

export default function Thinking() {
  const c = siteCopy.thinking

  return (
    <section id="thinking" className="relative py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        <p className="font-mono text-xs tracking-[0.25em] text-textSecondary mb-6 uppercase">
          {c.eyebrow}
        </p>

        <h2 className="text-4xl md:text-6xl font-bold text-textPrimary leading-none tracking-tight mb-6">
          {c.title}
        </h2>

        <p className="text-textSecondary text-lg max-w-2xl leading-relaxed mb-16">
          {c.body}
        </p>

        {/* Lista de principios — separados por bordes inferiores de 1px */}
        <div className="space-y-px">
          {c.principles.map((p, i) => (
            <div key={i} className="flex gap-8 py-8 border-b border-white/[0.06]">
              {/* Número de ítem — decorativo, muy tenue */}
              <span className="font-mono text-xs text-textSecondary/40 w-8 shrink-0 pt-1">
                0{i + 1}
              </span>
              <div>
                <h3 className="text-textPrimary font-semibold mb-2">{p.title}</h3>
                <p className="text-textSecondary text-sm leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
