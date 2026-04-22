/**
 * Raíz de la aplicación.
 *
 * AppInner monta los hooks globales en orden:
 *  1. useLenis               → scroll suavizado
 *  2. useScrollProgress      → progreso 0–1 al sceneStore
 *  3. useDeviceTier          → tier del dispositivo al uiStore
 *  4. useScrollOrchestration → sección activa + estado completo de escena
 *
 * La escena 3D (SceneCanvas) se renderiza en z-index 0 como
 * fondo fijo. El contenido HTML vive encima en z-index 10.
 *
 * ContactBurstOverlay añade un halo blanco sobre la escena al llegar
 * a la sección contact, sin pasar por el pipeline 3D.
 */

import BaseLayout from '@/components/layout/BaseLayout'
import SceneCanvas from '@/components/scene/SceneCanvas'
import Hero from '@/components/sections/Hero'
import Evidence from '@/components/sections/Evidence'
import Capabilities from '@/components/sections/Capabilities'
import Thinking from '@/components/sections/Thinking'
import About from '@/components/sections/About'
import Standards from '@/components/sections/Standards'
import Contact from '@/components/sections/Contact'
import { useLenis } from '@/hooks/useLenis'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useDeviceTier } from '@/hooks/useDeviceTier'
import { useScrollOrchestration } from '@/hooks/useScrollOrchestration'
import { useSceneStore } from '@/store/sceneStore'

/**
 * Overlay HTML que aparece gradualmente al entrar en la sección contact.
 *
 * Es un halo radial blanco-azulado centrado en la parte baja de pantalla.
 * La opacidad viene de contactBurstProgress (0→1) para que la transición
 * sea suave y proporcional al scroll, sin depender del pipeline 3D.
 *
 * z-index 5 — por encima del Canvas (z-0) pero debajo del contenido (z-10).
 */
function ContactBurstOverlay() {
  const burst = useSceneStore((s) => s.contactBurstProgress)
  if (burst < 0.01) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 5,
        // Halo radial centrado-inferior — simula una fuente de luz blanca lejana
        background: `radial-gradient(ellipse 80% 50% at 50% 85%,
          rgba(190, 210, 230, ${burst * 0.13}) 0%,
          transparent 70%)`,
      }}
    />
  )
}

function AppInner() {
  useLenis()
  useScrollProgress()
  useDeviceTier()
  useScrollOrchestration()  // reemplaza useSectionMode — orquesta el estado completo

  return (
    <>
      {/* Escena 3D — fondo fijo, z-index 0 */}
      <SceneCanvas />

      {/* Halo blanco de contact — z-index 5, entre Canvas y contenido */}
      <ContactBurstOverlay />

      {/* Contenido HTML — encima de la escena, z-index 10 via BaseLayout */}
      <BaseLayout>
        <Hero />
        <Evidence />
        <Capabilities />
        <Thinking />
        <About />
        <Standards />
        <Contact />
      </BaseLayout>
    </>
  )
}

export default function App() {
  return <AppInner />
}
