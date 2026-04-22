/**
 * Hook que traduce la posición de scroll a un valor normalizado (0–1)
 * y lo escribe en sceneStore.progress.
 *
 * La escena 3D lee este valor en useFrame() sin pasar por React,
 * lo que evita re-renders en cada evento de scroll.
 *
 * Offset del hero:
 *  El hero ocupa 100vh de altura en el documento. Durante ese primer
 *  100vh la cámara no debe moverse — el usuario está viendo el portal
 *  de entrada. La cámara empieza a avanzar solo después de que el hero
 *  se disuelve y Evidence entra al viewport.
 *
 *  getHeroOffset() devuelve 1 × viewport height en píxeles.
 *  El rango efectivo de la cámara: [heroOffset, maxScroll] → [0, 1]
 */

import { useEffect } from 'react'
import { useSceneStore } from '@/store/sceneStore'

// El hero ocupa 100vh pero la cámara empieza a moverse antes (0.7×)
// para que el tunnel ya esté vivo mientras el hero se termina de disolver.
const getHeroOffset = () => window.innerHeight * 0.7

export function useScrollProgress() {
  const setProgress = useSceneStore((s) => s.setProgress)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop  = window.scrollY
      const maxScroll  = document.body.scrollHeight - window.innerHeight
      const heroOffset = getHeroOffset()

      // La cámara empieza a moverse después del hero
      const effectiveTop = Math.max(0, scrollTop - heroOffset)
      const effectiveMax = Math.max(1, maxScroll - heroOffset)
      const progress     = effectiveTop / effectiveMax

      setProgress(Math.max(0, Math.min(1, progress)))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [setProgress])
}
