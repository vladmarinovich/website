/**
 * Sección About — presentación personal.
 *
 * Layout de dos columnas:
 *  - Izquierda: texto + cita con borde lateral naranja
 *  - Derecha: retrato con tratamiento escultórico
 *
 * Tratamiento de la foto (no corporativo, no estudio):
 *  - Entrada en dos tiempos: saturate(0) brightness(0.65) → normal
 *    durante 1.1s. La imagen "respira" al material, no aparece plana.
 *  - Vignette radial interna — oscurece bordes, mantiene centro.
 *  - Overlay negro 22% sobre la imagen — presencia, no documento.
 *  - Acento de 1px asomando arriba-izquierda (no marco completo).
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useSectionOpacity } from '@/hooks/useSectionOpacity'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { FadeUp } from '@/components/ui/FadeUp'

export default function About() {
  const ref      = useRef<HTMLElement>(null)
  const opacity  = useSectionOpacity(ref)
  const reduced  = useReducedMotion()
  const c        = siteCopy.about

  // Entrada dos-tiempos: la imagen se "revela" al material.
  const photoInitial = reduced
    ? { opacity: 1, filter: 'none' }
    : { opacity: 0, filter: 'saturate(0) brightness(0.6) blur(4px)' }

  const photoAnimate = { opacity: 1, filter: 'saturate(1) brightness(1) blur(0px)' }

  return (
    <motion.section
      id="about"
      ref={ref}
      className="relative min-h-screen py-32 px-6 md:px-12"
      style={{ opacity }}
    >
      <div className="max-w-7xl mx-auto">

        <FadeUp kind="eyebrow">
          <p className="font-mono text-xs md:text-sm tracking-[0.28em] text-accent-orange mb-6 uppercase">
            {c.eyebrow}
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Columna de texto */}
          <div>
            <FadeUp kind="title" delay={0.08}>
              <h2 className="text-4xl md:text-5xl font-semibold text-textPrimary leading-[1.04] tracking-[-0.02em] mb-8 max-w-xl">
                {c.title}
              </h2>
            </FadeUp>
            <FadeUp kind="body" delay={0.20}>
              <p className="text-textSecondary text-lg md:text-xl leading-[1.65] mb-6 max-w-lg">
                {c.bodyPrimary}
              </p>
            </FadeUp>
            <FadeUp kind="body" delay={0.28}>
              <p className="text-textSecondary text-lg md:text-xl leading-[1.65] mb-10 max-w-lg">
                {c.bodySecondary}
              </p>
            </FadeUp>
            <FadeUp kind="body" delay={0.36}>
              <blockquote className="border-l-2 border-accent-orange pl-6 text-textPrimary italic text-lg md:text-xl leading-[1.55] max-w-lg">
                "{c.quote}"
              </blockquote>
            </FadeUp>
          </div>

          {/* Retrato — tratamiento escultórico */}
          <motion.div
            initial={photoInitial}
            whileInView={photoAnimate}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: reduced ? 0 : 1.1,
              ease: [0.2, 0.65, 0.25, 1],
              delay: reduced ? 0 : 0.15,
            }}
            className="relative"
          >
            {/* Acento 1px esquina superior-izquierda — no marco */}
            <span
              aria-hidden
              className="absolute -top-px left-0 w-12 h-px bg-accent-orange/60"
            />
            <span
              aria-hidden
              className="absolute -top-px left-0 h-12 w-px bg-accent-orange/60"
            />

            <div className="relative aspect-[3/4] overflow-hidden bg-surface">
              <img
                src="/assets/images/foto-vlad.jpg"
                alt="Vlad Marinovich"
                className="w-full h-full object-cover object-top select-none"
                draggable={false}
              />

              {/* Overlay base: presencia oscura sutil */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'rgba(5,7,11,0.22)' }}
              />

              {/* Vignette radial interna — oscurece bordes */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 70% at 50% 40%, transparent 35%, rgba(5,7,11,0.55) 100%)',
                }}
              />

              {/* Fade inferior para sellar contra el fondo */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(5,7,11,0.6), transparent)',
                }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  )
}
