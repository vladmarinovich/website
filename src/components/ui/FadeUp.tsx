/**
 * Componente de animación de entrada — fade + slide hacia arriba.
 *
 * Usa Framer Motion whileInView + viewport.once=true para que
 * la animación se dispare una sola vez al entrar en el viewport.
 * margin="-60px" previene que la animación se active demasiado pronto.
 *
 * Props:
 *  - delay     → retraso en segundos (para stagger manual entre elementos)
 *  - className → clases CSS del wrapper (preserva layout del padre)
 */

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeUpProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.65,
        ease: [0.25, 0.4, 0.25, 1],  // ease-out cúbico suave
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
