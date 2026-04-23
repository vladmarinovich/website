/**
 * Preloader — pantalla negra con la firma mientras carga el canvas 3D.
 *
 * Se monta sobre todo (z-60). Desaparece con fade-out cuando SceneCanvas
 * emite onCreated (uiStore.sceneReady = true). Tiene un timeout de 4s
 * como fallback por si WebGL tarda o falla silenciosamente.
 *
 * Si prefers-reduced-motion: desaparece inmediatamente sin animación.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/uiStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE: [number, number, number, number] = [0.2, 0.65, 0.25, 1]
const FALLBACK_MS = 4000

export function Preloader() {
  const sceneReady = useUIStore((s) => s.sceneReady)
  const reduced    = useReducedMotion()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (reduced) { setVisible(false); return }

    // Esperar al menos 600ms para que el preloader no sea un flash
    let ready = false

    const tryHide = () => {
      if (!ready) return
      setVisible(false)
    }

    const minTimer = setTimeout(() => {
      ready = true
      if (sceneReady) tryHide()
    }, 600)

    // Fallback: esconder aunque el canvas no haya confirmado
    const fallback = setTimeout(() => setVisible(false), FALLBACK_MS)

    return () => { clearTimeout(minTimer); clearTimeout(fallback) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Cuando sceneReady cambia a true después del mount
  useEffect(() => {
    if (sceneReady && !reduced) {
      const t = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(t)
    }
  }, [sceneReady, reduced])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
          style={{ background: '#05070B' }}
          aria-hidden="true"
        >
          {/* Firma */}
          <motion.img
            src="/assets/images/logo-vlad.svg"
            alt=""
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.88, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="h-16 md:h-20 w-auto invert"
            draggable={false}
          />

          {/* Línea de progreso — decorativa, indica que algo está cargando */}
          <motion.div
            className="mt-10 h-px bg-white/10 overflow-hidden"
            style={{ width: 80 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-white/40"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.4,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: 0.2,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
