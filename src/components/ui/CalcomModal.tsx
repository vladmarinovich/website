/**
 * CalcomModal — modal con embed de Cal.com.
 *
 * Cuando un CTA quiere agendar, en lugar de saltar a cal.com en otra
 * pestaña, abre un modal sobre el sitio mismo. Mantiene la experiencia
 * dentro del sistema — cero fricción, cero salida del corredor.
 *
 * Theme matching:
 *   - dark mode (config en Cal.com Settings → Appearance)
 *   - brand color #63D7FF (config en Cal.com Settings)
 *
 * Cierre: tecla ESC, click en backdrop, botón ×.
 * Bloquea scroll del body mientras está abierto.
 */

import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/uiStore'

// Lazy load — Cal.com SDK pesa ~200KB y NO debe descargarse al cargar el sitio.
// Solo se baja cuando el usuario abre el modal por primera vez.
const CalEmbed = lazy(async () => {
  const [{ default: Cal }, { getCalApi }] = await Promise.all([
    import('@calcom/embed-react'),
    import('@calcom/embed-react'),
  ])

  // Configurar theme la primera vez que el SDK se carga
  ;(async () => {
    const cal = await getCalApi({ namespace: '30min' })
    cal('ui', {
      theme: 'dark',
      cssVarsPerTheme: {
        dark: {
          'cal-brand':            '#63D7FF',
          'cal-bg':               '#05070B',
          'cal-bg-emphasis':      '#0C1017',
          'cal-bg-muted':         '#0A0E15',
          'cal-text':             '#F5F7FA',
          'cal-text-emphasis':    '#FFFFFF',
          'cal-text-muted':       '#97A3B6',
          'cal-border':           'rgba(255,255,255,0.08)',
          'cal-border-emphasis':  'rgba(255,255,255,0.16)',
        },
        light: { 'cal-brand': '#63D7FF' },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    })
  })()

  return {
    default: ({ calLink }: { calLink: string }) => (
      <Cal
        namespace="30min"
        calLink={calLink}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        config={{ layout: 'month_view', theme: 'dark' }}
      />
    ),
  }
})

const CAL_USERNAME = 'vladislav-marinovich'
const CAL_EVENT    = '30min'

export function CalcomModal() {
  const isOpen   = useUIStore((s) => s.calcomOpen)
  const closeCal = useUIStore((s) => s.setCalcomOpen)
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false)

  // Solo montar el embed después de que el usuario haya abierto el modal una vez
  useEffect(() => {
    if (isOpen) setHasOpenedOnce(true)
  }, [isOpen])

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeCal])

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => closeCal(false)}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-[71] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="relative w-full max-w-5xl h-[88vh] bg-surface border border-white/[0.08] rounded-md overflow-hidden pointer-events-auto shadow-2xl">

              {/* Header del modal */}
              <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 py-4 bg-surface/95 backdrop-blur-md border-b border-white/[0.06]">
                <p className="font-mono text-xs tracking-[0.22em] text-textSecondary/60 uppercase">
                  Agenda · 30 min · Vlad Marinovich
                </p>
                <button
                  onClick={() => closeCal(false)}
                  className="flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-textSecondary hover:text-textPrimary transition-colors uppercase"
                  aria-label="Cerrar agenda"
                >
                  <span>Cerrar</span>
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>

              {/* Cal embed — lazy, solo se monta después de la primera apertura */}
              <div className="absolute inset-0 pt-14">
                {hasOpenedOnce && (
                  <Suspense fallback={<div className="flex items-center justify-center h-full font-mono text-xs tracking-[0.22em] text-textSecondary/40 uppercase">Cargando agenda…</div>}>
                    <CalEmbed calLink={`${CAL_USERNAME}/${CAL_EVENT}`} />
                  </Suspense>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
