/**
 * Contact — sección de cierre. Refinada (post plan de dirección artística).
 *
 * Cambio mayor: ya NO hay zoom blanco dramático. La sección se mantiene
 * oscura de inicio a fin, fiel a "premium silencioso inevitable".
 *
 * Composición:
 *  - Fondo: dark base #05070B
 *  - Atmósfera: la imagen footer-desktop al fondo, opacity 18%, blur 12px,
 *    como un horizonte cálido que se intuye, no protagoniza
 *  - Eyebrow + Title + Body centrados, jerarquía editorial
 *  - CTA primario cyan filled (mismo patrón que Hero)
 *  - CTA secundario underline text-link
 *  - Firma SVG en blanco/cyan abajo, sello final
 *
 * Scroll choreography simplificada:
 *  - 0–18%: copy reveal
 *  - 22–40%: firma reveal
 *  - El resto: sticky dwell para dar peso al cierre
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useUIStore } from '@/store/uiStore'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

export default function Contact() {
  const c          = siteCopy.contact
  const sectionRef = useRef<HTMLElement>(null)
  const reduced    = useReducedMotion()
  const openCalcom = useUIStore((s) => s.setCalcomOpen)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Atmósfera de la imagen — entra suave, NUNCA toma protagonismo
  const atmoOpacity = useTransform(scrollYProgress, [0, 0.18, 0.6], [0, 0.18, 0.10])

  // Copy reveal — temprano, decidido
  const contentOpacity = useTransform(scrollYProgress, [0.04, 0.22], [0, 1])
  const contentY       = useTransform(scrollYProgress, [0.04, 0.22], [24, 0])

  // Firma reveal — un beat después
  const signatureOpacity = useTransform(scrollYProgress, [0.22, 0.42], [0, 1])
  const signatureY       = useTransform(scrollYProgress, [0.22, 0.42], [12, 0])

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
      style={{ minHeight: '180vh' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-background">

        {/* Cierre del túnel — imagen full-bleed, protagonista */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/assets/images/footer-desktop.webp" type="image/webp" />
            <img
              src="/assets/images/footer-mobile.webp"
              alt=""
              draggable={false}
              className="w-full h-full object-cover object-center select-none"
              style={{ opacity: 0.60 }}
            />
          </picture>
          {/* Vignette: oscurece bordes, deja el centro del túnel respirar */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 0%, rgba(5,7,11,0.72) 100%)',
            }}
          />
          {/* Gradiente inferior — fade al negro para que el texto flote */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, #05070B 0%, transparent 45%)',
            }}
          />
        </div>

        {/* Vignette radial sutil para anclar el centro */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 55%, transparent 0%, rgba(5,7,11,0.7) 100%)',
          }}
        />

        {/* Contenido editorial central */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 md:px-12"
          style={staticStyle}
        >
          <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">

            <SectionEyebrow num="(06)" label={c.eyebrow} colorClass="text-accent-cyan" className="mb-8 justify-center" />

            <h2 className="text-4xl md:text-6xl lg:text-[7rem] leading-[0.96] font-semibold text-textPrimary tracking-[-0.02em] mb-8 max-w-4xl">
              {c.title}
            </h2>

            <p className="text-textSecondary text-xl md:text-2xl max-w-xl leading-[1.55] mb-12">
              {c.body}
            </p>

            {/* CTA primario — cyan filled (mismo patrón que Hero) */}
            <button
              type="button"
              onClick={() => openCalcom(true)}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-accent-cyan text-background font-mono text-base tracking-[0.16em] uppercase rounded-sm hover:opacity-92 transition-opacity mb-5 cursor-pointer"
            >
              <span>{c.ctaPrimary}</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                ↗
              </span>
            </button>

            {/* Microcopy bajo el primario */}
            <p className="font-mono text-[11px] text-textSecondary/55 tracking-[0.22em] uppercase mb-10">
              {c.microcopy}
            </p>

            {/* CTA secundario — text link */}
            <a
              href="mailto:consultor@vladmarinovich.com"
              className="font-mono text-sm tracking-[0.14em] text-textSecondary/70 hover:text-textPrimary uppercase underline underline-offset-[6px] decoration-textSecondary/25 hover:decoration-textPrimary/60 transition-colors"
            >
              {c.ctaSecondary}
            </a>

          </div>
        </motion.div>

        {/* Firma sello al pie — blanco sobre dark, no negro sobre blanco */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 pb-10 md:pb-14 flex flex-col items-center pointer-events-none"
          style={staticSig}
        >
          <img
            src="/assets/images/logo-vlad.svg"
            alt="Firma Vladislav Marinovich"
            className="h-20 md:h-28 w-auto opacity-90 invert"
            draggable={false}
          />
          <span className="mt-3 font-mono text-[10px] tracking-[0.32em] text-textSecondary/50 uppercase">
            Vladislav Marinovich · 2026
          </span>
        </motion.div>

      </div>
    </section>
  )
}
