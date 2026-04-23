/**
 * Contact — sección de cierre. Fase 5: "La luz al final del túnel".
 *
 * Secuencia de tres fases dirigida por scroll:
 *
 *  Fase 1 (0%–28%):  imagen aparece pequeña (12% del viewport) y crece
 *                     hasta ocupar la pantalla completa. El fondo oscuro
 *                     se disuelve a medida que la imagen toma el espacio.
 *
 *  Fase 2 (28%–52%): zoom continúa hacia el rectángulo de luz blanca
 *                     (1x → 4.2x). La cámara "entra" al corredor.
 *
 *  Fase 3 (40%–72%): la pantalla se llena de blanco y aparece el CTA.
 *
 * Estructura DOM:
 *  - Sección exterior: 280vh — da el recorrido de scroll necesario
 *  - Contenedor sticky h-screen: permanece fijo mientras la sección scrollea
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'

/* ── FooterImage — imagen con wrapper animado ───────────────── */
// El wrapper controla borderRadius (de 10px a 0) y overflow hidden.
// La imagen interior escala via el scale prop del padre.
function FooterImage({
  scale,
  borderRadius,
}: {
  scale: MotionValue<number>
  borderRadius: MotionValue<number>
}) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ scale, willChange: 'transform', transformOrigin: 'center center', borderRadius }}
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

  // scrollYProgress: 0 cuando la sección está en el tope del viewport,
  // 1 cuando el fondo de la sección llega al tope (280vh de recorrido)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // ── Fase 1 + 2: escala de la imagen ─────────────────────────
  // 0→0.28:  0.12 → 1.0  (imagen pequeña crece hasta llenar pantalla)
  // 0.28→0.52: 1.0 → 4.2  (zoom continúa hacia el blanco)
  const bgScale = useTransform(
    scrollYProgress,
    [0,    0.28, 0.52],
    [0.12, 1.0,  4.2 ]
  )

  // ── Border radius: cuadrado pequeño → sin bordes al llenar pantalla
  const bgRadius = useTransform(scrollYProgress, [0, 0.22], [10, 0])

  // ── Fondo oscuro detrás de la imagen (visible en Fase 1) ─────
  // Se disuelve a medida que la imagen crece y toma todo el espacio
  const darkBgOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0])

  // ── Pantalla blanca — aparece cuando el zoom está al máximo ──
  const whiteOpacity = useTransform(scrollYProgress, [0.40, 0.56], [0, 1])

  // ── Contenido — aparece sobre el blanco ──────────────────────
  const contentOpacity = useTransform(scrollYProgress, [0.55, 0.72], [0, 1])
  const contentY       = useTransform(scrollYProgress, [0.55, 0.72], [32, 0])

  return (
    // Sección exterior 280vh — da el recorrido necesario para las 3 fases
    <section
      id="contact"
      ref={sectionRef}
      className="relative"
      style={{ minHeight: '280vh' }}
    >
      {/* Contenedor sticky: permanece fijo mientras la sección scrollea */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* z-0 — fondo negro del que "emerge" la imagen en Fase 1 */}
        <motion.div
          className="absolute inset-0 bg-background"
          style={{ opacity: darkBgOpacity }}
        />

        {/* z-0 — imagen con zoom en 3 fases */}
        <FooterImage scale={bgScale} borderRadius={bgRadius} />

        {/* z-10 — pantalla blanca que sella el zoom */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none bg-white"
          style={{ opacity: whiteOpacity }}
        />

        {/* z-20 — CTA sobre el blanco */}
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
              <a
                href="https://wa.link/ohnau7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-black text-white font-mono text-sm tracking-[0.14em] uppercase rounded-sm hover:bg-black/80 transition-colors"
              >
                {c.ctaPrimary}
              </a>
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
