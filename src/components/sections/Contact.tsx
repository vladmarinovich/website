/**
 * Contact — sección de cierre. Fase 5: "La luz al final del túnel".
 *
 * Misma mecánica que el hero pero invertida:
 *  - Hero:   imagen oscura → zoom scroll-driven → núcleo negro traga pantalla
 *  - Footer: imagen con luz blanca → zoom scroll-driven → núcleo blanco expande
 *
 * Capas (fondo → frente):
 *  1. FooterBackground  → imagen responsive con zoom scroll-driven
 *  2. LightNucleus      → glow blanco orgánico que crece con el scroll
 *  3. Overlay de lectura → garantiza blanco limpio bajo el texto
 *  4. Contenido CTA     → texto negro, centrado
 */

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

/* ── FooterBackground — imagen con zoom scroll-driven ──────── */
// Mismo patrón que HeroBackground: la imagen escala a medida que
// el usuario scrollea a través de la sección.
// Breakpoints más suaves que el hero — la llegada debe sentirse
// tranquila, no agresiva.
function FooterBackground({ scale }: { scale: MotionValue<number> }) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ scale, willChange: 'transform', transformOrigin: 'center center' }}
    >
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet="/assets/images/footer-desktop.webp"
          type="image/webp"
        />
        <img
          src="/assets/images/footer-mobile.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-full object-cover object-center select-none"
        />
      </picture>
    </motion.div>
  )
}

/* ── LightNucleus — núcleo de luz blanca orgánico ───────────── */
// Canvas 2D — inversión visual del PortalPulse del hero.
// El héroe tenía una masa oscura que tragaba la pantalla;
// aquí es una masa blanca que emerge desde la luz central de la imagen.
// Se expande con el scroll: pequeño al entrar a la sección, llena la
// pantalla cuando el usuario termina de leer el CTA.
function LightNucleus({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)

  // Suscribirse al MotionValue para leerlo dentro del RAF sin re-renders
  useEffect(() => {
    const unsub = scrollProgress.on('change', (v) => { progressRef.current = v })
    return unsub
  }, [scrollProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const mountTime = performance.now()

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const drawLoop = (now: number) => {
      raf = requestAnimationFrame(drawLoop)

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const cx = w * 0.50
      const cy = h * 0.47  // ligeramente arriba del centro, donde vive la luz en la imagen

      const elapsed = Math.max(0, now - mountTime) / 1000

      // Ramp de activación: aparece suavemente 1s después del mount
      const ramp = Math.min(1, Math.max(0, (elapsed - 1.0) / 1.8))
      if (ramp < 0.005) return

      // Progreso de scroll: 0 cuando la sección entra, ~0.5 cuando está centrada
      // El núcleo se expande durante la primera mitad del scroll a través de la sección
      const t       = progressRef.current
      const expandT = Math.max(0, Math.min(1, (t - 0.05) / 0.55))

      // ── Tamaño ────────────────────────────────────────────────
      const isMobile = w < 768
      // SR_BASE: tamaño inicial pequeño (el rectángulo de luz en la imagen)
      const SR_BASE  = Math.min(w, h) * (isMobile ? 0.09 : 0.055)
      // SR_MAX: cubre la pantalla completa en el pico del scroll
      const SR_MAX   = Math.sqrt(w * w + h * h) * 0.56
      const SR       = SR_BASE + (SR_MAX - SR_BASE) * expandT

      // ── Forma orgánica ─────────────────────────────────────────
      // La perturbación se reduce al crecer — la luz se vuelve más pura y limpia
      const perturbScale = (1 - expandT) * (1 - expandT)
      const lightShape = (a: number) =>
        SR * (
          1.00 +
          perturbScale * (
            0.20 * Math.sin(a * 3 + elapsed * 0.22) +
            0.14 * Math.sin(a * 5 - elapsed * 0.37 + 1.3) +
            0.09 * Math.cos(a * 7 + elapsed * 0.15 + 2.1) +
            0.05 * Math.sin(a * 11 - elapsed * 0.28 + 0.8)
          )
        )

      const buildPath = () => {
        const pts = 96
        ctx.beginPath()
        for (let j = 0; j <= pts; j++) {
          const a = (j / pts) * Math.PI * 2
          const r = lightShape(a)
          j === 0
            ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
            : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        }
        ctx.closePath()
      }

      // a. Aura exterior — halo cálido que se atenúa al crecer
      const auraAlpha = ramp * (1 - expandT * 0.7)
      const auraGrad  = ctx.createRadialGradient(cx, cy, SR * 0.5, cx, cy, SR * 2.4)
      auraGrad.addColorStop(0,   `rgba(255,252,235,${auraAlpha * 0.35})`)
      auraGrad.addColorStop(0.5, `rgba(255,248,220,${auraAlpha * 0.12})`)
      auraGrad.addColorStop(1,   'rgba(255,245,200,0)')
      ctx.fillStyle = auraGrad
      ctx.beginPath()
      ctx.arc(cx, cy, SR * 2.4, 0, Math.PI * 2)
      ctx.fill()

      // b. Interior del núcleo — blanco puro con resplandor cálido
      buildPath()
      ctx.save()
      ctx.clip()

      // Base blanca densa
      ctx.fillStyle = `rgba(255,255,255,${ramp * 0.92})`
      ctx.fillRect(0, 0, w, h)

      // Pulso cálido interior — sutil, como una respiración
      const pulseAlpha = (1 - expandT * 0.8) * (0.30 + 0.18 * Math.sin(elapsed * 1.15))
      const innerGrad  = ctx.createRadialGradient(cx, cy, 0, cx, cy, SR * 0.9)
      innerGrad.addColorStop(0,   `rgba(255,252,230,${ramp * pulseAlpha})`)
      innerGrad.addColorStop(0.5, `rgba(255,248,210,${ramp * pulseAlpha * 0.5})`)
      innerGrad.addColorStop(1,   'rgba(255,245,200,0)')
      ctx.fillStyle = innerGrad
      ctx.fillRect(0, 0, w, h)

      ctx.restore()

      // c. Contorno vivo — desaparece al expandirse
      const strokeAlpha = ramp * 0.45 * (1 - expandT * 0.92)
      if (strokeAlpha > 0.01) {
        buildPath()
        ctx.strokeStyle = `rgba(255,248,210,${strokeAlpha})`
        ctx.lineWidth   = 1.4
        ctx.stroke()
      }
    }

    raf = requestAnimationFrame(drawLoop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

/* ── Contact ─────────────────────────────────────────────────── */
export default function Contact() {
  const c = siteCopy.contact
  const sectionRef = useRef<HTMLElement>(null)

  // scrollYProgress: 0 cuando la sección entra desde abajo, 1 cuando sale por arriba
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Zoom scroll-driven — más suave que el hero (1.0 → 1.45 vs 1.0 → 2.2)
  // La llegada debe sentirse tranquila: ya saliste del túnel, estás en la luz
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.45])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* z-0 — imagen de fondo con zoom scroll-driven */}
      <FooterBackground scale={bgScale} />

      {/* z-10 — núcleo de luz blanca que crece con el scroll */}
      <div className="absolute inset-0 z-10">
        <LightNucleus scrollProgress={scrollYProgress} />
      </div>

      {/* z-10 — overlay radial: aclara el centro para garantizar legibilidad del texto negro */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 58% at 50% 48%, rgba(255,255,255,0.50) 0%, transparent 68%)',
        }}
      />

      {/* z-20 — contenido CTA — texto negro */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-6 md:px-12 py-32 text-center flex flex-col items-center">

        <FadeUp delay={0.05}>
          <p className="font-mono text-xs tracking-[0.28em] text-black/40 uppercase mb-8">
            {c.eyebrow}
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.05] tracking-tight mb-8">
            {c.title}
          </h2>
        </FadeUp>

        <FadeUp delay={0.25}>
          <p className="text-black/55 text-lg max-w-lg leading-relaxed mb-12">
            {c.body}
          </p>
        </FadeUp>

        <FadeUp delay={0.35}>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {/* CTA primario — negro sobre blanco, inversión del hero */}
            <a
              href="https://wa.link/ohnau7"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-black text-white font-mono text-sm tracking-[0.14em] uppercase rounded-sm hover:bg-black/80 transition-colors"
            >
              {c.ctaPrimary}
            </a>

            {/* CTA secundario — borde fino oscuro */}
            <a
              href="mailto:consultor@vladmarinovich.com"
              className="px-8 py-4 border border-black/20 text-black/65 font-mono text-sm tracking-[0.14em] uppercase rounded-sm hover:border-black/40 hover:text-black transition-all"
            >
              {c.ctaSecondary}
            </a>
          </div>

          <p className="font-mono text-xs text-black/30 tracking-[0.14em]">
            {c.microcopy}
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
