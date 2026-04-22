/**
 * Sección About — presentación personal.
 *
 * Layout de dos columnas:
 *  - Izquierda: texto, cita con borde lateral naranja
 *  - Derecha: retrato (foto real cargada desde public/assets/images/)
 *
 * El blockquote usa border-accent-orange para reflejar
 * el color de acento asignado a esta sección.
 *
 * Animaciones: columna de texto entra desde la izquierda (FadeUp),
 * el retrato aparece con un delay de 0.15s para dar ritmo visual.
 */

import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

export default function About() {
  const c = siteCopy.about

  return (
    <section id="about" className="relative py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        <FadeUp>
          <p className="font-mono text-xs tracking-[0.25em] text-accent-orange mb-6 uppercase">
            {c.eyebrow}
          </p>
        </FadeUp>

        {/* Grilla 2 columnas: texto + retrato */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Columna de texto */}
          <FadeUp delay={0.08}>
            <h2 className="text-4xl md:text-5xl font-bold text-textPrimary leading-tight tracking-tight mb-8">
              {c.title}
            </h2>
            <p className="text-textSecondary text-lg leading-relaxed mb-6">{c.bodyPrimary}</p>
            <p className="text-textSecondary text-lg leading-relaxed mb-10">{c.bodySecondary}</p>

            {/* Cita destacada — borde lateral de acento naranja */}
            <blockquote className="border-l-2 border-accent-orange pl-6 text-textPrimary italic text-lg">
              "{c.quote}"
            </blockquote>
          </FadeUp>

          {/* Retrato — aparece con delay para dar sensación de despliegue */}
          <FadeUp delay={0.22}>
            <div className="aspect-[3/4] bg-surface rounded-sm border border-white/[0.06] overflow-hidden">
              <img
                src="/assets/images/profile.jpg"
                alt="Vlad Marinovich"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </FadeUp>

        </div>
      </div>
    </section>
  )
}
