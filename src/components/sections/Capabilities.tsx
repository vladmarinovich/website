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

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useSectionOpacity } from '@/hooks/useSectionOpacity'
import { FadeUp } from '@/components/ui/FadeUp'

export default function Capabilities() {
  const ref     = useRef<HTMLElement>(null)
  const opacity  = useSectionOpacity(ref)
  const c = siteCopy.capabilities

  return (
    <motion.section id="capabilities" ref={ref} className="relative min-h-screen py-32 px-6 md:px-12" style={{ opacity }}>
      <div className="max-w-7xl mx-auto">

        <FadeUp kind="eyebrow">
          <p className="font-mono text-xs md:text-sm tracking-[0.28em] text-accent-purple mb-6 uppercase">
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

        {/* Grilla 2×2 — separadores de 1px */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
          {c.items.map((item, i) => (
            <FadeUp key={i} kind="list" delay={i * 0.06} className="bg-background">
              <div className="p-8">
                <h3 className="text-textPrimary font-semibold text-lg mb-3 tracking-[-0.01em]">{item.title}</h3>
                <p className="text-textSecondary text-base leading-[1.65]">{item.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>

      </div>
    </motion.section>
  )
}
