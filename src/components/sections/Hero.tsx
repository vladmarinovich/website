/**
 * Sección Hero — solo el copy.
 *
 * Estructura tipográfica:
 *   eyebrow (tesis)  → "(00) INFRAESTRUCTURA QUE PIENSA."
 *   H1 (desarrollo)  → split en 2 líneas para control editorial
 *   supporting       → línea callada que da el horizonte ("120 días…")
 *   CTAs             → acción primaria + secundaria
 *   scroll indicator → "ENTRAR AL SISTEMA" en vertical, bottom-right
 *
 * Las capas visuales viven en HeroLayers (fixed, z-1).
 * El copy desaparece (fade up) durante el primer 22% del viewport
 * de scroll — antes de que el fondo empiece su disolución.
 */

import { motion, useScroll, useTransform } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { useUIStore } from '@/store/uiStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const VH = typeof window !== 'undefined' ? window.innerHeight : 900
const EASE: [number, number, number, number] = [0.2, 0.65, 0.25, 1]

export default function Hero() {
  const { scrollY } = useScroll()
  const openCalcom  = useUIStore((s) => s.setCalcomOpen)
  const reduced     = useReducedMotion()

  // Copy desaparece en el primer 22% del viewport de scroll
  const copyOpacity = useTransform(scrollY, [0, VH * 0.22], [1, 0])
  const copyY       = useTransform(scrollY, [0, VH * 0.22], [0, -24])

  // Scroll indicator desaparece antes que el copy
  const hintOpacity = useTransform(scrollY, [0, VH * 0.12], [1, 0])

  return (
    <section
      id="hero"
      className="relative h-screen flex items-end pb-28 md:pb-36 px-6 md:px-12"
    >
      {/* Gradiente de legibilidad — detrás del copy block */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: 'linear-gradient(to top, rgba(5,7,11,0.85) 0%, rgba(5,7,11,0.4) 45%, transparent 100%)' }}
      />

      {/* Copy principal — fondo inferior izquierdo */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto w-full"
        style={{ opacity: copyOpacity, y: copyY, willChange: 'opacity, transform' }}
      >
        {/* Eyebrow lettered */}
        <FadeUp kind="eyebrow" delay={0.05}>
          <p className="font-mono text-xs md:text-sm tracking-[0.32em] uppercase mb-8 flex items-center gap-3">
            <span className="text-accent-cyan opacity-50">(00)</span>
            <span className="text-accent-cyan opacity-100">{siteCopy.hero.eyebrow}</span>
          </p>
        </FadeUp>

        {/* H1 — break editorial en el punto semántico correcto.
            "El problema no es lo que falta." → primera línea.
            "Es lo que no está conectado."    → segunda línea (golpe). */}
        <FadeUp kind="title" delay={0.18}>
          <h1 className="text-textPrimary font-semibold leading-[0.96] tracking-[-0.035em] max-w-5xl mb-8 text-5xl md:text-[5.5rem] lg:text-[8rem]">
            El problema no es lo que falta.
            <br />
            Es lo que no está conectado.
          </h1>
        </FadeUp>

        {/* Supporting — horizonte de tiempo */}
        <FadeUp kind="body" delay={0.42}>
          <p className="text-textSecondary/90 text-xl md:text-2xl max-w-2xl leading-[1.55] mb-12">
            {siteCopy.hero.supporting}
          </p>
        </FadeUp>

        {/* CTAs */}
        <FadeUp kind="body" delay={0.55}>
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              href="#"
              onClick={(e) => { e?.preventDefault?.(); openCalcom(true) }}
              threshold={80}
              strength={0.22}
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-accent-cyan text-background font-mono text-sm tracking-[0.14em] uppercase rounded-sm hover:opacity-90 transition-opacity"
            >
              <span>{siteCopy.hero.ctaPrimary}</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                ↗
              </span>
            </MagneticButton>
            <a
              href="#evidence"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-textSecondary hover:text-textPrimary font-mono text-sm tracking-[0.14em] uppercase transition-colors underline-offset-[6px] hover:underline"
            >
              {siteCopy.hero.ctaSecondary}
            </a>
          </div>
        </FadeUp>
      </motion.div>

      {/* Scroll indicator — bottom right, vertical text + dot pulsante */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="absolute bottom-10 right-6 md:right-12 z-10 flex flex-col items-center gap-3"
          style={{ opacity: hintOpacity }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.2 }}
        >
          {/* Texto vertical */}
          <span
            className="font-mono text-[9px] tracking-[0.32em] text-textSecondary/45 uppercase"
            style={{ writingMode: 'vertical-rl', letterSpacing: '0.32em' }}
          >
            {siteCopy.hero.scrollHint}
          </span>

          {/* Dot pulsante */}
          <motion.span
            className="block w-1 h-1 rounded-full bg-accent-cyan"
            animate={{ opacity: [0.4, 1, 0.4], scaleY: [1, 2.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </section>
  )
}
