/**
 * Contact — sección de cierre. Fase 5: "La luz al final del túnel".
 *
 * La imagen del footer es el mismo corredor del hero pero iluminado —
 * narrativa completa: entraste al túnel en el hero, llegaste al otro lado aquí.
 *
 * Capas (bottom → top):
 *  1. Imagen de fondo con parallax suave
 *  2. Gradiente radial: oscurece bordes, preserva luz central
 *  3. Pulso de luz central (glow animado)
 *  4. Contenido CTA centrado
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

export default function Contact() {
  const c = siteCopy.contact
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax: imagen se desplaza más lento que el scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Imagen de fondo con parallax ── */}
      <motion.div
        className="absolute inset-[-10%] z-0"
        style={{ y: imageY }}
      >
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/assets/images/footer-mobile.webp"
          />
          <img
            src="/assets/images/footer-desktop.webp"
            alt=""
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
        </picture>
      </motion.div>

      {/* ── Gradiente de profundidad: oscurece los 4 bordes, preserva el centro ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 55% 55% at 50% 48%,
              transparent 0%,
              transparent 35%,
              rgba(0, 0, 0, 0.35) 65%,
              rgba(0, 0, 0, 0.72) 100%)
          `,
        }}
      />

      {/* ── Pulso de luz central — acentúa la luminosidad natural de la imagen ── */}
      <motion.div
        className="absolute z-10 pointer-events-none"
        style={{
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '28vw',
          height: '28vw',
          maxWidth: 420,
          maxHeight: 420,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 45%, transparent 70%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Contenido CTA ── */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-6 md:px-12 py-32 text-center flex flex-col items-center">

        <FadeUp delay={0.05}>
          <p className="font-mono text-xs tracking-[0.28em] text-white/50 uppercase mb-8">
            {c.eyebrow}
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-8 drop-shadow-[0_2px_32px_rgba(0,0,0,0.6)]">
            {c.title}
          </h2>
        </FadeUp>

        <FadeUp delay={0.25}>
          <p className="text-white/65 text-lg max-w-lg leading-relaxed mb-12 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            {c.body}
          </p>
        </FadeUp>

        <FadeUp delay={0.35}>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {/* CTA primario — fondo oscuro para contrastar con la luz central */}
            <a
              href="https://cal.com/vladmarinovich"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-black font-mono text-sm tracking-[0.14em] uppercase rounded-sm hover:bg-white/90 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.25)]"
            >
              {c.ctaPrimary}
            </a>

            <a
              href="mailto:consultor@vladmarinovich.com"
              className="px-8 py-4 border border-white/25 text-white/80 font-mono text-sm tracking-[0.14em] uppercase rounded-sm hover:border-white/50 hover:text-white transition-all backdrop-blur-sm"
            >
              {c.ctaSecondary}
            </a>
          </div>

          <p className="font-mono text-xs text-white/35 tracking-[0.14em]">
            {c.microcopy}
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
