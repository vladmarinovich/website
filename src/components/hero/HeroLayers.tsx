/**
 * Capas visuales del hero — posición fija, nunca scrollean.
 *
 * Este componente vive en el NIVEL RAÍZ de la app (junto a SceneCanvas),
 * no dentro de BaseLayout. Esto garantiza que el fondo nunca "suba"
 * al scrollear — solo se disuelve.
 *
 * Capas (fondo → frente):
 *  1. HeroBackground  → imagen responsive, zoom scroll-driven
 *  2. NucleusPulse    → glow radial violeta, respira desde 1.8s
 *  3. EnergyFilaments → filamentos de energía en el portal (2.0s)
 *  4. HeroOverlay     → velos de oscurecimiento + fades de borde
 *
 * Timing de fade (scrollY relativo a viewport height):
 *  opacity 1 → 0  entre  0.55vh y 1.0vh
 *  Cuando Evidence entra al viewport (scrollY = 100vh), el fondo
 *  está exactamente en opacity 0 → cross-dissolve sin movimiento.
 */

import { motion, useScroll, useTransform } from 'framer-motion'

/* ── Constantes ──────────────────────────────────────────── */
// Calculado una vez en mount — aceptable para este uso
const VH = typeof window !== 'undefined' ? window.innerHeight : 900

// Zoom no-lineal hacia el portal: lento al inicio, acelera al final
const SCALE_X = [0,        VH * 0.25, VH * 0.55, VH * 0.75]
const SCALE_Y = [1,        1.08,      1.55,       2.20]

// Fondo: empieza a disolverse a 0.55vh, completamente ido a 1.0vh
// → sincronizado con la entrada de la siguiente sección
const FADE_START = VH * 0.55
const FADE_END   = VH * 1.0

const OVERLAY_DESKTOP      = 0.30
const OVERLAY_MOBILE_EXTRA = 0.12

const PULSE_MIN      = 0.10
const PULSE_MAX      = 0.24
const PULSE_DURATION = 5.5
const PULSE_DELAY    = 1.8   // espera que el texto se asiente primero

const FILAMENT_DELAY = 2.0   // 0.2s después del glow

/* ── HeroBackground ──────────────────────────────────────── */
function HeroBackground({ scale }: { scale: ReturnType<typeof useTransform> }) {
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
// Glow central que empieza dormido y activa 1.8s después del mount.
// Texto ya está asentado cuando el portal "despierta".
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
// Rayos finos de luz violeta emanando del centro del portal.
// Conic-gradient con ~13 rayos × alpha 0.25 + mask radial para contención.
// Opacity del animation es la escala del efecto (baja → alta → baja).
function EnergyFilaments() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.80, 0.55, 0.90, 0.60, 0.80] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: FILAMENT_DELAY,
        times: [0, 0.12, 0.35, 0.58, 0.80, 1],
      }}
      style={{
        // Máscara radial — contiene los rayos dentro del área del portal
        maskImage:
          'radial-gradient(ellipse 48% 45% at 50% 50%, black 5%, black 38%, transparent 62%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 48% 45% at 50% 50%, black 5%, black 38%, transparent 62%)',
        // Rayos finos cónicos — nervadura luminosa
        background: `conic-gradient(
          from 12deg at 50% 50%,
          transparent 0deg,   rgba(150,85,255,0.25) 2.5deg,  transparent 5deg,
          transparent 22deg,  rgba(170,100,255,0.18) 24deg,  transparent 27deg,
          transparent 46deg,  rgba(135,75,240,0.22) 48.5deg, transparent 51deg,
          transparent 74deg,  rgba(160,90,255,0.16) 76deg,   transparent 79deg,
          transparent 102deg, rgba(145,82,255,0.20) 104deg,  transparent 107deg,
          transparent 128deg, rgba(165,95,255,0.17) 130.5deg,transparent 133deg,
          transparent 158deg, rgba(138,78,248,0.23) 160deg,  transparent 163deg,
          transparent 188deg, rgba(152,86,255,0.15) 190deg,  transparent 193deg,
          transparent 218deg, rgba(158,90,255,0.19) 220deg,  transparent 223deg,
          transparent 248deg, rgba(142,80,245,0.21) 250.5deg,transparent 253deg,
          transparent 278deg, rgba(166,95,255,0.14) 280deg,  transparent 283deg,
          transparent 308deg, rgba(146,83,255,0.20) 310deg,  transparent 313deg,
          transparent 338deg, rgba(155,88,255,0.17) 340deg,  transparent 343deg,
          transparent 360deg
        )`,
        filter: 'blur(2px)',
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

/* ── HeroLayers ──────────────────────────────────────────── */
// Wrapper fixed que agrupa todas las capas visuales del hero.
// Fade basado en scrollY de la ventana: se va exactamente cuando
// la sección Evidence entra al viewport → cross-dissolve limpio.
export default function HeroLayers() {
  const { scrollY } = useScroll()

  const bgScale     = useTransform(scrollY, SCALE_X, SCALE_Y)
  const heroOpacity = useTransform(scrollY, [FADE_START, FADE_END], [1, 0])

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: heroOpacity }}
    >
      <HeroBackground scale={bgScale} />
      <NucleusPulse />
      <EnergyFilaments />
      <HeroOverlay />
    </motion.div>
  )
}
