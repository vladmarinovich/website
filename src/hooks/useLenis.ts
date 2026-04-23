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
import { useCaseStore } from '@/store/caseStore'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    // Pausar/reanudar Lenis cuando el overlay de casos abre o cierra.
    // Sin esto, Lenis intercepta el scroll del window y el overlay
    // no puede hacer scroll de su propio contenido.
    const unsubscribe = useCaseStore.subscribe(
      (state) => {
        if (state.isCaseOpen) lenis.stop()
        else lenis.start()
      }
    )

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      unsubscribe()
    }
  }, [])
}
