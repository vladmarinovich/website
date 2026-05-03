/**
 * ScrollProgress — barra de progreso de scroll en la parte superior.
 *
 * Línea de 1px en accent-cyan que crece de 0% a 100% de ancho
 * a medida que el usuario avanza por la página.
 *
 * z-index 999 — por encima de todo excepto cursor y modales.
 * No visible en hero (aparece al superar el primer 5% de scroll).
 * Respeta prefers-reduced-motion.
 */

import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Aparecer suave pasado el 3% de scroll
  const opacity = useTransform(scrollYProgress, [0.03, 0.07], [0, 1])

  if (reduced) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        transformOrigin: 'left',
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, #63D7FF 0%, #8C7BFF 55%, #63D7FF 100%)',
        opacity,
        zIndex: 999,
        pointerEvents: 'none',
      }}
    />
  )
}
