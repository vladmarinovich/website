/**
 * Sección Evidence — casos de estudio reales.
 *
 * Grid de 3 CaseCards que abren el overlay editorial al hacer click.
 * El CaseOverlay vive en App.tsx (fuera de esta sección) para que
 * el fixed positioning opere desde el contexto raíz.
 *
 * Fade in/out: la sección aparece y desaparece sobre el tunnel 3D.
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { cases } from '@/content/cases'
import { useCaseStore } from '@/store/caseStore'
import { FadeUp } from '@/components/ui/FadeUp'
import { CaseCard } from '@/components/cases/CaseCard'
import { useSectionOpacity } from '@/hooks/useSectionOpacity'

export default function Evidence() {
  const c        = siteCopy.evidence
  const openCase = useCaseStore((s) => s.openCase)
  const ref      = useRef<HTMLElement>(null)
  const opacity  = useSectionOpacity(ref)

  return (
    <motion.section
      id="evidence"
      ref={ref}
      className="relative min-h-screen py-32 px-6 md:px-12"
      style={{ opacity }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Encabezado */}
        <FadeUp>
          <p className="font-mono text-sm tracking-[0.22em] text-accent-cyan mb-6 uppercase">
            {c.eyebrow}
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-textPrimary leading-none tracking-tight mb-6">
            {c.title}
          </h2>
          <p className="text-textSecondary text-xl max-w-2xl leading-relaxed">
            {c.body}
          </p>
        </FadeUp>

        {/* Grid de casos */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseStudy, i) => (
            <CaseCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={i}
              onClick={() => openCase(caseStudy.id)}
            />
          ))}
        </div>

      </div>
    </motion.section>
  )
}
