/**
 * Hook que traduce la posición de scroll a un valor normalizado (0–1)
 * y lo escribe en sceneStore.progress.
 *
 * La escena 3D lee este valor en useFrame() sin pasar por React,
 * lo que evita re-renders en cada evento de scroll.
 *
 * Offset del hero (Fase 3+):
 *  El hero vive en un contenedor de 250vh (150vh de scroll range pineado).
 *  Durante esos primeros 150vh la cámara NO debe moverse — el usuario está
 *  dentro del portal de entrada. El progreso empieza a contar solo después
 *  de que el hero se desvanece completamente.
 *
 *  HERO_SCROLL_OFFSET = 150vh (en px calculados en tiempo real)
 *  El rango de la cámara es: [HERO_OFFSET, maxScroll] → [0, 1]
 */

import { useEffect } from 'react'
import { useSceneStore } from '@/store/sceneStore'

// El hero es 250vh alto, la parte sticky es 100vh → offset de scroll = 150vh
// Se calcula dinámicamente para soportar distintas alturas de pantalla.
const getHeroOffset = () => window.innerHeight * 1.5

export function useScrollProgress() {
  const setProgress = useSceneStore((s) => s.setProgress)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop    = window.scrollY
      const maxScroll    = document.body.scrollHeight - window.innerHeight
      const heroOffset   = getHeroOffset()

      // Rango efectivo de la cámara: empieza después del hero
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
