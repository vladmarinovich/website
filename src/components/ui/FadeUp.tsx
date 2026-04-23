/**
 * Componente de animación de entrada con jerarquía tipográfica.
 *
 * Cuatro variantes calibradas para que el peso del motion coincida
 * con el peso tipográfico — los H2 aterrizan, los cuerpos respiran,
 * los eyebrows se asientan rápido.
 *
 *  - eyebrow → y:8,  0.5s   (mono cap, entra asentado)
 *  - title   → y:32, 0.95s  con blur 6px→0 (cinematográfico, pesa)
 *  - body    → y:14, 0.6s
 *  - list    → y:10, 0.55s  (para items en stagger)
 *
 * Respeta prefers-reduced-motion: si está activo, renderiza sin animar.
 *
 * Retrocompatibilidad: sin la prop `kind` se comporta como el FadeUp
 * original (y:22, 0.65s) — no rompe código existente.
 */

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type RevealKind = 'eyebrow' | 'title' | 'body' | 'list' | 'default'

const PRESETS: Record<RevealKind, {
  y: number
  duration: number
  blur?: number
}> = {
  eyebrow: { y: 8,  duration: 0.5  },
  title:   { y: 32, duration: 0.95, blur: 6 },
  body:    { y: 14, duration: 0.6  },
  list:    { y: 10, duration: 0.55 },
  default: { y: 22, duration: 0.65 },
}

// Ease cinematográfico — inicio lento, asentamiento largo al final.
// Transmite masa y gravedad. Nada elástico.
const CINEMATIC_EASE: [number, number, number, number] = [0.2, 0.65, 0.25, 1]

interface FadeUpProps {
  children: ReactNode
  delay?: number
  className?: string
  kind?: RevealKind
}

export function FadeUp({
  children,
  delay = 0,
  className,
  kind = 'default',
}: FadeUpProps) {
  const reduced = useReducedMotion()
  const preset  = PRESETS[kind]

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  const initial = preset.blur
    ? { opacity: 0, y: preset.y, filter: `blur(${preset.blur}px)` }
    : { opacity: 0, y: preset.y }

  const animate = preset.blur
    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
    : { opacity: 1, y: 0 }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: preset.duration,
        ease: CINEMATIC_EASE,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

// Alias semántico — para quien prefiera leer `<Reveal kind="title">`
export const Reveal = FadeUp
