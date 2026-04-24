/**
 * Sección Hero — solo el copy.
 *
 * Estructura tipográfica:
 *   eyebrow (tesis)  → "INFRAESTRUCTURA QUE PIENSA."
 *   H1 (desarrollo)  → subtitle con la tensión del problema
 *   supporting       → línea callada que da el horizonte ("120 días…")
 *   CTAs             → acción primaria + secundaria
 *
 * Las capas visuales viven en HeroLayers (fixed, z-1).
 * El copy desaparece (fade up) durante el primer 22% del viewport
 * de scroll — antes de que el fondo empiece su disolución.
 */

import { motion, useScroll, useTransform } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'
import { SplitText } from '@/components/ui/SplitText'
import { MagneticButton } from '@/components/ui/MagneticButton'

const VH = typeof window !== 'undefined' ? window.innerHeight : 900

export default function Hero() {
  const { scrollY } = useScroll()

  // Copy desaparece en el primer 22% del viewport de scroll
  const copyOpacity = useTransform(scrollY, [0, VH * 0.22], [1, 0])
  const copyY       = useTransform(scrollY, [0, VH * 0.22], [0, -24])

  return (
    <section
      id="hero"
      className="relative h-screen flex items-end pb-28 px-6 md:px-12"
    >
      <motion.div
        className="relative z-10 max-w-7xl mx-auto w-full"
        style={{ opacity: copyOpacity, y: copyY, willChange: 'opacity, transform' }}
      >
        <FadeUp kind="eyebrow" delay={0.05}>
          <p className="font-mono text-xs md:text-sm tracking-[0.28em] text-accent-cyan mb-8 uppercase">
            {siteCopy.hero.eyebrow}
          </p>
        </FadeUp>

        {/* El subtitle opera como H1 visual — la tesis vive aquí */}
        <SplitText
          as="h1"
          delay={0.18}
          stagger={0.04}
          duration={0.75}
          className="text-textPrimary font-semibold leading-[1.04] tracking-[-0.02em] max-w-5xl mb-8 text-4xl md:text-6xl lg:text-7xl"
        >
          {siteCopy.hero.subtitle}
        </SplitText>

        <FadeUp kind="body" delay={0.42}>
          <p className="text-textSecondary/90 text-lg md:text-xl max-w-2xl leading-[1.55] mb-12">
            {siteCopy.hero.supporting}
          </p>
        </FadeUp>

        <FadeUp kind="body" delay={0.55}>
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              as="a"
              href="#contact"
              threshold={80}
              strength={0.32}
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-accent-cyan text-background font-mono text-sm tracking-[0.14em] uppercase rounded-sm hover:opacity-90 transition-opacity"
            >
              <span>{siteCopy.hero.ctaPrimary}</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
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
    </section>
  )
}
