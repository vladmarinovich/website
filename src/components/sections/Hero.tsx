/**
 * Sección Hero — primera pantalla del sitio.
 *
 * Estructura interna:
 *  - HeroBackground  → imagen responsive (picture) con push-in de scroll
 *  - NucleusPulse    → glow radial violeta animado sobre el centro del asset
 *  - HeroOverlay     → capas de oscurecimiento para legibilidad del copy
 *  - HeroContent     → copy con animaciones de entrada staggeradas
 *
 * Comportamiento de scroll:
 *  El fondo escala de 1.0 → PUSH_IN_SCALE mientras el hero está en viewport.
 *  La sensación es absorción subconsciente, no zoom evidente.
 *
 * NucleusPulse:
 *  Capa radial violeta de baja opacidad que respira suavemente (0.08 ↔ 0.18).
 *  No toca el asset, solo vive encima como un halo de energía contenida.
 *
 * Constantes ajustables:
 *  OVERLAY_DESKTOP      → velo negro base en desktop (0.28–0.36)
 *  OVERLAY_MOBILE_EXTRA → oscurecimiento adicional en mobile
 *  PUSH_IN_SCALE        → escala máxima del push-in (no superar 1.06)
 *  PULSE_MIN / PULSE_MAX → rango de respiración del núcleo
 *  PULSE_DURATION        → duración de un ciclo completo en segundos
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

/* ── Constantes ajustables ───────────────────────────────── */
const OVERLAY_DESKTOP      = 0.30   // desktop: núcleo más visible (era 0.36)
const OVERLAY_MOBILE_EXTRA = 0.12   // mobile: suma → 0.42
const PUSH_IN_SCALE        = 1.04   // push-in muy sutil: 1.0 → 1.04
const PULSE_MIN            = 0.08   // opacidad mínima del glow del núcleo
const PULSE_MAX            = 0.18   // opacidad máxima del glow del núcleo
const PULSE_DURATION       = 5      // segundos por ciclo de respiración

/* ── HeroBackground ──────────────────────────────────────── */
// Imagen responsive dentro de un motion.div que escala con scroll.
// object-cover garantiza que nunca haya bordes vacíos aunque scale > 1.
function HeroBackground({
  scale,
  y,
}: {
  scale: ReturnType<typeof useTransform>
  y: ReturnType<typeof useTransform>
}) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ scale, y, willChange: 'transform', transformOrigin: 'center center' }}
    >
      <picture>
        {/* Desktop ≥ 768px */}
        <source
          media="(min-width: 768px)"
          srcSet="/assets/generated/hero/hero-desktop.webp"
          type="image/webp"
        />
        {/* Mobile < 768px */}
        <img
          src="/assets/generated/hero/hero-mobile.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-full object-cover object-center select-none"
        />
      </picture>
    </motion.div>
  )
}

/* ── NucleusPulse ────────────────────────────────────────── */
// Halo radial violeta animado centrado en el núcleo del asset.
// No modifica el asset — es una capa CSS encima que "respira".
// blur alto + opacidad baja = presencia sin estridencia.
function NucleusPulse() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 52% 48% at 50% 50%, rgba(100,60,200,1) 0%, transparent 68%)',
        filter: 'blur(48px)',
      }}
      animate={{ opacity: [PULSE_MIN, PULSE_MAX, PULSE_MIN] }}
      transition={{
        duration: PULSE_DURATION,
        repeat: Infinity,
        ease: 'easeInOut',
        // sin delay: empieza cargado desde el principio
      }}
    />
  )
}

/* ── HeroOverlay ─────────────────────────────────────────── */
// Capas de oscurecimiento en orden:
//  1. Velo plano base — controla exposición del asset
//  2. Extra mobile — mayor opacidad en pantallas pequeñas
//  3. Gradiente inferior — funde con el fondo de la siguiente sección
//  4. Gradiente superior — sella el borde con el nav transparente
function HeroOverlay() {
  return (
    <>
      {/* Velo base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `rgba(5,7,11,${OVERLAY_DESKTOP})` }}
      />

      {/* Extra mobile */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: `rgba(5,7,11,${OVERLAY_MOBILE_EXTRA})` }}
      />

      {/* Fade inferior — disolución hacia la siguiente sección */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #05070B 10%, rgba(5,7,11,0.5) 44%, transparent 100%)',
        }}
      />

      {/* Fade superior — sella el nav */}
      <div
        className="absolute inset-x-0 top-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #05070B 0%, transparent 100%)' }}
      />
    </>
  )
}

/* ── HeroContent ─────────────────────────────────────────── */
// Copy anclado en la parte inferior — no se mueve con el fondo.
// FadeUp staggerado: eyebrow → headline → subtitle → CTAs.
function HeroContent() {
  const c = siteCopy.hero

  return (
    <div className="relative z-10 max-w-7xl mx-auto w-full">

      <FadeUp delay={0.05}>
        <p className="font-mono text-xs tracking-[0.25em] text-accent-cyan mb-6 uppercase">
          {c.eyebrow}
        </p>
      </FadeUp>

      <FadeUp delay={0.15}>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-textPrimary leading-none tracking-tight max-w-4xl mb-6">
          {c.title}
        </h1>
      </FadeUp>

      <FadeUp delay={0.25}>
        <p className="text-textSecondary text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          {c.subtitle}
        </p>
      </FadeUp>

      <FadeUp delay={0.35}>
        <div className="flex flex-wrap gap-4">
          <a
            href="#contact"
            className="px-6 py-3 bg-accent-cyan text-background font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            {c.ctaPrimary}
          </a>
          <a
            href="#evidence"
            className="px-6 py-3 border border-white/10 text-textSecondary font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:border-white/25 hover:text-textPrimary transition-all"
          >
            {c.ctaSecondary}
          </a>
        </div>
      </FadeUp>

    </div>
  )
}

/* ── Hero ────────────────────────────────────────────────── */
// Orquesta las cuatro capas en orden visual:
//  HeroBackground (push-in) → NucleusPulse → HeroOverlay → HeroContent
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Push-in extremadamente contenido: 1.0 → 1.04
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, PUSH_IN_SCALE])

  // Deriva vertical mínima — profundidad sin movimiento obvio
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-2%'])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-end pb-24 px-6 md:px-12 overflow-hidden"
    >
      {/* Orden de capas: fondo → pulso → velo → copy */}
      <HeroBackground scale={bgScale} y={bgY} />
      <NucleusPulse />
      <HeroOverlay />
      <HeroContent />
    </section>
  )
}
