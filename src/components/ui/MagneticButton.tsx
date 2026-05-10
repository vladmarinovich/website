/**
 * MagneticButton — atrae el cursor cuando está dentro del umbral.
 *
 * Usa document.mousemove para detectar el cursor incluso cuando
 * está FUERA del elemento (el campo magnético se extiende más allá).
 * Al salir del radio, spring suave de vuelta a origen.
 *
 * Solo en pointer:fine. En touch: wrapper transparente sin efecto.
 * Respeta prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  threshold?: number
  strength?: number
  href?: string
  onClick?: (e?: React.MouseEvent) => void
}

const SPRING_CFG = { stiffness: 200, damping: 24, mass: 0.5 }

export function MagneticButton({
  children,
  className,
  threshold = 80,
  strength = 0.38,
  href,
  onClick,
}: MagneticButtonProps) {
  const reduced       = useReducedMotion()
  const ref           = useRef<HTMLAnchorElement>(null)
  const rawX          = useMotionValue(0)
  const rawY          = useMotionValue(0)
  const x             = useSpring(rawX, SPRING_CFG)
  const y             = useSpring(rawY, SPRING_CFG)

  const hasFine = typeof window !== 'undefined'
    ? window.matchMedia('(pointer: fine)').matches
    : false

  useEffect(() => {
    if (reduced || !hasFine) return

    const onMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect   = ref.current.getBoundingClientRect()
      const cx     = rect.left + rect.width  / 2
      const cy     = rect.top  + rect.height / 2
      const dx     = e.clientX - cx
      const dy     = e.clientY - cy
      const dist   = Math.sqrt(dx * dx + dy * dy)
      const radius = Math.max(rect.width, rect.height) / 2 + threshold

      if (dist < radius) {
        rawX.set(dx * strength)
        rawY.set(dy * strength)
      } else {
        rawX.set(0)
        rawY.set(0)
      }
    }

    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [reduced, hasFine, threshold, strength, rawX, rawY])

  if (reduced || !hasFine) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onClick={onClick}
      style={{ x, y, display: 'inline-flex' }}
    >
      {children}
    </motion.a>
  )
}
