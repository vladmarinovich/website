/**
 * Store de Zustand para el estado de la interfaz y accesibilidad.
 *
 * deviceTier    — tier del dispositivo (high/medium/low)
 *                 detectado por useDeviceTier hook al montar
 * reducedMotion — respeta prefers-reduced-motion del sistema
 * navVisible    — controla la visibilidad del header de navegación
 */

import { create } from 'zustand'
import type { DeviceTier } from '@/types/scene'

type UIStore = {
  deviceTier: DeviceTier
  reducedMotion: boolean
  navVisible: boolean
  sceneReady: boolean
  setDeviceTier: (tier: DeviceTier) => void
  setReducedMotion: (value: boolean) => void
  setNavVisible: (value: boolean) => void
  setSceneReady: (value: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  deviceTier: 'high',
  reducedMotion: false,
  navVisible: true,
  sceneReady: false,

  setDeviceTier:    (tier)  => set({ deviceTier: tier }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setNavVisible:    (value) => set({ navVisible: value }),
  setSceneReady:    (value) => set({ sceneReady: value }),
}))
