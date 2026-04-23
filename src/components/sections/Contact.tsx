/**
 * Contact — sección de cierre. Fase 5: "La luz al final del túnel".
 *
 * Secuencia de tres fases dirigida por scroll (intacta):
 *  Fase 1 (0%–28%):   imagen 12% → 100% viewport
 *  Fase 2 (28%–52%):  zoom 1x → 4.2x, cámara entra
 *  Fase 3 (40%–72%):  blanco llena la pantalla, aparece CTA + firma
 *
 * Jerarquía del CTA:
 *  - Primario:   botón negro sólido con flecha animada (acción)
 *  - Secundario: text-link con underline offset (alternativa, menos peso)
 *  - Microcopy:  directamente bajo el primario, no al final
 *
 * Sign-off:
 *  - La firma (logo-vlad.svg) aparece grande al centro-bajo del blanco,
 *    como si el usuario acabara de recibir un documento firmado.
 *    Es el lugar natural para una firma manuscrita — no en un nav de 64px.
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/* ── FooterImage ─────────────────────────────────────────────── */
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
  const c          = siteCopy.contact
  const sectionRef = useRef<HTMLElement>(null)
  const reduced    = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // ── Fase 1 + 2: escala de la imagen ─────────────────────────
  const bgScale = useTransform(
    scrollYProgress,
    [0,    0.28, 0.52],
    [0.12, 1.0,  4.2 ]
  )

  const bgRadius      = useTransform(scrollYProgress, [0, 0.22], [10, 0])
  const darkBgOpacity = useTransform(scrollYProgress, [0, 0.30], [1, 0])

  // ── Contenido — aparece cuando la imagen domina la pantalla ──
  const contentOpacity = useTransform(scrollYProgress, [0.36, 0.50], [0, 1])
  const contentY       = useTransform(scrollYProgress, [0.36, 0.50], [32, 0])

  // Firma entra un beat después que el CTA — sello final
  const signatureOpacity = useTransform(scrollYProgress, [0.46, 0.62], [0, 1])
  const signatureY       = useTransform(scrollYProgress, [0.46, 0.62], [12, 0])

  // Si reduced-motion: todo estático, visible desde el arranque
  const staticStyle = reduced
    ? { opacity: 1, y: 0 }
    : { opacity: contentOpacity, y: contentY }

  const staticSig = reduced
    ? { opacity: 1, y: 0 }
    : { opacity: signatureOpacity, y: signatureY }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative"
      style={{ minHeight: '280vh' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* z-0 — fondo negro */}
        <motion.div
          className="absolute inset-0 bg-background"
          style={{ opacity: reduced ? 0 : darkBgOpacity }}
        />

        {/* z-0 — imagen con zoom en 3 fases */}
        <FooterImage scale={bgScale} borderRadius={bgRadius} />

        {/* z-20 — CTA sobre el blanco */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 md:px-12"
          style={staticStyle}
        >
          <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center">

            <p className="font-mono text-xs tracking-[0.30em] text-black/45 uppercase mb-8">
              {c.eyebrow}
            </p>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black leading-[1.04] tracking-[-0.02em] mb-6 max-w-3xl">
              {c.title}
            </h2>

            <p className="text-black/60 text-lg md:text-xl max-w-md leading-[1.55] mb-10">
              {c.body}
            </p>

            {/* CTA primario — acción con peso */}
            <a
              href="https://wa.link/ohnau7"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-mono text-sm tracking-[0.16em] uppercase rounded-sm hover:bg-black/85 transition-colors mb-4"
            >
              <span>{c.ctaPrimary}</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>

            {/* Microcopy directamente bajo el primario */}
            <p className="font-mono text-[11px] text-black/45 tracking-[0.20em] uppercase mb-8">
              {c.microcopy}
            </p>

            {/* CTA secundario — text-link, sin borde */}
            <a
              href="mailto:consultor@vladmarinovich.com"
              className="font-mono text-sm tracking-[0.14em] text-black/60 hover:text-black uppercase underline underline-offset-[6px] decoration-black/25 hover:decoration-black/80 transition-colors"
            >
              {c.ctaSecondary}
            </a>

          </div>
        </motion.div>

        {/* z-30 — firma grande como sign-off al pie */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 pb-10 md:pb-12 flex flex-col items-center pointer-events-none"
          style={staticSig}
        >
          <img
            src="/assets/images/logo-vlad.svg"
            alt="Firma Vladislav Marinovich"
            className="h-24 md:h-32 w-auto opacity-90"
            draggable={false}
          />
          <span className="mt-3 font-mono text-[10px] tracking-[0.32em] text-black/45 uppercase">
            Vladislav Marinovich · 2026
          </span>
        </motion.div>

      </div>
    </section>
  )
}
