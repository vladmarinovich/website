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
      <p className="text-2xl font-bold text-textPrimary mb-1 leading-none">
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
                          Stack
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
