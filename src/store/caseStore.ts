/**
 * Store de Zustand para el panel expandido de casos de estudio.
 *
 * Controla qué caso está abierto y si el overlay editorial
 * está visible. openCase() y closeCase() son las únicas
 * mutaciones necesarias desde la UI.
 */

import { create } from 'zustand'

type CaseStore = {
  activeCaseId: string | null  // ID del caso activo (null = ninguno)
  isCaseOpen: boolean          // Visibilidad del panel overlay
  openCase: (id: string) => void
  closeCase: () => void
}

export const useCaseStore = create<CaseStore>((set) => ({
  activeCaseId: null,
  isCaseOpen: false,

  // Abre el panel con el caso dado
  openCase:  (id) => set({ activeCaseId: id, isCaseOpen: true }),
  // Cierra el panel y limpia el caso activo
  closeCase: ()   => set({ activeCaseId: null, isCaseOpen: false }),
}))
