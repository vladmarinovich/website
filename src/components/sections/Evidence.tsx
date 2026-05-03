/**
 * Evidence — horizontal scroll pinned (cinematic).
 *
 * Patrón: la sección se "pinea" (sticky) cuando entra al viewport.
 * El scroll vertical se traduce en traslación horizontal del track.
 * Estructura del track: [INTRO panel] [CASO 01] [CASO 02] [CASO 03]
 *
 * Cada panel ocupa 100vw → cada caso respira como pantalla dedicada.
 *
 * - Section height = 400vh: 1 panel inicial + 3 panels de scroll
 * - Sticky inner: 100vh, overflow hidden
 * - Track: width = 400vw, x: 0 → -300vw driven by scrollYProgress
 *
 * Mobile (<768px) → fallback a stack vertical (sin pin), respeta UX táctil.
 * prefers-reduced-motion → mismo fallback (sin animación de scroll-jacking).
 */

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { cases } from '@/content/cases'
import { useCaseStore } from '@/store/caseStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { CaseCard } from '@/components/cases/CaseCard'
import type { CaseStudy } from '@/types/case'

const EASE: [number, number, number, number] = [0.25, 0.4, 0.25, 1]

/* ── Panel: intro de la sección ─────────────────────────────── */
interface IntroPanelProps {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}

function IntroPanel({ scrollYProgress }: IntroPanelProps) {
  const c = siteCopy.evidence

  // Reveal coreografiado dentro del primer 25% del progreso
  const opacity = useTransform(scrollYProgress, [0.00, 0.05, 0.18, 0.25], [0, 1, 1, 0.4])
  const x       = useTransform(scrollYProgress, [0.00, 0.25], [0, -40])
  const filter  = useTransform(scrollYProgress, [0.18, 0.25], ['blur(0px)', 'blur(6px)'])

  return (
    <motion.div
      className="shrink-0 w-screen h-screen flex items-center justify-center px-12 md:px-24"
      style={{ opacity, x, filter }}
    >
      <div className="max-w-3xl">
        <SectionEyebrow num="(01)" label={c.eyebrow} colorClass="text-accent-cyan" />
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-textPrimary leading-[1.02] tracking-[-0.025em] mb-8">
          {c.title}
        </h2>
        <p className="text-textSecondary text-xl md:text-2xl max-w-2xl leading-[1.55] mb-10">
          {c.body}
        </p>
        <div className="flex items-center gap-3 font-mono text-xs tracking-[0.28em] uppercase text-textSecondary/60">
          <span>Desplázate</span>
          <motion.span
            aria-hidden
            className="inline-block"
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Panel: caso de estudio en formato full-bleed ───────────── */
interface CasePanelProps {
  caseStudy: CaseStudy
  index: number
  total: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  onClick: () => void
}

function CasePanel({ caseStudy: c, index, total, scrollYProgress, onClick }: CasePanelProps) {
  // Cada panel tiene su rango propio dentro del progreso global.
  // Track total = (total + 1) panels. Panel index ocupa [index/total, (index+1)/total].
  const segment = 1 / total
  const enter   = index * segment + segment * 0.20
  const center  = index * segment + segment * 0.55
  const exit    = (index + 1) * segment - segment * 0.05

  // Estados visuales por panel
  const opacity = useTransform(
    scrollYProgress,
    [enter - segment * 0.15, enter, center, exit, exit + segment * 0.10],
    [0, 1, 1, 1, 0.3]
  )
  const contentY = useTransform(
    scrollYProgress,
    [enter - segment * 0.10, enter, exit, exit + segment * 0.10],
    [40, 0, 0, -20]
  )
  const visualScale = useTransform(
    scrollYProgress,
    [enter - segment * 0.15, center, exit + segment * 0.10],
    [1.08, 1.00, 0.96]
  )
  const visualOpacity = useTransform(
    scrollYProgress,
    [enter - segment * 0.15, enter, exit, exit + segment * 0.10],
    [0.5, 1, 1, 0.4]
  )

  return (
    <motion.div
      className="shrink-0 w-screen h-screen flex items-center px-8 md:px-16 lg:px-24"
      style={{ opacity }}
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

        {/* Lado izquierdo — narrativa */}
        <motion.div style={{ y: contentY }} className="order-2 lg:order-1">
          <p className="font-mono text-xs tracking-[0.32em] text-accent-cyan/85 mb-6 uppercase flex items-center gap-3">
            <span className="opacity-50">CASO</span>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span className="opacity-30">/</span>
            <span className="opacity-50">{String(total).padStart(2, '0')}</span>
          </p>

          <p className="font-mono text-xs tracking-[0.22em] text-accent-cyan mb-4 uppercase">
            {c.eyebrow}
          </p>

          <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-textPrimary leading-[1.04] tracking-[-0.02em] mb-5">
            {c.title}
          </h3>

          <p className="font-mono text-xs text-textSecondary/60 tracking-wide mb-7 uppercase">
            {c.category}
          </p>

          <p className="text-textSecondary text-base md:text-lg leading-[1.65] mb-8 max-w-xl">
            {c.summary}
          </p>

          {/* Stack — chips */}
          {c.stack && c.stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {c.stack.slice(0, 5).map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[10px] text-textSecondary/55 border border-white/[0.08] px-2.5 py-1 rounded-sm tracking-wide uppercase"
                >
                  {tool}
                </span>
              ))}
              {c.stack.length > 5 && (
                <span className="font-mono text-[10px] text-textSecondary/40 px-2 py-1 tracking-wide">
                  +{c.stack.length - 5}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            onClick={onClick}
            className="group inline-flex items-center gap-3 font-mono text-sm tracking-[0.18em] text-accent-cyan uppercase border-b border-accent-cyan/30 pb-2 hover:border-accent-cyan transition-colors cursor-pointer"
          >
            <span>Ver caso completo</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </button>
        </motion.div>

        {/* Lado derecho — visual */}
        <motion.button
          onClick={onClick}
          className="relative order-1 lg:order-2 w-full aspect-[16/10] lg:aspect-[4/3] overflow-hidden rounded-sm border border-white/[0.08] bg-surfaceSoft group cursor-pointer hover:border-accent-cyan/30 transition-colors duration-500"
          style={{ scale: visualScale, opacity: visualOpacity }}
          aria-label={`Abrir caso ${c.title}`}
        >
          <img
            src={c.assets[0].src}
            alt={c.assets[0].alt}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            draggable={false}
            loading="lazy"
          />
          {/* Gradiente sutil para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent pointer-events-none" />
          {/* Marca de número */}
          <span className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.32em] text-textPrimary/70 uppercase backdrop-blur-sm bg-background/30 px-2.5 py-1 rounded-sm">
            CASO {String(index + 1).padStart(2, '0')}
          </span>
        </motion.button>

      </div>
    </motion.div>
  )
}

/* ── Indicador de progreso bottom ───────────────────────────── */
function ProgressIndicator({
  scrollYProgress,
  totalPanels,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  totalPanels: number
}) {
  // Counter activo (1-3 ignorando el panel intro)
  const counterText = useTransform(scrollYProgress, (v) => {
    const segment = 1 / totalPanels
    const idx = Math.min(totalPanels - 1, Math.max(0, Math.floor(v / segment)))
    return String(Math.max(1, idx)).padStart(2, '0')
  })

  // Progress bar fill (descontando el intro)
  const fillScale = useTransform(scrollYProgress, [1 / totalPanels, 1], [0, 1])

  return (
    <div className="absolute bottom-10 left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
      <div className="flex items-center gap-5">
        <motion.span className="font-mono text-xs tracking-[0.32em] text-textSecondary/70 uppercase tabular-nums">
          {counterText}
        </motion.span>

        {/* Barra de progreso */}
        <div className="relative w-32 h-px bg-white/10 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent-cyan origin-left"
            style={{ scaleX: fillScale, width: '100%' }}
          />
        </div>

        <span className="font-mono text-xs tracking-[0.32em] text-textSecondary/40 uppercase tabular-nums">
          {String(totalPanels - 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

/* ── Evidence (export) ──────────────────────────────────────── */
export default function Evidence() {
  const openCase  = useCaseStore((s) => s.openCase)
  const sectionRef = useRef<HTMLElement>(null)
  const reduced    = useReducedMotion()

  const totalPanels = 1 + cases.length // 1 intro + N casos

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Track horizontal: traslación 0 → -((totalPanels - 1) * 100vw)
  // Usamos transform string (no x) porque WAAPI no puede tween "vw" en motion.x
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [`translate3d(0vw, 0, 0)`, `translate3d(-${(totalPanels - 1) * 100}vw, 0, 0)`]
  )

  /* ── Mobile / reduced-motion fallback: stack vertical ── */
  // TEMPORAL: forzamos fallback mientras debuggeo el WAAPI error en horizontal pinned
  if (reduced || true) {
    return <EvidenceFallback openCase={openCase} />
  }

  return (
    <>
      {/* Desktop: horizontal scroll pinned */}
      <section
        id="evidence"
        ref={sectionRef}
        className="relative hidden md:block"
        style={{ height: `${totalPanels * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div className="flex h-full" style={{ transform, willChange: 'transform' }}>
            <IntroPanel scrollYProgress={scrollYProgress} />
            {cases.map((caseStudy, i) => (
              <CasePanel
                key={caseStudy.id}
                caseStudy={caseStudy}
                index={i + 1}
                total={totalPanels}
                scrollYProgress={scrollYProgress}
                onClick={() => openCase(caseStudy.id)}
              />
            ))}
          </motion.div>

          <ProgressIndicator scrollYProgress={scrollYProgress} totalPanels={totalPanels} />
        </div>
      </section>

      {/* Mobile: stack vertical estándar */}
      <div className="md:hidden">
        <EvidenceFallback openCase={openCase} />
      </div>
    </>
  )
}

/* ── Fallback estático: grid vertical para mobile y reduced-motion ── */
function EvidenceFallback({ openCase }: { openCase: (id: string) => void }) {
  const c = siteCopy.evidence

  return (
    <section
      id="evidence"
      className="relative min-h-screen py-36 md:py-48 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <SectionEyebrow num="(01)" label={c.eyebrow} colorClass="text-accent-cyan" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.08 }}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold text-textPrimary leading-[1.02] tracking-[-0.02em] mb-6"
        >
          {c.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.18 }}
          className="text-textSecondary text-lg md:text-xl max-w-2xl leading-[1.6] mb-0"
        >
          {c.body}
        </motion.p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseStudy, i) => (
            <CaseCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={i}
              onClick={() => openCase(caseStudy.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
