/**
 * CustomCursor — dot + ring con masa y delay.
 *
 * Dot (8px): sigue el cursor exacto, sin lag.
 * Ring (28px): sigue con delay (~80ms de masa) — da sensación de peso.
 *
 * Estados:
 *  - default:  dot visible, ring normal
 *  - hover:    dot desaparece, ring se expande a 44px
 *  - canvas:   ring cambia al color activo de la escena (cyan/purple/etc.)
 *  - clicking: ring se contrae brevemente (feedback táctil)
 *
 * Solo en desktop (pointer: fine). En touch/mobile: oculto.
 * Respeta prefers-reduced-motion: desactivado completamente.
 */

import { useEffect, useRef, useState } from 'react'
import { useSceneStore } from '@/store/sceneStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const SCENE_COLORS: Record<string, string> = {
  cyan:    '#4DD9E6',
  purple:  '#9A7CFF',
  orange:  '#FFB066',
  neutral: '#6A7A8F',
  white:   '#F5F7FA',
}

type CursorState = 'default' | 'hover' | 'clicking'

export function CustomCursor() {
  const reduced    = useReducedMotion()
  const colorMode  = useSceneStore((s) => s.colorMode)

  const dotRef     = useRef<HTMLDivElement>(null)
  const ringRef    = useRef<HTMLDivElement>(null)

  const pos        = useRef({ x: -100, y: -100 })
  const ringPos    = useRef({ x: -100, y: -100 })
  const rafId      = useRef<number>(0)
  const [state, setState] = useState<CursorState>('default')

  // Detectar si el dispositivo tiene puntero fino (mouse/trackpad)
  const hasFinePointer = typeof window !== 'undefined'
    ? window.matchMedia('(pointer: fine)').matches
    : false

  useEffect(() => {
    if (reduced || !hasFinePointer) return

    // Ocultar cursor nativo
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onDown = () => setState('clicking')
    const onUp   = () => setState((s) => s === 'clicking' ? 'default' : s)

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], [tabindex]')) {
        setState('hover')
      }
    }

    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], [tabindex]')) {
        setState((s) => s === 'hover' ? 'default' : s)
      }
    }

    // RAF loop — dot exacto, ring con lerp (masa)
    const LERP = 0.12
    const tick = () => {
      if (dotRef.current && ringRef.current) {
        // Dot: posición exacta
        dotRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`

        // Ring: lerp hacia pos.current
        ringPos.current.x += (pos.current.x - ringPos.current.x) * LERP
        ringPos.current.y += (pos.current.y - ringPos.current.y) * LERP
        ringRef.current.style.transform =
          `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    document.addEventListener('mousemove',  onMove)
    document.addEventListener('mousedown',  onDown)
    document.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseover',  onEnter)
    document.addEventListener('mouseout',   onLeave)

    return () => {
      document.documentElement.style.cursor = ''
      cancelAnimationFrame(rafId.current)
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mousedown',  onDown)
      document.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseover',  onEnter)
      document.removeEventListener('mouseout',   onLeave)
    }
  }, [reduced, hasFinePointer])

  if (reduced || !hasFinePointer) return null

  const ringColor = SCENE_COLORS[colorMode] ?? '#F5F7FA'

  // Tamaño y opacidad del ring según estado
  const ringSize    = state === 'hover'    ? 44
                    : state === 'clicking' ? 20
                    : 28
  const dotOpacity  = state === 'hover'    ? 0 : 1
  const ringOpacity = 0.7

  return (
    <>
      {/* Dot — exacto, sin delay */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          width:           8,
          height:          8,
          borderRadius:    '50%',
          background:      '#F5F7FA',
          opacity:         dotOpacity,
          pointerEvents:   'none',
          zIndex:          9999,
          transition:      'opacity 0.18s ease',
          willChange:      'transform',
        }}
      />

      {/* Ring — con masa (lerp) */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          width:           ringSize,
          height:          ringSize,
          borderRadius:    '50%',
          border:          `1px solid ${ringColor}`,
          opacity:         ringOpacity,
          pointerEvents:   'none',
          zIndex:          9999,
          transition:      'width 0.22s ease, height 0.22s ease, opacity 0.22s ease, border-color 0.45s ease',
          willChange:      'transform',
        }}
      />
    </>
  )
}
