/**
 * MagneticButton — atrae el cursor cuando está dentro del umbral.
 *
 * Dentro de `threshold` px del borde, el elemento se desplaza hacia
 * el cursor con una fuerza proporcional a la distancia (lerp).
 * Al salir, vuelve a origen con spring suave.
 *
 * Solo activo en pointer:fine (mouse). En touch: se comporta como
 * un wrapper transparente sin efectos.
 * Respeta prefers-reduced-motion.
 */

import { useRef, useState, useCallback } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  threshold?: number   // px desde el borde donde empieza la atracción
  strength?: number    // 0-1, cuánto se mueve el elemento (default 0.35)
  as?: 'a' | 'button'
  href?: string
  onClick?: () => void
}

const SPRING = { stiffness: 180, damping: 22, mass: 0.6 }

export function MagneticButton({
  children,
  className,
  threshold = 80,
  strength = 0.35,
  as: Tag = 'a',
  href,
  onClick,
}: MagneticButtonProps) {
  const reduced       = useReducedMotion()
  const ref           = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return
    const rect   = ref.current.getBoundingClientRect()
    const cx     = rect.left + rect.width  / 2
    const cy     = rect.top  + rect.height / 2
    const dx     = e.clientX - cx
    const dy     = e.clientY - cy
    const dist   = Math.sqrt(dx * dx + dy * dy)
    const radius = Math.max(rect.width, rect.height) / 2 + threshold

    if (dist < radius) {
      if (!active) setActive(true)
      rawX.set(dx * strength)
      rawY.set(dy * strength)
    } else {
      if (active) {
        setActive(false)
        rawX.set(0)
        rawY.set(0)
      }
    }
  }, [reduced, active, threshold, strength, rawX, rawY])

  const onMouseLeave = useCallback(() => {
    setActive(false)
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  if (reduced) {
    return Tag === 'a'
      ? <a href={href} className={className} onClick={onClick}>{children}</a>
      : <button className={className} onClick={onClick}>{children}</button>
  }

  const inner = Tag === 'a'
    ? <a href={href} className={className} onClick={onClick}>{children}</a>
    : <button className={className} onClick={onClick}>{children}</button>

  return (
    <div
      ref={ref}
      style={{ display: 'inline-block', position: 'relative' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        style={{ x, y }}
      >
        {inner}
      </motion.div>
    </div>
  )
}
