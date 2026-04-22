/**
 * Sección Standards — con quién trabajo y con quién no.
 *
 * Dos columnas: lista afirmativa (cyan) y lista negativa (blanco tenue).
 * Los indicadores son puntos de 4px para máxima limpieza visual.
 *
 * Sin íconos de check/cross — la jerarquía de color lo hace sola.
 */

import { siteCopy } from '@/content/siteCopy'

export default function Standards() {
  const c = siteCopy.standards

  return (
    <section id="standards" className="relative py-32 px-6 md:px-12">
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

        {/* Dos columnas: afirmativa / negativa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Con quién SÍ — punto cyan */}
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-textSecondary/50 mb-6 uppercase">
              {c.yesTitle}
            </p>
            <ul className="space-y-3">
              {c.yesItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-textSecondary">
                  <span className="mt-2 w-1 h-1 rounded-full bg-accent-cyan shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Con quién NO — punto blanco tenue, texto más apagado */}
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-textSecondary/50 mb-6 uppercase">
              {c.noTitle}
            </p>
            <ul className="space-y-3">
              {c.noItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-textSecondary/50">
                  <span className="mt-2 w-1 h-1 rounded-full bg-white/20 shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
