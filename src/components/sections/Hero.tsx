/**
 * Sección Hero — solo el copy.
 *
 * Las capas visuales (imagen, portal, filamentos, overlays) viven en
 * HeroLayers (fixed, z-1, nivel raíz) y se disuelven independientemente.
 *
 * Esta sección solo contiene el copy DOM anclado en la parte inferior.
 * El copy desaparece (fade up) durante el primer 22% del viewport height
 * de scroll — antes de que el fondo empiece su disolución (0.55vh).
 *
 * La sección ocupa 100vh para dar el espacio visual del hero.
 * Al terminar, la siguiente sección (Evidence) entra al viewport
 * exactamente cuando HeroLayers llega a opacity 0 → cross-dissolve.
 */

import { motion, useScroll, useTransform } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

const VH = typeof window !== 'undefined' ? window.innerHeight : 900

export default function Hero() {
  const { scrollY } = useScroll()

  // Copy desaparece en el primer 22% del viewport de scroll
  const copyOpacity = useTransform(scrollY, [0, VH * 0.22], [1, 0])
  const copyY       = useTransform(scrollY, [0, VH * 0.22], [0, -24])

  return (
    <section
      id="hero"
      className="relative h-screen flex items-end pb-24 px-6 md:px-12"
    >
      <motion.div
        className="relative z-10 max-w-7xl mx-auto w-full"
        style={{ opacity: copyOpacity, y: copyY, willChange: 'opacity, transform' }}
      >
        <FadeUp delay={0.05}>
          <p className="font-mono text-sm tracking-[0.22em] text-accent-cyan mb-6 uppercase">
            {siteCopy.hero.eyebrow}
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-textPrimary leading-none tracking-tight max-w-4xl mb-6">
            {siteCopy.hero.title}
          </h1>
        </FadeUp>

        <FadeUp delay={0.25}>
          <p className="text-textSecondary text-xl md:text-2xl max-w-2xl leading-relaxed mb-10">
            {siteCopy.hero.subtitle}
          </p>
        </FadeUp>

        <FadeUp delay={0.35}>
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="px-7 py-3.5 bg-accent-cyan text-background font-mono text-sm tracking-[0.12em] uppercase rounded-sm hover:opacity-90 transition-opacity"
            >
              {siteCopy.hero.ctaPrimary}
            </a>
            <a
              href="#evidence"
              className="px-7 py-3.5 border border-white/15 text-textSecondary font-mono text-sm tracking-[0.12em] uppercase rounded-sm hover:border-white/30 hover:text-textPrimary transition-all"
            >
              {siteCopy.hero.ctaSecondary}
            </a>
          </div>
        </FadeUp>
      </motion.div>
    </section>
  )
}
