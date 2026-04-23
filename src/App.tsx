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

import BaseLayout from '@/components/layout/BaseLayout'
import SceneCanvas from '@/components/scene/SceneCanvas'
import HeroLayers from '@/components/hero/HeroLayers'
import Hero from '@/components/sections/Hero'
import Evidence from '@/components/sections/Evidence'
import Capabilities from '@/components/sections/Capabilities'
import Thinking from '@/components/sections/Thinking'
import About from '@/components/sections/About'
import Standards from '@/components/sections/Standards'
import Contact from '@/components/sections/Contact'
import { CaseOverlay } from '@/components/cases/CaseOverlay'
import { useLenis } from '@/hooks/useLenis'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useDeviceTier } from '@/hooks/useDeviceTier'
import { useScrollOrchestration } from '@/hooks/useScrollOrchestration'
import { useSceneStore } from '@/store/sceneStore'

/* ── ContactBurstOverlay ─────────────────────────────────── */
// Halo radial blanco-azulado al llegar a la sección contact.
// z-5: encima del hero (z-1) y del tunnel (z-0), debajo del contenido (z-10).
function ContactBurstOverlay() {
  const burst = useSceneStore((s) => s.contactBurstProgress)
  if (burst < 0.01) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 5,
        background: `radial-gradient(ellipse 80% 50% at 50% 85%,
          rgba(190, 210, 230, ${burst * 0.13}) 0%,
          transparent 70%)`,
      }}
    />
  )
}

/* ── AppInner ────────────────────────────────────────────── */
function AppInner() {
  useLenis()
  useScrollProgress()
  useDeviceTier()
  useScrollOrchestration()

  return (
    <>
      {/* z-0 — tunnel 3D de fondo */}
      <SceneCanvas />

      {/* z-1 — fondo del hero, fixed, se disuelve con scroll */}
      <HeroLayers />

      {/* z-5 — halo blanco en contact */}
      <ContactBurstOverlay />

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
    </>
  )
}

export default function App() {
  return <AppInner />
}
