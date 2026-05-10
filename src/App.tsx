/**
 * Raíz de la aplicación.
 *
 * Capas fijas en orden de z-index:
 *  z-0  → SceneCanvas     (tunnel 3D, siempre presente)
 *  z-1  → HeroLayers      (fondo del hero, se disuelve al scrollear)
 *  z-5  → ContactBurstOverlay (halo blanco al llegar a contact)
 *  z-10 → BaseLayout      (todo el contenido HTML)
 *
 * HeroLayers está FUERA de BaseLayout para que su position:fixed
 * opere en el contexto raíz y nunca "suba" con el scroll.
 *
 * Hooks globales (AppInner):
 *  1. useLenis               → scroll suavizado
 *  2. useScrollProgress      → progreso 0–1 al sceneStore
 *  3. useDeviceTier          → tier del dispositivo al uiStore
 *  4. useScrollOrchestration → sección activa + estado completo de escena
 */

import { lazy, Suspense } from 'react'
import BaseLayout from '@/components/layout/BaseLayout'
import { SceneErrorBoundary } from '@/components/scene/SceneErrorBoundary'
const SceneCanvas = lazy(() => import('@/components/scene/SceneCanvas'))
import HeroLayers from '@/components/hero/HeroLayers'
import Hero from '@/components/sections/Hero'
import Evidence from '@/components/sections/Evidence'
import Capabilities from '@/components/sections/Capabilities'
import Thinking from '@/components/sections/Thinking'
import About from '@/components/sections/About'
import Standards from '@/components/sections/Standards'
import Contact from '@/components/sections/Contact'
import { CaseOverlay } from '@/components/cases/CaseOverlay'
import { Preloader } from '@/components/ui/Preloader'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { CalcomModal } from '@/components/ui/CalcomModal'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { useLenis } from '@/hooks/useLenis'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useDeviceTier } from '@/hooks/useDeviceTier'
import { useScrollOrchestration } from '@/hooks/useScrollOrchestration'

// ContactBurstOverlay removido — ya no hay zoom blanco final.
// El sceneStore.contactBurstProgress sigue calculándose en useScrollOrchestration
// pero ya no lo consume nadie. Se deja para uso futuro (e.g. modular si
// queremos un sutil glow al llegar al cierre).

/* ── AppInner ────────────────────────────────────────────── */
function AppInner() {
  useLenis()
  useScrollProgress()
  useDeviceTier()
  useScrollOrchestration()

  return (
    <>
      {/* z-0 — tunnel 3D de fondo (lazy + error boundary: si WebGL falla, fondo sólido) */}
      <SceneErrorBoundary>
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
      </SceneErrorBoundary>

      {/* z-1 — fondo del hero, fixed, se disuelve con scroll */}
      <HeroLayers />

      {/* z-10 — todo el contenido HTML */}
      <BaseLayout>
        <Hero />
        <Evidence />
        <Capabilities />
        <Thinking />
        <About />
        <Standards />
        <Contact />
      </BaseLayout>

      {/* z-40/50 — overlay editorial de casos (fixed, fuera del layout) */}
      <CaseOverlay />

      {/* z-60 — preloader: firma sobre fondo negro hasta que el canvas esté listo */}
      <Preloader />

      {/* z-999 — barra de progreso de scroll, 1px cyan → purple */}
      <ScrollProgress />

      {/* cursor personalizado — solo desktop (pointer: fine), encima de todo */}
      <CustomCursor />

      {/* z-70/71 — modal de Cal.com (encima de overlay y preloader) */}
      <CalcomModal />
    </>
  )
}

export default function App() {
  return <AppInner />
}
