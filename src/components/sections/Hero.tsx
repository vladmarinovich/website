/**
 * Sección Hero — portal de entrada al sistema.
 *
 * Mecánica de scroll:
 *  El hero vive en un contenedor de 250vh con la sección interna
 *  en position:sticky. Mientras el usuario scrollea, la imagen
 *  hace zoom no-lineal hacia el núcleo violeta. A ~0.72 de progreso,
 *  el hero se desvanece y el tunnel 3D (Canvas en z-0) queda expuesto.
 *  La sensación es entrar al sistema, no hacer zoom a una imagen.
 *
 * Capas en orden (fondo → contenido):
 *  1. HeroBackground  → imagen responsive con zoom scroll-driven
 *  2. NucleusPulse    → halo radial violeta que respira
 *  3. HeroOverlay     → velos de oscurecimiento y fades de borde
 *  4. HeroContent     → copy — desaparece antes que el fondo
 *
 * Constantes de calibración:
 *  OVERLAY_DESKTOP      → oscurecimiento base en desktop
 *  OVERLAY_MOBILE_EXTRA → extra en mobile
 *  SCALE_KEYFRAMES      → zoom no-lineal [progress → scale]
 *  HERO_FADE_IN / OUT   → rango de fade del fondo (reveal del tunnel)
 *  COPY_FADE_IN / OUT   → rango de fade del copy
 *  PULSE_MIN / MAX      → respiración del núcleo
 */

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

/* ── Constantes de calibración ───────────────────────────── */

// Overlay de color
const OVERLAY_DESKTOP      = 0.30
const OVERLAY_MOBILE_EXTRA = 0.12

// Zoom no-lineal: lento al inicio, acelera hacia el portal
// [progress: 0 → 0.25 → 0.55 → 0.75] → [scale: 1 → 1.08 → 1.55 → 2.20]
const SCALE_PROGRESS = [0,    0.25,  0.55,  0.75]
const SCALE_VALUES   = [1,    1.08,  1.55,  2.20]

// Fondo: fade out → revela el tunnel 3D
const HERO_FADE_START = 0.52
const HERO_FADE_END   = 0.74

// Copy: desaparece antes (el usuario ya está "entrando")
const COPY_FADE_START = 0.08
const COPY_FADE_END   = 0.26

// Núcleo: respiración
const PULSE_MIN      = 0.08
const PULSE_MAX      = 0.20
const PULSE_DURATION = 5      // segundos por ciclo

/* ── HeroBackground ──────────────────────────────────────── */
function HeroBackground({ scale }: { scale: MotionValue<number> }) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ scale, willChange: 'transform', transformOrigin: 'center center' }}
    >
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet="/assets/generated/hero/hero-desktop.webp"
          type="image/webp"
        />
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
// Halo radial violeta que respira independientemente del scroll.
// Se desvanece junto con el fondo al entrar en el tunnel.
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
      }}
    />
  )
}

/* ── HeroOverlay ─────────────────────────────────────────── */
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
      {/* Fade inferior — sella con la siguiente sección */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #05070B 10%, rgba(5,7,11,0.5) 44%, transparent 100%)',
        }}
      />
      {/* Fade superior — sella con el nav */}
      <div
        className="absolute inset-x-0 top-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #05070B 0%, transparent 100%)' }}
      />
    </>
  )
}

/* ── HeroContent ─────────────────────────────────────────── */
function HeroContent({
  opacity,
  y,
}: {
  opacity: MotionValue<number>
  y: MotionValue<number>
}) {
  const c = siteCopy.hero

  return (
    <motion.div
      className="relative z-10 max-w-7xl mx-auto w-full"
      style={{ opacity, y, willChange: 'opacity, transform' }}
    >
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
    </motion.div>
  )
}

/* ── Hero ────────────────────────────────────────────────── */
// Contenedor de 250vh: 100vh sticky + 150vh de rango de scroll.
// Cuando el hero se desvanece el Canvas 3D (z-0, fixed) queda expuesto.
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  // scrollYProgress: 0 = hero entra en viewport, 1 = hero sale de viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Zoom no-lineal hacia el núcleo
  const bgScale = useTransform(scrollYProgress, SCALE_PROGRESS, SCALE_VALUES)

  // Capas de fondo: se desvanecen juntas revelando el tunnel
  const heroLayersOpacity = useTransform(
    scrollYProgress,
    [HERO_FADE_START, HERO_FADE_END],
    [1, 0]
  )

  // Copy: desaparece antes, sube levemente al irse
  const copyOpacity = useTransform(
    scrollYProgress,
    [COPY_FADE_START, COPY_FADE_END],
    [1, 0]
  )
  const copyY = useTransform(
    scrollYProgress,
    [COPY_FADE_START, COPY_FADE_END],
    [0, -24]
  )

  return (
    // 250vh: crea el rango de scroll para el efecto pinned
    <div ref={containerRef} style={{ height: '250vh' }}>

      {/* Sección sticky — se queda fija en el viewport mientras scrolleas */}
      <section
        id="hero"
        className="sticky top-0 h-screen flex items-end pb-24 px-6 md:px-12"
        style={{ overflow: 'hidden' }}
      >
        {/* Capas de fondo — se desvanecen juntas a ~0.74 */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: heroLayersOpacity }}
        >
          <HeroBackground scale={bgScale} />
          <NucleusPulse />
          <HeroOverlay />
        </motion.div>

        {/* Copy — desaparece antes a ~0.26 */}
        <HeroContent opacity={copyOpacity} y={copyY} />
      </section>

    </div>
  )
}
