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
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

export default function Standards() {
  const ref     = useRef<HTMLElement>(null)
  const opacity  = useSectionOpacity(ref)
  const c = siteCopy.standards

  return (
    <motion.section id="standards" ref={ref} className="relative min-h-screen py-36 md:py-48 px-6 md:px-12" style={{ opacity }}>
      <div className="max-w-7xl mx-auto">

        <FadeUp kind="eyebrow">
          <SectionEyebrow num="(05)" label={c.eyebrow} colorClass="text-textSecondary" />
        </FadeUp>
        <FadeUp kind="title" delay={0.08}>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold text-textPrimary leading-[1.02] tracking-[-0.02em] mb-6 max-w-4xl">
            {c.title}
          </h2>
        </FadeUp>
        <FadeUp kind="body" delay={0.22}>
          <p className="text-textSecondary text-lg md:text-xl max-w-2xl leading-[1.6] mb-20">
            {c.body}
          </p>
        </FadeUp>

        {/* Dos columnas con separador editorial central */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 relative">

          {/* Línea vertical separadora — solo desktop */}
          <div
            className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-white/[0.07]"
            aria-hidden="true"
          />

          {/* Con quién SÍ */}
          <FadeUp delay={0.08} className="md:pr-16">
            <p className="font-mono text-[11px] tracking-[0.32em] text-accent-cyan/80 uppercase mb-3">
              <span className="text-accent-cyan/50">(a.)</span>
              <span className="ml-2">Filtro afirmativo</span>
            </p>
            <h3 className="text-textPrimary text-2xl md:text-3xl font-semibold tracking-[-0.015em] mb-8">
              {c.yesTitle}
            </h3>
            <ul className="space-y-5">
              {c.yesItems.map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-textSecondary">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0" />
                  <span className="text-lg md:text-xl leading-[1.55]">{item}</span>
                </li>
              ))}
            </ul>
          </FadeUp>

          {/* Con quién NO */}
          <FadeUp delay={0.16} className="md:pl-16">
            <p className="font-mono text-[11px] tracking-[0.32em] text-textSecondary/55 uppercase mb-3">
              <span className="text-textSecondary/30">(b.)</span>
              <span className="ml-2">Filtro de descarte</span>
            </p>
            <h3 className="text-textPrimary/80 text-2xl md:text-3xl font-semibold tracking-[-0.015em] mb-8">
              {c.noTitle}
            </h3>
            <ul className="space-y-5">
              {c.noItems.map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-textSecondary/75">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/25 shrink-0" />
                  <span className="text-lg md:text-xl leading-[1.55]">{item}</span>
                </li>
              ))}
            </ul>
          </FadeUp>

        </div>
      </div>
    </motion.section>
  )
}
