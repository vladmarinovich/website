/**
 * Sección Capabilities — territorios de intervención.
 *
 * Reemplaza la grilla 2×2 ("lista de servicios") por una secuencia
 * editorial vertical estilo archivo museístico: cada capacidad
 * vive en su propio "campo" con eyebrow lettered (a./b./c./d.),
 * título grande, body de párrafo largo con whitespace generoso.
 *
 * Brief: Vladislav como partner sistémico, no ejecutor táctico.
 *        Editorial. Menos efectista. Más dominio.
 *
 * Color de acento: purple (sceneStore.colorMode = "purple").
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useSectionOpacity } from '@/hooks/useSectionOpacity'
import { FadeUp } from '@/components/ui/FadeUp'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

const LETTERS = ['a', 'b', 'c', 'd']

export default function Capabilities() {
  const ref      = useRef<HTMLElement>(null)
  const opacity  = useSectionOpacity(ref)
  const c = siteCopy.capabilities

  return (
    <motion.section
      id="capabilities"
      ref={ref}
      className="relative min-h-screen py-32 md:py-40 px-6 md:px-12"
      style={{ opacity }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Cabezal de sección */}
        <div className="max-w-3xl mb-20 md:mb-28">
          <FadeUp kind="eyebrow">
            <SectionEyebrow num="(02)" label={c.eyebrow} colorClass="text-accent-purple" />
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
        </div>

        {/* Territorios — secuencia editorial vertical */}
        <div>
          {c.items.map((item, i) => (
            <FadeUp key={item.title} kind="list" delay={i * 0.06}>
              <article
                className="
                  group
                  grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12
                  border-t border-white/[0.07]
                  py-14 md:py-20
                  transition-colors duration-500
                  hover:border-accent-purple/30
                "
              >
                {/* Columna izquierda: lettered taxonomy */}
                <div className="md:col-span-3">
                  <p className="font-mono text-[11px] tracking-[0.32em] text-textSecondary/40 uppercase">
                    <span className="text-accent-purple/70 group-hover:text-accent-purple transition-colors duration-500">
                      ({LETTERS[i]}.)
                    </span>
                    <span className="ml-2">Territorio {String(i + 1).padStart(2, '0')}</span>
                  </p>
                </div>

                {/* Columna derecha: contenido editorial */}
                <div className="md:col-span-9 max-w-2xl">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-textPrimary leading-[1.15] tracking-[-0.015em] mb-5">
                    {item.title}
                  </h3>
                  <p className="text-textSecondary text-lg md:text-xl leading-[1.65]">
                    {item.body}
                  </p>
                </div>
              </article>
            </FadeUp>
          ))}

          {/* Línea de cierre del bloque */}
          <div className="border-t border-white/[0.07]" />
        </div>

      </div>
    </motion.section>
  )
}
