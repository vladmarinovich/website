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
  setDeviceTier: (tier: DeviceTier) => void
  setReducedMotion: (value: boolean) => void
  setNavVisible: (value: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  // Asumimos dispositivo de alta gama hasta que el hook detecte lo contrario
  deviceTier: 'high',
  reducedMotion: false,
  navVisible: true,

  setDeviceTier:    (tier)  => set({ deviceTier: tier }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setNavVisible:    (value) => set({ navVisible: value }),
}))
