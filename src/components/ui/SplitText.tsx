/**
 * SplitText — revela texto palabra por palabra con stagger.
 *
 * Cada palabra se envuelve en un contenedor con overflow:hidden
 * y entra desde abajo (y: 100% → 0) con delay escalonado.
 * El resultado: las palabras "caen" en lugar de fundirse — más
 * cinematográfico que un FadeUp de bloque.
 *
 * Uso:
 *   <SplitText delay={0.18} stagger={0.04} className="...">
 *     Tu título aquí
 *   </SplitText>
 *
 * Respeta prefers-reduced-motion: si está activo, renderiza el
 * texto plano sin ninguna animación.
 */

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const CINEMATIC_EASE: [number, number, number, number] = [0.2, 0.65, 0.25, 1]

interface SplitTextProps {
  children: string
  className?: string
  delay?: number    // delay inicial antes del primer word
  stagger?: number  // delay entre cada word (default 0.04s)
  duration?: number // duración por word (default 0.7s)
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function SplitText({
  children,
  className,
  delay = 0,
  stagger = 0.04,
  duration = 0.7,
  as: Tag = 'h2',
}: SplitTextProps) {
  const reduced = useReducedMotion()
  const words   = children.split(' ')

  if (reduced) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.28em' }}
      aria-label={children}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 'inherit' }}
          aria-hidden="true"
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '105%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration,
              ease: CINEMATIC_EASE,
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
