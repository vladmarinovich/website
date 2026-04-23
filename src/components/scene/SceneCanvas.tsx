/**
 * Escena 3D principal — corredor arquitectónico oscuro.
 *
 * La cámara recorre una curva CatmullRom de 7 puntos de control
 * a medida que el usuario hace scroll (progress 0→1 del sceneStore).
 *
 * Componentes de la escena:
 *  - CameraRig      → posiciona la cámara a lo largo del PATH
 *  - Tunnel         → tubo interior TubeGeometry (BackSide) como paredes
 *  - Rings          → anillos torus que reaccionan a colorMode + tunnelIntensity
 *  - DustParticles  → 600 puntos flotantes que se atenúan con el scroll
 *  - Environment    → luz ambiental que escala con tunnelIntensity + niebla
 *  - Effects        → EffectComposer con Bloom dinámico + Vignette
 *
 * Lectura del store:
 *  - Dentro de useFrame se usa useSceneStore.getState() (patrón Zustand
 *    fuera de React) para leer el estado sin disparar re-renders.
 *  - Los colores y valores escalares se interpolan con lerp() por frame.
 *
 * Fase 3 — orquestación dinámica:
 *  - tunnelIntensity → opacidad de anillos + intensidad de luz ambiental
 *  - bloomStrength   → intensidad del efecto bloom en postprocesado
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import type { BloomEffect } from 'postprocessing'
import { useSceneStore } from '@/store/sceneStore'

/* ── Paleta de colores por modo ──────────────────────────── */
// ring  → color principal del anillo (visible)
// inner → reservado para acento interior futuro
const MODE_PALETTE: Record<string, { ring: string; inner: string }> = {
  cyan:    { ring: '#4DD9E6', inner: '#1A4A52' },
  purple:  { ring: '#9A7CFF', inner: '#2A1F4A' },
  orange:  { ring: '#FFB066', inner: '#4A2F12' },
  neutral: { ring: '#6A7A8F', inner: '#141820' },
  white:   { ring: '#C8D0DC', inner: '#1C2028' },
}

/* ── Curva del corredor ──────────────────────────────────── */
// 7 puntos de control con desviaciones leves en X e Y
// para una trayectoria arquitectónica, no un tubo recto
const PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,     0,     0),
  new THREE.Vector3(0.35,  0.12,  -5.5),
  new THREE.Vector3(-0.28, -0.08, -11),
  new THREE.Vector3(0.22,  0.10,  -16.5),
  new THREE.Vector3(-0.18, -0.06, -22),
  new THREE.Vector3(0.10,  0.04,  -27),
  new THREE.Vector3(0,     0,     -32),
])

// Número de anillos distribuidos a lo largo del corredor
const RING_COUNT = 22

// Interpolación lineal — usada para suavizar posición, colores y opacidades por frame
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ── CameraRig ───────────────────────────────────────────── */
// Mueve la cámara a lo largo de PATH en función del progreso de scroll.
// Doble lerp: el store actualiza smooth.current, y la cámara sigue a smooth.current.
// Esto crea una sensación de inercia sin librerías extra.
function CameraRig() {
  const { camera } = useThree()
  const smooth      = useRef(0)   // progreso de scroll suavizado
  const heroSmooth  = useRef(0)   // heroTransitionProgress suavizado

  useFrame(() => {
    const { progress: raw, heroTransitionProgress } = useSceneStore.getState()
    const cam = camera as THREE.PerspectiveCamera

    // ── Scroll progress ──────────────────────────────────────
    smooth.current = lerp(smooth.current, raw, 0.055)
    const scrollT  = Math.min(smooth.current * 0.88, 0.88)

    // ── Hero transition dive ─────────────────────────────────
    // Durante el fade del hero la cámara avanza hacia la entrada del túnel
    // y el FOV se expande — sensación de ser tragado por el corredor.
    heroSmooth.current = lerp(heroSmooth.current, heroTransitionProgress, 0.055)
    const h      = heroSmooth.current
    // Dive: avanza hasta el 9% del PATH (boca del corredor)
    const diveT  = h * 0.09
    // Tomar la posición más adelante entre scroll normal y dive
    const t      = Math.max(scrollT, diveT)
    const ahead  = Math.min(t + 0.025, 0.999)

    const pos  = PATH.getPoint(t)
    const look = PATH.getPoint(ahead)

    camera.position.lerp(pos, 0.10)
    camera.lookAt(look)

    // FOV: 72° en reposo → 100° en el pico del dive → se queda en ~88° después
    // Curva: sube rápido al entrar, se asienta en un valor ligeramente más abierto
    const targetFov = h < 1
      ? lerp(72, 100, h)          // expansión durante el fade
      : lerp(100, 88, Math.min(1, (smooth.current * 4)))  // asienta en 88° post-hero
    cam.fov = lerp(cam.fov, targetFov, 0.07)
    cam.updateProjectionMatrix()
  })

  return null
}

/* ── Tunnel ──────────────────────────────────────────────── */
// Tubo TubeGeometry renderizado desde adentro (BackSide).
// Material casi negro con roughness alto = sin reflejos, pura oscuridad.
// 240 segmentos longitudinales para que la curva se vea suave.
function Tunnel() {
  const geom = useMemo(
    () => new THREE.TubeGeometry(PATH, 240, 1.9, 36, false),
    []
  )

  return (
    <mesh geometry={geom}>
      <meshStandardMaterial
        color="#090B10"       // casi negro, con un tinte azulado frío
        side={THREE.BackSide} // renderizar el interior del tubo
        roughness={0.95}      // sin brillo
        metalness={0.08}
        envMapIntensity={0}
      />
    </mesh>
  )
}

/* ── Rings ───────────────────────────────────────────────── */
// 22 anillos TorusGeometry orientados perpendicularmente a la curva.
// La orientación se calcula con setFromUnitVectors(Z_local → tangente).
// Los colores hacen lerp hacia MODE_PALETTE[colorMode] en cada frame.
// La opacidad escala con tunnelIntensity — los anillos se atenúan al bajar.
// Cada 3er anillo tiene un segundo anillo interior más fino.
function Rings() {
  // Refs para actualizar color y opacidad de cada anillo en useFrame
  const ringRefs      = useRef<(THREE.Mesh | null)[]>(Array(RING_COUNT).fill(null))
  const innerRingRefs = useRef<(THREE.Mesh | null)[]>([])
  const ringCol       = useRef(new THREE.Color(MODE_PALETTE.cyan.ring))
  const ringOpacity   = useRef(0.28)   // opacidad suavizada de los anillos principales
  const innerOpacity  = useRef(0.15)   // opacidad suavizada de los anillos interiores

  // Posiciones y quaterniones precalculados — no recalcular en cada render
  const ringData = useMemo(() => {
    const zAxis = new THREE.Vector3(0, 0, 1)
    return Array.from({ length: RING_COUNT }, (_, i) => {
      const t       = (i + 1) / (RING_COUNT + 1) // evitar los extremos del path
      const pos     = PATH.getPoint(t)
      const tangent = PATH.getTangent(t).normalize()

      // Rotar el anillo para que su normal (Z) apunte en dirección del tangente
      const quat = new THREE.Quaternion()
      quat.setFromUnitVectors(zAxis, tangent)

      // Ritmo visual: cada 3 anillos uno es ligeramente más grande
      const scale = i % 3 === 0 ? 1.08 : 0.96
      return { pos, quat, scale }
    })
  }, [])

  useFrame(() => {
    const { colorMode, tunnelIntensity } = useSceneStore.getState()
    const target = MODE_PALETTE[colorMode] ?? MODE_PALETTE.cyan

    // Interpolación de color — factor 0.045 ≈ 22 frames de transición
    ringCol.current.lerp(new THREE.Color(target.ring), 0.045)

    // Interpolación de opacidad — proporcional a tunnelIntensity
    // Mínimo 0.04 para que los anillos nunca desaparezcan completamente
    const targetMainOpacity  = Math.max(0.04, 0.28 * tunnelIntensity)
    const targetInnerOpacity = Math.max(0.02, 0.15 * tunnelIntensity)
    ringOpacity.current  = lerp(ringOpacity.current,  targetMainOpacity,  0.03)
    innerOpacity.current = lerp(innerOpacity.current, targetInnerOpacity, 0.03)

    // Actualizar todos los anillos principales
    ringRefs.current.forEach((mesh) => {
      if (!mesh) return
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.color.copy(ringCol.current)
      mat.opacity = ringOpacity.current
    })

    // Actualizar los anillos interiores secundarios
    innerRingRefs.current.forEach((mesh) => {
      if (!mesh) return
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.color.copy(ringCol.current)
      mat.opacity = innerOpacity.current
    })
  })

  // Precalcular subset de anillos interiores (cada 3er índice)
  const innerRingData = useMemo(
    () => ringData.filter((_, i) => i % 3 === 0),
    [ringData]
  )

  return (
    <>
      {/* Anillos principales */}
      {ringData.map(({ pos, quat, scale }, i) => (
        <mesh
          key={i}
          ref={(el) => { ringRefs.current[i] = el }}
          position={pos}
          quaternion={quat}
          scale={scale}
        >
          {/* args: [radio, grosor del tubo, segmentos radiales, segmentos circulares] */}
          <torusGeometry args={[1.72, 0.007, 8, 80]} />
          <meshBasicMaterial
            color={MODE_PALETTE.cyan.ring}
            transparent
            opacity={0.28}
          />
        </mesh>
      ))}

      {/* Anillos interiores secundarios — cada 3er anillo, más finos y tenues */}
      {innerRingData.map(({ pos, quat }, i) => (
        <mesh
          key={`interior-${i}`}
          ref={(el) => { innerRingRefs.current[i] = el }}
          position={pos}
          quaternion={quat}
        >
          <torusGeometry args={[1.55, 0.004, 6, 80]} />
          <meshBasicMaterial
            color={MODE_PALETTE.cyan.ring}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </>
  )
}

/* ── DustParticles ───────────────────────────────────────── */
// 600 puntos distribuidos aleatoriamente a lo largo del corredor.
// Derivan lentamente en Y con seno para simular polvo en suspensión.
// El color y la opacidad siguen al colorMode y tunnelIntensity.
function DustParticles() {
  const ref           = useRef<THREE.Points>(null)
  const count         = 600
  const col           = useRef(new THREE.Color(MODE_PALETTE.cyan.ring))
  const dustOpacity   = useRef(0.45)  // opacidad suavizada de las partículas

  // Posiciones iniciales aleatorias — no recalcular después
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 3.2  // spread horizontal
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.4  // spread vertical
      arr[i * 3 + 2] = -Math.random() * 30           // profundidad del corredor
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return

    const { colorMode, tunnelIntensity } = useSceneStore.getState()
    const target = MODE_PALETTE[colorMode] ?? MODE_PALETTE.cyan

    // Actualizar color con lerp
    col.current.lerp(new THREE.Color(target.ring), 0.04)

    // Atenuar partículas con tunnelIntensity — mínimo 0.05 para mantener presencia
    const targetDustOpacity = Math.max(0.05, 0.45 * tunnelIntensity)
    dustOpacity.current = lerp(dustOpacity.current, targetDustOpacity, 0.03)

    const mat = ref.current.material as THREE.PointsMaterial
    mat.color.copy(col.current)
    mat.opacity = dustOpacity.current

    // Deriva suave en Y — diferente fase por partícula (índice i)
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    const t   = state.clock.elapsedTime * 0.03
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t + i * 0.7) * 0.0004
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color={MODE_PALETTE.cyan.ring}
        transparent
        opacity={0.45}
        sizeAttenuation  // partículas más lejanas se ven más pequeñas
        depthWrite={false}
      />
    </points>
  )
}

/* ── Environment ─────────────────────────────────────────── */
// Luz ambiental que escala con tunnelIntensity para que la escena
// se oscurezca gradualmente a medida que el usuario baja el scroll.
// La niebla crea el fade a negro en la profundidad del corredor.
function Environment() {
  const lightRef = useRef<THREE.AmbientLight>(null)

  useFrame(() => {
    if (!lightRef.current) return
    const { tunnelIntensity } = useSceneStore.getState()
    // Mapear intensidad 0–1 a rango de luz 0.01–0.08
    // Nunca completamente negro para mantener legibilidad mínima
    const targetIntensity = 0.01 + tunnelIntensity * 0.07
    lightRef.current.intensity = lerp(lightRef.current.intensity, targetIntensity, 0.03)
  })

  return (
    <>
      <ambientLight ref={lightRef} intensity={0.08} />
      {/* Niebla exponencial: starts 4u, completamente negro a 28u */}
      <fog attach="fog" args={['#05070B', 4, 28]} />
    </>
  )
}

/* ── Effects ─────────────────────────────────────────────── */
// Postprocesado con bloom dinámico y viñeta profunda.
// La intensidad del bloom hace lerp hacia bloomStrength en cada frame —
// sin re-renders de React, todo dentro de useFrame.
// luminanceThreshold: 0.18 — solo los anillos brillantes activan el bloom.
function Effects() {
  const bloomRef        = useRef<BloomEffect>(null)
  const currentIntensity = useRef(0.55)  // intensidad actual del bloom (interpolada)

  useFrame(() => {
    const { bloomStrength } = useSceneStore.getState()
    // Lerp hacia el target — factor 0.04 ≈ 25 frames de transición suave
    currentIntensity.current = lerp(currentIntensity.current, bloomStrength, 0.04)
    if (bloomRef.current) {
      bloomRef.current.intensity = currentIntensity.current
    }
  })

  return (
    <EffectComposer>
      <Bloom
        ref={bloomRef}
        intensity={0.55}             // valor inicial — sobreescrito en useFrame
        luminanceThreshold={0.18}    // activa en elementos brillantes
        luminanceSmoothing={0.45}    // transición gradual del bloom
        mipmapBlur                   // bloom de alta calidad con mip maps
      />
      <Vignette
        offset={0.38}                // inicio del oscurecimiento
        darkness={0.88}              // intensidad del borde oscuro
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}

/* ── SceneContent ────────────────────────────────────────── */
// Agrupa todos los elementos de la escena.
// Wrapped en <Suspense> en SceneCanvas para manejar la carga de geometrías.
function SceneContent() {
  return (
    <>
      <Environment />
      <CameraRig />
      <Tunnel />
      <Rings />
      <DustParticles />
      <Effects />
    </>
  )
}

/* ── SceneCanvas ─────────────────────────────────────────── */
// Punto de entrada — monta el Canvas de R3F como fondo fijo (z-index 0).
// dpr [1, 1.5] limita la resolución en pantallas de alta densidad
// para mantener rendimiento en dispositivos de gama media.
export default function SceneCanvas() {
  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden="true"
      style={{ background: '#05070B' }}
    >
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 72, near: 0.01, far: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ background: '#05070B' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
