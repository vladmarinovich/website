/**
 * Sección Standards — con quién trabajo y con quién no.
 *
 * Dos columnas: lista afirmativa (cyan) y lista negativa (blanco tenue).
 * Los indicadores son puntos de 4px para máxima limpieza visual.
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useSectionOpacity } from '@/hooks/useSectionOpacity'
import { FadeUp } from '@/components/ui/FadeUp'

export default function Standards() {
  const ref     = useRef<HTMLElement>(null)
  const opacity  = useSectionOpacity(ref)
  const c = siteCopy.standards

  return (
    <motion.section id="standards" ref={ref} className="relative min-h-screen py-32 px-6 md:px-12" style={{ opacity }}>
      <div className="max-w-7xl mx-auto">

        <FadeUp kind="eyebrow">
          <p className="font-mono text-xs md:text-sm tracking-[0.28em] text-textSecondary mb-6 uppercase">
            {c.eyebrow}
          </p>
        </FadeUp>
        <FadeUp kind="title" delay={0.08}>
          <h2 className="text-4xl md:text-6xl font-semibold text-textPrimary leading-[1.02] tracking-[-0.02em] mb-6 max-w-4xl">
            {c.title}
          </h2>
        </FadeUp>
        <FadeUp kind="body" delay={0.22}>
          <p className="text-textSecondary text-lg md:text-xl max-w-2xl leading-[1.6] mb-16">
            {c.body}
          </p>
        </FadeUp>

        {/* Dos columnas: afirmativa / negativa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Con quién SÍ */}
          <FadeUp delay={0.08}>
            <p className="font-mono text-sm tracking-[0.18em] text-textSecondary/70 mb-6 uppercase">
              {c.yesTitle}
            </p>
            <ul className="space-y-5">
              {c.yesItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-textSecondary">
                  <span className="mt-2.5 w-1 h-1 rounded-full bg-accent-cyan shrink-0" />
                  <span className="text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </FadeUp>

          {/* Con quién NO */}
          <FadeUp delay={0.16}>
            <p className="font-mono text-sm tracking-[0.18em] text-textSecondary/70 mb-6 uppercase">
              {c.noTitle}
            </p>
            <ul className="space-y-5">
              {c.noItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-textSecondary/80">
                  <span className="mt-2.5 w-1 h-1 rounded-full bg-white/30 shrink-0" />
                  <span className="text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </FadeUp>

        </div>
      </div>
    </motion.section>
  )
}
