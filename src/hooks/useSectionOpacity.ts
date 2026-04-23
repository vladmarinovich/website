/**
 * Hook de opacidad para secciones — fade in al entrar, fade out al salir.
 *
 * Mientras el tunnel 3D sigue animándose en el fondo (z-0, fixed),
 * cada sección aparece y desaparece suavemente sobre él.
 *
 * El resultado es que entre secciones el tunnel es visible brevemente —
 * como si el contenido "flotara" sobre el corredor.
 *
 * Rangos de scrollYProgress (relativo a la sección, offset start→end):
 *  0.00 → 0.10  opacidad 0 → 1  (sección entra por abajo)
 *  0.10 → 0.82  opacidad 1      (sección completamente visible)
 *  0.82 → 1.00  opacidad 1 → 0  (sección sale por arriba)
 */

import { type RefObject } from 'react'
import { useScroll, useTransform, type MotionValue } from 'framer-motion'

export function useSectionOpacity(
  ref: RefObject<HTMLElement | null>
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return useTransform(
    scrollYProgress,
    [0, 0.10, 0.82, 1.0],
    [0,  1,    1,    0  ]
  )
}
