/**
 * Hook que traduce la posición de scroll a un valor normalizado (0–1)
 * y lo escribe en sceneStore.progress.
 *
 * La escena 3D lee este valor en useFrame() sin pasar por React,
 * lo que evita re-renders en cada evento de scroll.
 *
 * También escucha resize para recalcular maxScroll cuando
 * el alto del documento cambia (ej: carga de imágenes).
 */

import { useEffect } from 'react'
import { useSceneStore } from '@/store/sceneStore'

export function useScrollProgress() {
  const setProgress = useSceneStore((s) => s.setProgress)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop  = window.scrollY
      const maxScroll  = document.body.scrollHeight - window.innerHeight
      // Normaliza a 0–1, protegido contra divisiones por cero
      const progress   = maxScroll > 0 ? scrollTop / maxScroll : 0
      setProgress(Math.max(0, Math.min(1, progress)))
    }

    // Calcular el progreso inicial antes del primer scroll
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [setProgress])
}
