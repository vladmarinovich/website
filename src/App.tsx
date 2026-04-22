/**
 * Raíz de la aplicación.
 *
 * AppInner monta los hooks globales en orden:
 *  1. useLenis          → scroll suavizado
 *  2. useScrollProgress → progreso 0–1 al sceneStore
 *  3. useDeviceTier     → tier del dispositivo al uiStore
 *  4. useSectionMode    → sección activa + colorMode al sceneStore
 *
 * La escena 3D (SceneCanvas) se renderiza en z-index 0 como
 * fondo fijo. El contenido HTML vive encima en z-index 10.
 *
 * SECTION_MODES define qué colorMode activa cada sección.
 * La detección se hace con IntersectionObserver para evitar
 * cálculos de scroll en cada frame.
 */

import { useEffect } from 'react'
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
import { useSceneStore } from '@/store/sceneStore'
import type { ColorMode, SceneSection } from '@/types/scene'

// Mapa sección → color de acento de la escena 3D
const SECTION_MODES: { id: SceneSection; color: ColorMode }[] = [
  { id: 'hero',         color: 'cyan'    },
  { id: 'evidence',     color: 'cyan'    },
  { id: 'capabilities', color: 'purple'  },
  { id: 'thinking',     color: 'purple'  },
  { id: 'about',        color: 'orange'  },
  { id: 'standards',    color: 'neutral' },
  { id: 'contact',      color: 'white'   },
]

/**
 * Hook que observa qué sección está más visible en pantalla
 * y actualiza colorMode + activeSection en sceneStore.
 *
 * Se usa IntersectionObserver con dos umbrales (0.15 y 0.4)
 * para detectar la sección más intersectada en cada cambio.
 */
function useSectionMode() {
  const setColorMode     = useSceneStore((s) => s.setColorMode)
  const setActiveSection = useSceneStore((s) => s.setActiveSection)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Elegir la sección con mayor ratio de intersección
        let best: string | null = null
        let bestRatio = 0
        entries.forEach((e) => {
          if (e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio
            best = e.target.id
          }
        })
        if (best) {
          const match = SECTION_MODES.find((s) => s.id === best)
          if (match) {
            setColorMode(match.color)
            setActiveSection(match.id)
          }
        }
      },
      { threshold: [0.15, 0.4] }
    )

    // Pequeño delay para garantizar que las secciones están montadas en el DOM
    const timer = setTimeout(() => {
      SECTION_MODES.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 200)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [setColorMode, setActiveSection])
}

function AppInner() {
  useLenis()
  useScrollProgress()
  useDeviceTier()
  useSectionMode()

  return (
    <>
      {/* Escena 3D — fondo fijo, z-index 0 */}
      <SceneCanvas />

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
