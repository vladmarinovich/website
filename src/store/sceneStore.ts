/**
 * Store global de Zustand para el estado de la escena 3D.
 *
 * Se lee dentro de useFrame() usando getState() para evitar
 * re-renders de React en cada frame de animación.
 *
 * Valores controlados:
 *  - progress               → progreso de scroll normalizado (0–1)
 *  - activeSection          → sección actualmente visible
 *  - colorMode              → paleta de acento activa
 *  - tunnelIntensity        → intensidad de luz interna del corredor
 *  - bloomStrength          → fuerza del efecto bloom en postprocesado
 *  - contactBurstProgress   → progreso de la animación de burst en Contact
 *  - heroTransitionProgress → 0→1 durante el fade del hero (0.55vh→1.0vh)
 *                             Dispara el dive de la cámara y expansión del FOV
 */

import { create } from 'zustand'
import type { ColorMode, SceneSection } from '@/types/scene'

type SceneStore = {
  progress: number
  activeSection: SceneSection
  colorMode: ColorMode
  tunnelIntensity: number
  bloomStrength: number
  contactBurstProgress: number
  heroTransitionProgress: number
  setProgress: (value: number) => void
  setActiveSection: (section: SceneSection) => void
  setColorMode: (mode: ColorMode) => void
  setTunnelIntensity: (value: number) => void
  setBloomStrength: (value: number) => void
  setContactBurstProgress: (value: number) => void
  setHeroTransitionProgress: (value: number) => void
}

export const useSceneStore = create<SceneStore>((set) => ({
  progress: 0,
  activeSection: 'hero',
  colorMode: 'cyan',
  tunnelIntensity: 1,
  bloomStrength: 0.8,
  contactBurstProgress: 0,
  heroTransitionProgress: 0,

  setProgress:               (value)   => set({ progress: value }),
  setActiveSection:          (section) => set({ activeSection: section }),
  setColorMode:              (mode)    => set({ colorMode: mode }),
  setTunnelIntensity:        (value)   => set({ tunnelIntensity: value }),
  setBloomStrength:          (value)   => set({ bloomStrength: value }),
  setContactBurstProgress:   (value)   => set({ contactBurstProgress: value }),
  setHeroTransitionProgress: (value)   => set({ heroTransitionProgress: value }),
}))
