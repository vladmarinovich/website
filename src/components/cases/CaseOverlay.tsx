/**
 * CaseOverlay — panel editorial expandido de un caso de estudio.
 *
 * No es un modal centrado típico. Es un takeover editorial de pantalla
 * completa con layout de dos columnas:
 *  - Izquierda: todo el copy estratégico (scrollable)
 *  - Derecha: screenshots en BrowserFrame (sticky en desktop)
 *
 * Controles:
 *  - Botón CERRAR en header sticky
 *  - Tecla ESC
 *  - Click en backdrop
 *
 * Animación: fade + slide sutil desde abajo (no slide lateral agresivo).
 */

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCaseStore } from '@/store/caseStore'
import { cases } from '@/content/cases'
import { BrowserFrame } from './BrowserFrame'
import type { CaseMetric } from '@/types/case'

/* ── Numeral editorial — CSS embossed, sin imágenes ─────── */
function CaseNumeralHeader({ index, total }: { index: number; total: number }) {
  const num = String(index + 1).padStart(2, '0')
  const tot = String(total).padStart(2, '0')

  return (
    <div className="mb-12 md:mb-16">
      {/* Numeral gigante — embossed via text-stroke + gradient fill */}
      <div
        className="
          font-semibold leading-[0.85] tracking-[-0.04em] select-none
          text-[8rem] md:text-[14rem] lg:text-[18rem]
          bg-gradient-to-b from-white/[0.18] via-white/[0.06] to-white/[0.02]
          [-webkit-background-clip:text] [background-clip:text]
          [-webkit-text-fill-color:transparent]
          [text-shadow:0_2px_0_rgba(255,255,255,0.04),0_-1px_0_rgba(0,0,0,0.6)]
          [filter:drop-shadow(0_30px_60px_rgba(99,215,255,0.04))]
          transition-all duration-1000 ease-out
        "
        aria-hidden="true"
      >
        {num}
      </div>

      {/* Rule + meta editorial */}
      <div className="flex items-center gap-4 mt-2">
        <span className="block h-px w-16 bg-accent-cyan/50" />
        <span className="font-mono text-[11px] tracking-[0.32em] text-textSecondary/60 uppercase">
          Caso {num} <span className="text-textSecondary/30 mx-2">/</span> {tot}
        </span>
      </div>
    </div>
  )
}

/* ── Bloque de sección del copy ──────────────────────────── */
function CopySection({
  label,
  content,
  accent = false,
}: {
  label: string
  content: string
  accent?: boolean
}) {
  return (
    <div>
      <p className="font-mono text-xs tracking-[0.22em] text-textSecondary/50 uppercase mb-3">
        {label}
      </p>
      <p
        className={`text-base leading-relaxed ${
          accent ? 'text-textPrimary' : 'text-textSecondary'
        }`}
      >
        {content}
      </p>
    </div>
  )
}

/* ── Métrica ─────────────────────────────────────────────── */
function Metric({ metric }: { metric: CaseMetric }) {
  return (
    <div>
      <p className="tabular-nums text-2xl font-bold text-textPrimary mb-1 leading-none">
        {metric.value}
      </p>
      <p className="font-mono text-xs text-textSecondary/50 tracking-wide leading-tight">
        {metric.label}
      </p>
    </div>
  )
}

/* ── CaseOverlay ─────────────────────────────────────────── */
export function CaseOverlay() {
  const { activeCaseId, isCaseOpen, closeCase } = useCaseStore()
  const activeCase = cases.find((c) => c.id === activeCaseId)

  // Cierre con tecla ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCase()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closeCase])

  // Bloquea el scroll del body mientras el overlay está abierto
  useEffect(() => {
    if (isCaseOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCaseOpen])

  return (
    <AnimatePresence>
      {isCaseOpen && activeCase && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-background/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCase}
          />

          {/* Panel principal */}
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="h-full overflow-y-auto bg-surface">

              {/* Header sticky */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-8 md:px-16 py-5 bg-surface/95 backdrop-blur-md border-b border-white/[0.06]">
                <p className="font-mono text-xs tracking-[0.22em] text-textSecondary/50 uppercase">
                  {activeCase.eyebrow} · {activeCase.category}
                </p>
                <button
                  onClick={closeCase}
                  className="flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-textSecondary hover:text-textPrimary transition-colors duration-200 uppercase"
                >
                  <span>Cerrar</span>
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>

              {/* Contenido en dos columnas */}
              <div className="px-8 md:px-16 py-16 max-w-7xl mx-auto">

                {/* Hero numeral editorial — CSS embossed, sin imagen */}
                <CaseNumeralHeader
                  index={cases.findIndex(c => c.id === activeCase.id)}
                  total={cases.length}
                />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24">

                  {/* ── Columna izquierda: copy ── */}
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-textPrimary leading-[1.05] tracking-tight mb-14">
                      {activeCase.title}
                    </h2>

                    <div className="space-y-10">
                      <CopySection label="El problema"       content={activeCase.challenge}     />
                      <CopySection label="La intervención"   content={activeCase.intervention}  />
                      <CopySection label="El resultado"      content={activeCase.result}        />
                      <CopySection label="Lectura estratégica" content={activeCase.strategicRead} accent />
                    </div>

                    {/* Métricas */}
                    {activeCase.metrics && activeCase.metrics.length > 0 && (
                      <div className="mt-14 pt-10 border-t border-white/[0.06] grid grid-cols-3 gap-6">
                        {activeCase.metrics.map((m) => (
                          <Metric key={m.label} metric={m} />
                        ))}
                      </div>
                    )}

                    {/* Stack de herramientas */}
                    {activeCase.stack && activeCase.stack.length > 0 && (
                      <div className="mt-10 pt-8 border-t border-white/[0.06]">
                        <p className="font-mono text-xs tracking-[0.22em] text-textSecondary/40 uppercase mb-4">
                          Tecnologías
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeCase.stack.map((tool) => (
                            <span
                              key={tool}
                              className="font-mono text-xs text-textSecondary/60 border border-white/[0.08] px-3 py-1 rounded-sm tracking-wide"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Columna derecha: screenshots ── */}
                  <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                    {activeCase.assets.map((asset) => (
                      <BrowserFrame key={asset.src} src={asset.src} alt={asset.alt} />
                    ))}
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
