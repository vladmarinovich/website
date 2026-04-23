/**
 * Contact — sección de cierre. Fase 5: "La luz al final del túnel".
 *
 * Secuencia dirigida por scroll:
 *  1. Ves la imagen del corredor (la misma que el hero, pero iluminada)
 *  2. Scrolleas → la cámara se acerca al rectángulo de luz blanca (zoom 1x → 4x)
 *  3. El blanco llena la pantalla completa
 *  4. Aparece el título y el CTA sobre el blanco
 *
 * Estructura:
 *  - Sección exterior: 220vh — da el recorrido de scroll necesario
 *  - Contenedor sticky h-screen: permanece fijo mientras la sección scrollea
 *
 * Capas (fondo → frente):
 *  1. FooterBackground  → imagen con zoom scroll-driven (1.0 → 4.0)
 *  2. WhiteScreen       → overlay blanco que aparece cuando el zoom está al máximo
 *  3. Contenido CTA     → texto negro, aparece sobre el blanco
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'

/* ── FooterBackground — zoom scroll-driven hacia la luz ────── */
// Mismo patrón que HeroBackground. El zoom lleva la cámara desde
// la vista general del corredor hasta el interior del rectángulo blanco.
// A escala ~4x, la zona blanca de la imagen llena el viewport completo.
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

/* ── Contact ─────────────────────────────────────────────────── */
export default function Contact() {
  const c = siteCopy.contact
  const sectionRef = useRef<HTMLElement>(null)

  // Lectura del scroll relativa a la sección:
  // 0 → sección alineada en el tope del viewport
  // 1 → sección completamente scrolleada (fondo alineado con el tope)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // ── Zoom: 1.0 → 4.0 en el primer 48% del recorrido ──────────
  // A escala ~4x el rectángulo blanco central de la imagen llena el viewport.
  // clamp(1, 4) para que no escale más allá del blanco.
  const bgScale = useTransform(scrollYProgress, [0, 0.48], [1.0, 4.0])

  // ── Pantalla blanca: aparece mientras el zoom completa (35%→52%) ─
  // Garantiza un blanco 100% limpio y oculta los bordes del zoom.
  const whiteOpacity = useTransform(scrollYProgress, [0.35, 0.54], [0, 1])

  // ── Contenido: aparece sobre el blanco (53%→70%) ─────────────
  const contentOpacity = useTransform(scrollYProgress, [0.53, 0.70], [0, 1])
  const contentY       = useTransform(scrollYProgress, [0.53, 0.70], [28, 0])

  return (
    // Sección exterior: 220vh — el scroll extra es lo que impulsa el zoom
    <section
      id="contact"
      ref={sectionRef}
      className="relative"
      style={{ minHeight: '220vh' }}
    >
      {/* Contenedor sticky: permanece fijo mientras la sección scrollea */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* z-0 — imagen con zoom dramático hacia el blanco */}
        <FooterBackground scale={bgScale} />

        {/* z-10 — pantalla blanca que sella el zoom */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none bg-white"
          style={{ opacity: whiteOpacity }}
        />

        {/* z-20 — CTA sobre el blanco — texto negro */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 md:px-12"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center">

            <p className="font-mono text-xs tracking-[0.28em] text-black/40 uppercase mb-8">
              {c.eyebrow}
            </p>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.05] tracking-tight mb-8">
              {c.title}
            </h2>

            <p className="text-black/55 text-lg max-w-lg leading-relaxed mb-12">
              {c.body}
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {/* CTA primario — negro sobre blanco */}
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

          </div>
        </motion.div>

      </div>
    </section>
  )
}
