/**
 * Hook que detecta el tier de rendimiento del dispositivo
 * y lo escribe en uiStore.deviceTier.
 *
 * Criterios:
 *  - low    → RAM ≤ 2 GB o pantalla < 768px
 *  - medium → RAM ≤ 4 GB
 *  - high   → RAM > 4 GB
 *
 * deviceMemory es una API experimental no disponible en todos los
 * navegadores — fallback a 4 GB si no está presente.
 */

import { useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'

export function useDeviceTier() {
  const setDeviceTier = useUIStore((s) => s.setDeviceTier)

  useEffect(() => {
    // Leer RAM del dispositivo (API experimental, no siempre disponible)
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
    const width  = window.innerWidth

    if (memory <= 2 || width < 768) {
      setDeviceTier('low')       // Móviles o dispositivos con poca RAM
    } else if (memory <= 4) {
      setDeviceTier('medium')    // Gama media
    } else {
      setDeviceTier('high')      // Desktop / gama alta
    }
  }, [setDeviceTier])
}
