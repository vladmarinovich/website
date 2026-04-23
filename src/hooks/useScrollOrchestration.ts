/**
 * Hook principal de orquestación de scroll → escena 3D.
 *
 * Reemplaza a useSectionMode con una versión más completa:
 * además del colorMode, también escribe tunnelIntensity,
 * bloomStrength y contactBurstProgress al sceneStore.
 *
 * Dos efectos independientes:
 *  1. IntersectionObserver → detecta la sección visible y
 *     aplica el estado completo de escena correspondiente.
 *  2. Listener de scroll → calcula el progreso dentro de la
 *     sección contact para activar el burst blanco gradualmente.
 */

import { useEffect } from 'react'
import { useSceneStore } from '@/store/sceneStore'
import { SECTION_RANGES } from '@/lib/sectionRanges'
import type { ColorMode, SceneSection } from '@/types/scene'

/**
 * Estado completo de escena por sección.
 *
 * tunnelIntensity: qué tan "viva" está la escena (anillos, luz ambiental)
 *   — disminuye a medida que el usuario baja, oscureciendo el corredor.
 *
 * bloomStrength: intensidad del efecto bloom en postprocesado
 *   — sube al llegar a contact para el burst de luz blanca.
 */
// Curva de atenuación fuerte — el brief pide "presencia tenue en la
// parte media". Los anillos nunca deben dominar el frame cuando el
// contenido está entrando/saliendo: cyan del hero es el pico, luego
// el túnel se retira para que el contenido narre.
const SECTION_STATES: Record<SceneSection, {
  color: ColorMode
  tunnelIntensity: number
  bloomStrength: number
}> = {
  hero:         { color: 'cyan',    tunnelIntensity: 1.00, bloomStrength: 0.85 },
  evidence:     { color: 'cyan',    tunnelIntensity: 0.45, bloomStrength: 0.45 },
  capabilities: { color: 'purple',  tunnelIntensity: 0.35, bloomStrength: 0.35 },
  thinking:     { color: 'neutral', tunnelIntensity: 0.22, bloomStrength: 0.25 },
  about:        { color: 'orange',  tunnelIntensity: 0.18, bloomStrength: 0.22 },
  standards:    { color: 'neutral', tunnelIntensity: 0.12, bloomStrength: 0.18 },
  contact:      { color: 'white',   tunnelIntensity: 0.00, bloomStrength: 1.80 },
}

export function useScrollOrchestration() {
  const setColorMode            = useSceneStore((s) => s.setColorMode)
  const setActiveSection        = useSceneStore((s) => s.setActiveSection)
  const setTunnelIntensity      = useSceneStore((s) => s.setTunnelIntensity)
  const setBloomStrength        = useSceneStore((s) => s.setBloomStrength)
  const setContactBurstProgress = useSceneStore((s) => s.setContactBurstProgress)

  /* ── Efecto 1: sección activa → estado de escena completo ── */
  useEffect(() => {
    const sections = Object.keys(SECTION_STATES) as SceneSection[]

    const observer = new IntersectionObserver(
      (entries) => {
        // Elegir la sección con mayor ratio de intersección visible
        let bestId: string | null = null
        let bestRatio = 0
        entries.forEach((e) => {
          if (e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio
            bestId = e.target.id
          }
        })

        if (bestId) {
          const state = SECTION_STATES[bestId as SceneSection]
          if (state) {
            setColorMode(state.color)
            setActiveSection(bestId as SceneSection)
            setTunnelIntensity(state.tunnelIntensity)
            setBloomStrength(state.bloomStrength)
          }
        }
      },
      // Dos umbrales: uno para detección temprana, otro para confirmación
      { threshold: [0.15, 0.4] }
    )

    // Delay mínimo para garantizar que el DOM esté completamente pintado
    const timer = setTimeout(() => {
      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 200)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [setColorMode, setActiveSection, setTunnelIntensity, setBloomStrength])

  /* ── Efecto 2: progreso dentro de contact → burst blanco ── */
  useEffect(() => {
    const [start, end] = SECTION_RANGES.contact

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      if (maxScroll <= 0) return

      // Progreso dentro del rango [start, end] normalizado a 0–1
      const global = scrollTop / maxScroll
      const burst  = Math.max(0, Math.min(1, (global - start) / (end - start)))
      setContactBurstProgress(burst)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Calcular estado inicial antes del primer scroll de usuario
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [setContactBurstProgress])
}
