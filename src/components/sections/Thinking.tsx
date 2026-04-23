/**
 * Sección Thinking — principios de trabajo.
 *
 * Lista los cuatro principios operativos con numeración monoespaciada.
 * Separadores de 1px entre cada ítem, sin exceso visual.
 *
 * Legibilidad: body text a text-xl, principios a text-base,
 * títulos de principio con más peso visual.
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useSectionOpacity } from '@/hooks/useSectionOpacity'
import { FadeUp } from '@/components/ui/FadeUp'

export default function Thinking() {
  const ref     = useRef<HTMLElement>(null)
  const opacity  = useSectionOpacity(ref)
  const c = siteCopy.thinking

  return (
    <motion.section id="thinking" ref={ref} className="relative min-h-screen py-32 px-6 md:px-12" style={{ opacity }}>
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
          <p className="text-textSecondary text-lg md:text-xl max-w-xl leading-[1.6] mb-16">
            {c.body}
          </p>
        </FadeUp>

        {/* Lista de principios — separados por bordes inferiores de 1px */}
        <div className="space-y-px">
          {c.principles.map((p, i) => (
            <FadeUp key={i} kind="list" delay={i * 0.06}>
              <div className="flex gap-8 py-8 border-b border-white/[0.06]">
                {/* Número — decorativo, tenue */}
                <span className="font-mono text-xs text-textSecondary/40 w-8 shrink-0 pt-1">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-textPrimary font-semibold text-lg mb-3 tracking-[-0.01em]">{p.title}</h3>
                  <p className="text-textSecondary text-base md:text-lg leading-[1.65]">{p.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

      </div>
    </motion.section>
  )
}
