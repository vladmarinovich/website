/**
 * Hook que inicializa Lenis para scroll suavizado.
 *
 * Lenis intercepta el scroll nativo y lo re-emite con
 * easing y duración configurados. El RAF loop se mantiene
 * activo durante toda la vida del componente y se destruye
 * limpiamente al desmontar.
 *
 * duration: 1.1s — suave pero sin ser lento
 */

import { useEffect } from 'react'
import Lenis from 'lenis'

export function useLenis() {
  useEffect(() => {
    // Instancia Lenis con scroll suave en rueda del mouse
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    // Loop de animación — Lenis necesita raf() en cada frame
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Limpieza al desmontar el componente
    return () => { lenis.destroy() }
  }, [])
}
