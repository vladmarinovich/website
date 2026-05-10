/**
 * Sección Thinking — principios operativos como ensayo editorial.
 *
 * Reemplaza la lista vertical numerada (01/02/03/04 + line) por
 * un ensayo de columna única, max-w-3xl, con espaciado generoso
 * entre principios. Cada principio: eyebrow lettered, título
 * mediano (no efectista), cuerpo de párrafo largo respirando.
 *
 * Brief: editorial. Menos efectista. Más dominio.
 *
 * Sin acento de color en eyebrow (color-mode neutral en este punto
 * del scroll — Thinking es la pausa entre Capabilities y About).
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useSectionOpacity } from '@/hooks/useSectionOpacity'
import { FadeUp } from '@/components/ui/FadeUp'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

const LETTERS = ['a', 'b', 'c', 'd']

export default function Thinking() {
  const ref     = useRef<HTMLElement>(null)
  const opacity = useSectionOpacity(ref)
  const c = siteCopy.thinking

  return (
    <motion.section
      id="thinking"
      ref={ref}
      className="relative min-h-screen py-36 md:py-48 px-6 md:px-12"
      style={{ opacity }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Cabezal — alineado a la izquierda, anchura editorial */}
        <header className="max-w-3xl mb-24 md:mb-32">
          <FadeUp kind="eyebrow">
            <SectionEyebrow num="(03)" label={c.eyebrow} colorClass="text-textSecondary" />
          </FadeUp>
          <FadeUp kind="title" delay={0.08}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-textPrimary leading-[1.04] tracking-[-0.02em] mb-8">
              {c.title}
            </h2>
          </FadeUp>
          <FadeUp kind="body" delay={0.22}>
            <p className="text-textSecondary text-lg md:text-xl leading-[1.6]">
              {c.body}
            </p>
          </FadeUp>
        </header>

        {/* Cuerpo del ensayo — columna única, principios respirando */}
        <div className="max-w-3xl space-y-24 md:space-y-32">
          {c.principles.map((p, i) => (
            <FadeUp key={p.title} kind="body" delay={0.05 + i * 0.04}>
              <article>
                {/* Marcador lettered — sutil, museum catalog */}
                <p className="font-mono text-[11px] tracking-[0.32em] text-textSecondary/40 uppercase mb-5">
                  <span className="text-textPrimary/55">({LETTERS[i]}.)</span>
                  <span className="ml-2">Principio operativo</span>
                </p>

                {/* Título del principio — refinado, no efectista */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-textPrimary leading-[1.2] tracking-[-0.015em] mb-6 max-w-[24ch]">
                  {p.title}
                </h3>

                {/* Cuerpo del principio — párrafo de revista */}
                <p className="text-textSecondary text-lg md:text-xl leading-[1.75] max-w-[65ch]">
                  {p.body}
                </p>
              </article>
            </FadeUp>
          ))}
        </div>

        {/* Cierre tipográfico — frase de selección al final */}
        <FadeUp kind="body" delay={0.4}>
          <div className="mt-32 md:mt-40 max-w-3xl border-t border-white/[0.07] pt-10">
            <p className="font-mono text-[11px] tracking-[0.32em] text-textSecondary/40 uppercase">
              Fin de la sección · Criterio sobre ejecución
            </p>
          </div>
        </FadeUp>

      </div>
    </motion.section>
  )
}
