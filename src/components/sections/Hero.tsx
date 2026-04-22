/**
 * Sección Hero — secuencia de activación + portal de entrada.
 *
 * Narrative timing (on mount):
 *  0.05s → eyebrow aparece
 *  0.15s → headline aparece
 *  0.25s → subtitle aparece
 *  0.35s → CTAs aparecen
 *  1.80s → NucleusPulse se activa (portal empieza a respirar)
 *  2.50s → EnergyFilaments aparecen (filamentos internos del portal)
 *
 * Narrative timing (on scroll):
 *  0% – 8%   → imagen quieta, texto en lectura
 *  8% – 26%  → copy desaparece suavemente
 *  0% – 75%  → zoom no-lineal hacia el núcleo
 *  52% – 74% → fondo + portal se disuelven → tunnel 3D aparece
 *
 * Capas (bottom → top):
 *  HeroBackground  → imagen responsive + zoom
 *  NucleusPulse    → glow radial violeta pulsante
 *  EnergyFilaments → filamentos de energía dentro del portal
 *  HeroOverlay     → velos de oscurecimiento + fades de borde
 *  HeroContent     → copy DOM, desaparece antes que el fondo
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

const OVERLAY_DESKTOP      = 0.30
const OVERLAY_MOBILE_EXTRA = 0.12

// Zoom no-lineal: lento al inicio, acelera hacia el portal
const SCALE_PROGRESS = [0,    0.25,  0.55,  0.75]
const SCALE_VALUES   = [1,    1.08,  1.55,  2.20]

// Fondo: fade out → revela el tunnel 3D
const HERO_FADE_START = 0.52
const HERO_FADE_END   = 0.74

// Copy: desaparece antes (el usuario empieza a entrar)
const COPY_FADE_START = 0.08
const COPY_FADE_END   = 0.26

// Núcleo: parámetros de respiración
const PULSE_MIN      = 0.10
const PULSE_MAX      = 0.22
const PULSE_DURATION = 5.5   // segundos por ciclo
const PULSE_DELAY    = 1.8   // el texto se asienta primero

// Filamentos: aparecen después del núcleo
const FILAMENT_DELAY = 2.5

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
// Glow radial violeta que empieza a respirar 1.8s después del mount.
// El texto está asentado antes de que el portal tome protagonismo.
function NucleusPulse() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [PULSE_MIN, PULSE_MAX, PULSE_MIN] }}
      transition={{
        duration: PULSE_DURATION,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: PULSE_DELAY,
      }}
      style={{
        background:
          'radial-gradient(ellipse 52% 48% at 50% 50%, rgba(100,60,200,1) 0%, transparent 68%)',
        filter: 'blur(48px)',
      }}
    />
  )
}

/* ── EnergyFilaments ─────────────────────────────────────── */
// Filamentos de energía luminosa contenidos dentro del área del portal.
// Implementados con conic-gradient (rayos finos) + mask radial (contención)
// + blur suave (difuminado orgánico). Opacidad máxima muy baja — presencia
// sin estridencia. Aparecen 0.7s después del glow del núcleo.
function EnergyFilaments() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.55, 0.35, 0.60, 0.40, 0.55] }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: FILAMENT_DELAY,
        times: [0, 0.12, 0.35, 0.58, 0.80, 1],
      }}
      style={{
        // Máscara radial — filamentos solo dentro del área del portal
        maskImage:
          'radial-gradient(ellipse 42% 40% at 50% 50%, black 10%, black 40%, transparent 65%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 42% 40% at 50% 50%, black 10%, black 40%, transparent 65%)',
        // Rayos finos cónicos — nervadura luminosa del portal
        background: `conic-gradient(
          from 12deg at 50% 50%,
          transparent 0deg,   rgba(145,80,255,0.13) 2deg,   transparent 5deg,
          transparent 22deg,  rgba(165,95,255,0.09) 24deg,  transparent 27deg,
          transparent 46deg,  rgba(130,70,240,0.12) 48deg,  transparent 51deg,
          transparent 74deg,  rgba(155,88,255,0.08) 76deg,  transparent 79deg,
          transparent 102deg, rgba(140,80,255,0.11) 104deg, transparent 107deg,
          transparent 128deg, rgba(160,90,255,0.09) 130deg, transparent 133deg,
          transparent 158deg, rgba(135,75,250,0.13) 160deg, transparent 163deg,
          transparent 188deg, rgba(148,83,255,0.08) 190deg, transparent 193deg,
          transparent 218deg, rgba(155,88,255,0.10) 220deg, transparent 223deg,
          transparent 248deg, rgba(138,78,245,0.12) 250deg, transparent 253deg,
          transparent 278deg, rgba(162,92,255,0.07) 280deg, transparent 283deg,
          transparent 308deg, rgba(142,80,255,0.11) 310deg, transparent 313deg,
          transparent 338deg, rgba(150,85,255,0.09) 340deg, transparent 343deg,
          transparent 360deg
        )`,
        filter: 'blur(2.5px)',
      }}
    />
  )
}

/* ── HeroOverlay ─────────────────────────────────────────── */
function HeroOverlay() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `rgba(5,7,11,${OVERLAY_DESKTOP})` }}
      />
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: `rgba(5,7,11,${OVERLAY_MOBILE_EXTRA})` }}
      />
      {/* Fade inferior */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #05070B 10%, rgba(5,7,11,0.5) 44%, transparent 100%)',
        }}
      />
      {/* Fade superior */}
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
        <p className="text-textSecondary text-xl md:text-2xl max-w-2xl leading-relaxed mb-10">
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
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const bgScale = useTransform(scrollYProgress, SCALE_PROGRESS, SCALE_VALUES)

  const heroLayersOpacity = useTransform(
    scrollYProgress,
    [HERO_FADE_START, HERO_FADE_END],
    [1, 0]
  )

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
    <div ref={containerRef} style={{ height: '250vh' }}>
      <section
        id="hero"
        className="sticky top-0 h-screen flex items-end pb-24 px-6 md:px-12"
        style={{ overflow: 'hidden' }}
      >
        {/* Fondo + portal — se disuelven juntos a ~0.74 */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: heroLayersOpacity }}
        >
          <HeroBackground scale={bgScale} />
          <NucleusPulse />
          <EnergyFilaments />
          <HeroOverlay />
        </motion.div>

        {/* Copy — desaparece antes a ~0.26 */}
        <HeroContent opacity={copyOpacity} y={copyY} />
      </section>
    </div>
  )
}
