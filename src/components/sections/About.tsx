/**
 * Sección About — presentación personal.
 *
 * Layout de dos columnas:
 *  - Izquierda: texto, cita con borde lateral naranja
 *  - Derecha: retrato (foto real desde public/assets/images/)
 *
 * Legibilidad: body text a text-xl, blockquote a text-xl.
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useSectionOpacity } from '@/hooks/useSectionOpacity'
import { FadeUp } from '@/components/ui/FadeUp'

export default function About() {
  const ref     = useRef<HTMLElement>(null)
  const opacity  = useSectionOpacity(ref)
  const c = siteCopy.about

  return (
    <motion.section id="about" ref={ref} className="relative min-h-screen py-32 px-6 md:px-12" style={{ opacity }}>
      <div className="max-w-7xl mx-auto">

        <FadeUp>
          <p className="font-mono text-sm tracking-[0.22em] text-accent-orange mb-6 uppercase">
            {c.eyebrow}
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Columna de texto */}
          <FadeUp delay={0.08}>
            <h2 className="text-4xl md:text-5xl font-bold text-textPrimary leading-tight tracking-tight mb-8">
              {c.title}
            </h2>
            <p className="text-textSecondary text-xl leading-relaxed mb-6">{c.bodyPrimary}</p>
            <p className="text-textSecondary text-xl leading-relaxed mb-10">{c.bodySecondary}</p>

            <blockquote className="border-l-2 border-accent-orange pl-6 text-textPrimary italic text-xl leading-relaxed">
              "{c.quote}"
            </blockquote>
          </FadeUp>

          {/* Retrato */}
          <FadeUp delay={0.22}>
            <div className="aspect-[3/4] bg-surface rounded-sm border border-white/[0.06] overflow-hidden">
              <img
                src="/assets/images/foto-vlad.jpg"
                alt="Vlad Marinovich"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </FadeUp>

        </div>
      </div>
    </motion.section>
  )
}
