/**
 * Hook de opacidad para secciones — fade in al entrar, fade out al salir.
 *
 * Mientras el tunnel 3D sigue animándose en el fondo (z-0, fixed),
 * cada sección aparece y desaparece suavemente sobre él.
 *
 * Rangos de scrollYProgress (relativo a la sección, offset start→end):
 *  0.00 → 0.10  opacidad 0 → 1  (sección entra por abajo)
 *  0.10 → 0.82  opacidad 1      (sección completamente visible)
 *  0.82 → 1.00  opacidad 1 → 0  (sección sale por arriba)
 *
 * Si prefers-reduced-motion: reduce, mantener opacidad 1 estático.
 */

import { type RefObject } from 'react'
import { useScroll, useTransform, useMotionValue, type MotionValue } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'

export function useSectionOpacity(
  ref: RefObject<HTMLElement | null>
): MotionValue<number> {
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Rango ajustado: la sección domina más tiempo el viewport
  // y los cruces son más breves. Se siente "gravitacional",
  // no "desvanecido".
  const animated = useTransform(
    scrollYProgress,
    [0.04, 0.18, 0.78, 0.96],
    [0,    1,    1,    0   ]
  )

  const staticOne = useMotionValue(1)

  return reduced ? staticOne : animated
}
