/**
 * Sección Hero — primera pantalla del sitio.
 *
 * Estructura interna:
 *  - HeroBackground  → imagen responsive (picture) con push-in de scroll
 *  - HeroOverlay     → capas de oscurecimiento para legibilidad del copy
 *  - HeroContent     → copy con animaciones de entrada staggeradas
 *
 * Comportamiento de scroll:
 *  El fondo escala muy lentamente de 1.0 → PUSH_IN_SCALE mientras el hero
 *  está en el viewport. La sensación buscada es "entrar al sistema",
 *  no "zoom a una imagen". Factor máximo deliberadamente contenido.
 *
 * Assets:
 *  /assets/generated/hero/hero-desktop.webp  → ≥ 768px
 *  /assets/generated/hero/hero-mobile.webp   → < 768px
 *
 * Fallback seguro: si los assets no están, el hero funciona con
 *  solo el overlay de color de fondo + copy.
 *
 * Constantes de overlay ajustables sin tocar el JSX:
 *  OVERLAY_DESKTOP → opacidad del velo negro en desktop (0.30–0.40)
 *  OVERLAY_MOBILE  → opacidad adicional en mobile (suma sobre desktop)
 *  PUSH_IN_SCALE   → escala máxima del push-in (nunca superar 1.10)
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

/* ── Constantes ajustables ───────────────────────────────── */
const OVERLAY_DESKTOP = 0.36   // velo base — desktop (0.30–0.40)
const OVERLAY_MOBILE_EXTRA = 0.12  // opacidad extra en mobile (suma: 0.36+0.12 = 0.48)
const PUSH_IN_SCALE   = 1.07   // escala máxima del push-in al scrollear

/* ── HeroBackground ──────────────────────────────────────── */
// Imagen responsive dentro de un motion.div que escala con scroll.
// La imagen está sobredimensionada (scale > 1 al final) así que
// se usa object-cover para que nunca queden bordes vacíos.
function HeroBackground({ scale, y }: { scale: ReturnType<typeof useTransform>; y: ReturnType<typeof useTransform> }) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ scale, y, willChange: 'transform', transformOrigin: 'center center' }}
    >
      <picture>
        {/* Desktop: ≥ 768px → imagen wide con cámara centrada */}
        <source
          media="(min-width: 768px)"
          srcSet="/assets/generated/hero/hero-desktop.webp"
          type="image/webp"
        />
        {/* Mobile: imagen vertical optimizada para composición en pantalla angosta */}
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

/* ── HeroOverlay ─────────────────────────────────────────── */
// Tres capas:
//  1. Velo oscuro plano para controlar exposición del asset
//  2. Extra oscurecimiento en mobile (texto más corto, imagen más intensa)
//  3. Gradiente inferior → funde con el fondo negro de la siguiente sección
//  4. Gradiente superior → evita corte brusco con el nav transparente
function HeroOverlay() {
  return (
    <>
      {/* Velo base — desktop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `rgba(5,7,11,${OVERLAY_DESKTOP})` }}
      />

      {/* Velo adicional mobile — solo en pantallas pequeñas */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: `rgba(5,7,11,${OVERLAY_MOBILE_EXTRA})` }}
      />

      {/* Fade inferior — disuelve hacia la siguiente sección */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #05070B 8%, rgba(5,7,11,0.55) 45%, transparent 100%)',
        }}
      />

      {/* Fade superior — suaviza el borde con el nav */}
      <div
        className="absolute inset-x-0 top-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #05070B 0%, transparent 100%)' }}
      />
    </>
  )
}

/* ── HeroContent ─────────────────────────────────────────── */
// Copy anclado en la parte inferior del hero.
// Cada elemento entra con FadeUp staggerado para dar ritmo de lectura.
// max-w-4xl en el h1 evita líneas demasiado largas en pantallas anchas.
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
// Orquesta el fondo, el overlay y el contenido.
// useScroll con target + offset=['start start','end start'] captura
// exactamente el rango en que el hero ocupa la pantalla.
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  // Progreso de scroll dentro del hero (0 = el top del hero toca el top de la pantalla)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Push-in: escala muy suave, nunca agresiva
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, PUSH_IN_SCALE])

  // Leve deriva en Y: el fondo sube un poco mientras el hero sale de vista
  // Esto refuerza la sensación de profundidad sin movimiento evidente
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-3%'])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-end pb-24 px-6 md:px-12 overflow-hidden"
    >
      <HeroBackground scale={bgScale} y={bgY} />
      <HeroOverlay />
      <HeroContent />
    </section>
  )
}
