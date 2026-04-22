/**
 * Hook que detecta la preferencia de movimiento reducido del sistema.
 *
 * Retorna `true` si el usuario tiene activada la opción
 * "Reducir movimiento" en su sistema operativo.
 *
 * Escucha cambios en tiempo real — si el usuario activa/desactiva
 * la preferencia mientras navega, el valor se actualiza.
 */

import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Actualiza el estado con el valor actual de la media query
    const onChange = () => setReduced(media.matches)
    onChange() // Evaluar al montar

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
