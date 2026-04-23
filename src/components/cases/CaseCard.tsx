/**
 * CaseCard — tarjeta de entrada a un caso de estudio.
 *
 * Muestra eyebrow, título, categoría, resumen y thumbnail.
 * Al hacer click abre el overlay editorial via caseStore.
 *
 * Hover: leve elevación + scale del thumbnail.
 */

import { motion } from 'framer-motion'
import type { CaseStudy } from '@/types/case'

interface CaseCardProps {
  caseStudy: CaseStudy
  onClick: () => void
  index: number
}

export function CaseCard({ caseStudy: c, onClick, index }: CaseCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative text-left w-full border border-white/[0.07] bg-surface/60 rounded-sm overflow-hidden hover:border-white/[0.16] transition-colors duration-400 cursor-pointer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: [0.25, 0.4, 0.25, 1], delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-[16/9] bg-surfaceSoft">
        <img
          src={c.assets[0].src}
          alt={c.assets[0].alt}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          draggable={false}
          loading="lazy"
        />
        {/* Gradiente inferior que sella con el contenido */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="px-8 py-7">
        <p className="font-mono text-xs tracking-[0.22em] text-accent-cyan mb-3 uppercase">
          {c.eyebrow}
        </p>

        <h3 className="text-2xl font-bold text-textPrimary leading-tight mb-2">
          {c.title}
        </h3>

        <p className="font-mono text-xs text-textSecondary/50 tracking-wide mb-5">
          {c.category}
        </p>

        <p className="text-textSecondary text-sm leading-relaxed mb-8">
          {c.summary}
        </p>

        {/* Tags de stack (primeros 3) */}
        {c.stack && c.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {c.stack.slice(0, 3).map((tool) => (
              <span
                key={tool}
                className="font-mono text-[10px] text-textSecondary/40 border border-white/[0.06] px-2 py-0.5 rounded-sm tracking-wide"
              >
                {tool}
              </span>
            ))}
            {c.stack.length > 3 && (
              <span className="font-mono text-[10px] text-textSecondary/30 px-1 py-0.5 tracking-wide">
                +{c.stack.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA inline */}
        <div className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-accent-cyan uppercase group-hover:gap-3 transition-all duration-300">
          <span>Ver caso</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </motion.button>
  )
}
