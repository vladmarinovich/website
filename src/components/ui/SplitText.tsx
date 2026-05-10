/**
 * SplitText — revela texto palabra por palabra usando variants.
 *
 * Patrón canónico Framer Motion:
 *   contenedor (motion.div) con whileInView + staggerChildren
 *   hijos (motion.span) con variants — heredan el stagger
 *
 * Esto evita el bug de whileInView en hijos individuales.
 */

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE: [number, number, number, number] = [0.2, 0.65, 0.25, 1]

interface SplitTextProps {
  children: string
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
}

export function SplitText({
  children,
  className,
  delay = 0,
  stagger = 0.05,
  duration = 0.75,
  as: Tag = 'h2',
}: SplitTextProps) {
  const reduced = useReducedMotion()
  const words   = children.split(' ')

  if (reduced) {
    return <Tag className={className}>{children}</Tag>
  }

  const container: Variants = {
    hidden:  {},
    visible: {
      transition: {
        delayChildren:   delay,
        staggerChildren: stagger,
      },
    },
  }

  const child: Variants = {
    hidden:  { y: 14, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration, ease: EASE },
    },
  }

  const MotionTag = motion[Tag]

  return (
    <MotionTag
      className={className}
      aria-label={children}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          style={{ display: 'inline-block', marginRight: '0.28em' }}
          variants={child}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  )
}
