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
import { useUIStore } from '@/store/uiStore'
import type { DeviceTier } from '@/types/scene'

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

// Distribución de anillos a lo largo del corredor.
// No uniforme: clusters apretados alternan con vacíos — se lee como
// arquitectura (pilares, vigas), no como colonia de demo CatmullRom.
// 15 anillos en lugar de 22 — menos presencia, más peso por unidad.
// Distribución espaciada (no clusters apretados). Los clusters del
// commit anterior se leían como "radar/bullseye" cuando la cámara los
// miraba de frente en los gaps entre secciones: anillos perfectos
// concéntricos al mismo eje crean efecto diana. Ahora los anillos se
// separan más entre sí para romper esa lectura.
const RING_T = [
  0.08,
  0.16,
  0.24,
  0.33,
  0.41,
  0.49,
  0.56,
  0.63,
  0.71,
  0.78,
  0.84,
  0.90,
  0.95,
]

// Tilt sutil (~8°) en varios anillos — rompe concentricidad perfecta
// cuando la cámara los mira de frente. Más del 40% con tilt para
// garantizar que nunca se vea un "radar" limpio.
const RING_TILT = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])

// Interpolación lineal — usada para suavizar posición, colores y opacidades por frame
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ── Configuración de calidad por tier ───────────────────── */
// Cada tier reduce geometría, partículas y resolución de render
// para mantener 60fps en dispositivos de gama baja/media.
const QUALITY: Record<DeviceTier, {
  tunnelSegments: number
  ringRadial: number
  ringTubular: number
  innerRingTubular: number
  particleNearCount: number
  particleFarCount: number
  texSize: number
  showInnerRings: boolean
  mipmapBlur: boolean
}> = {
  high: {
    tunnelSegments:    240,
    ringRadial:         16,
    ringTubular:        96,
    innerRingTubular:   96,
    particleNearCount:  90,
    particleFarCount:  320,
    texSize:            64,
    showInnerRings:   true,
    mipmapBlur:       true,
  },
  medium: {
    tunnelSegments:    160,
    ringRadial:         12,
    ringTubular:        72,
    innerRingTubular:   64,
    particleNearCount:  55,
    particleFarCount:  180,
    texSize:            32,
    showInnerRings:   true,
    mipmapBlur:       true,
  },
  low: {
    tunnelSegments:     90,
    ringRadial:          8,
    ringTubular:        48,
    innerRingTubular:   48,
    particleNearCount:  30,
    particleFarCount:   80,
    texSize:            32,
    showInnerRings:  false,
    mipmapBlur:      false,
  },
}

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
  const tier = useUIStore((s) => s.deviceTier)
  const q    = QUALITY[tier]
  const geom = useMemo(
    () => new THREE.TubeGeometry(PATH, q.tunnelSegments, 1.9, 36, false),
    [q.tunnelSegments]
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
// 15 anillos TorusGeometry orientados perpendicularmente a la curva.
// Distribución no uniforme (ver RING_T) + tilt sutil en un subset:
// arquitectura cinematográfica, no demo de CatmullRom.
// Torus con 16 segmentos radiales y 96 tubulares → sin facetas.
// Los colores hacen lerp hacia MODE_PALETTE[colorMode] en cada frame.
// La opacidad escala con tunnelIntensity — los anillos se atenúan al bajar.
function Rings() {
  const tier          = useUIStore((s) => s.deviceTier)
  const q             = QUALITY[tier]
  const ringRefs      = useRef<(THREE.Mesh | null)[]>(Array(RING_T.length).fill(null))
  const innerRingRefs = useRef<(THREE.Mesh | null)[]>([])
  const ringCol       = useRef(new THREE.Color(MODE_PALETTE.cyan.ring))
  const ringOpacity   = useRef(0.14)
  const innerOpacity  = useRef(0.07)

  const ringData = useMemo(() => {
    const zAxis = new THREE.Vector3(0, 0, 1)
    const yAxis = new THREE.Vector3(0, 1, 0)
    return RING_T.map((t, i) => {
      const pos     = PATH.getPoint(t)
      const tangent = PATH.getTangent(t).normalize()

      const quat = new THREE.Quaternion()
      quat.setFromUnitVectors(zAxis, tangent)

      // Tilts fuertes (~16° Y + ~10° X, alternando) para que los
      // anillos se lean como elipses cuando la cámara los mira de
      // frente, nunca como círculos perfectos concéntricos.
      if (RING_TILT.has(i)) {
        const tilt = new THREE.Quaternion()
        tilt.setFromAxisAngle(yAxis, (i % 2 === 0 ? 1 : -1) * 0.28)
        quat.multiply(tilt)
        const xTilt = new THREE.Quaternion()
        xTilt.setFromAxisAngle(new THREE.Vector3(1, 0, 0), (i % 3 === 0 ? 1 : -1) * 0.18)
        quat.multiply(xTilt)
      }

      // Variabilidad fuerte de escala — radios diferentes impiden que
      // los anillos stackeen como círculos concéntricos del mismo tamaño.
      const scaleTable = [0.88, 1.04, 0.94, 1.10, 0.90, 0.98, 1.06, 0.92, 1.02, 0.96, 1.08, 0.94, 1.00]
      const scale = scaleTable[i] ?? 1.0
      return { pos, quat, scale }
    })
  }, [])

  useFrame(() => {
    const { colorMode, tunnelIntensity } = useSceneStore.getState()
    const target = MODE_PALETTE[colorMode] ?? MODE_PALETTE.cyan

    // Interpolación de color — factor 0.045 ≈ 22 frames de transición
    ringCol.current.lerp(new THREE.Color(target.ring), 0.045)

    // Umbral duro: bajo tunnelIntensity 0.4 los anillos son 0.
    // Por encima escalan linealmente hasta su pico en hero (1.0).
    // Esto garantiza que en las secciones medias no se vea ninguna
    // figura concéntrica — cumple el brief ("tenue en parte media").
    const threshold = 0.40
    const span      = 1.0 - threshold
    const ringFactor = Math.max(0, (tunnelIntensity - threshold) / span)
    const targetMainOpacity  = ringFactor * 0.22
    const targetInnerOpacity = ringFactor * 0.10
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

  // Subset editorial para anillos interiores — solo 3 índices no
  // alineados con los principales para evitar dobles concéntricos.
  const INNER_INDICES = [2, 6, 10]
  const innerRingData = useMemo(
    () => INNER_INDICES.map((i) => ringData[i]).filter(Boolean),
    [ringData]
  )

  return (
    <>
      {/* Anillos principales — torus 16×96 para eliminar facetas */}
      {ringData.map(({ pos, quat, scale }, i) => (
        <mesh
          key={i}
          ref={(el) => { ringRefs.current[i] = el }}
          position={pos}
          quaternion={quat}
          scale={scale}
        >
          {/* args: [radio, grosor, segmentos radiales, segmentos circulares] */}
          <torusGeometry args={[1.72, 0.008, q.ringRadial, q.ringTubular]} />
          <meshBasicMaterial
            color={MODE_PALETTE.cyan.ring}
            transparent
            opacity={0.14}
          />
        </mesh>
      ))}

      {/* Anillos interiores — omitidos en tier low para ahorrar draw calls */}
      {q.showInnerRings && innerRingData.map(({ pos, quat }, i) => (
        <mesh
          key={`interior-${i}`}
          ref={(el) => { innerRingRefs.current[i] = el }}
          position={pos}
          quaternion={quat}
        >
          <torusGeometry args={[1.54, 0.004, 12, q.innerRingTubular]} />
          <meshBasicMaterial
            color={MODE_PALETTE.cyan.ring}
            transparent
            opacity={0.07}
          />
        </mesh>
      ))}
    </>
  )
}

/* ── ParticleLayer ───────────────────────────────────────── */
// Capa de partículas parametrizada — se instancia dos veces para
// crear paralaje (una capa cerca/grande/lenta, otra lejos/fina/rápida).
//
// AdditiveBlending: las partículas se suman a la luz del fondo —
// respiran con el bloom y tienen glow natural, sin alpha plano.
//
// spreadXY:   dispersión lateral (mayor en background para llenar)
// zRange:     [near, far] en coordenadas del mundo (negativo = adelante)
// driftSpeed: factor de oscilación vertical
// opacityBase: opacidad en reposo (escala con tunnelIntensity)
function ParticleLayer({
  count,
  size,
  spreadXY,
  zRange,
  driftSpeed,
  opacityBase,
  phaseOffset = 0,
  texSize = 64,
}: {
  count: number
  size: number
  spreadXY: [number, number]
  zRange: [number, number]
  driftSpeed: number
  opacityBase: number
  phaseOffset?: number
  texSize?: number
}) {
  const ref  = useRef<THREE.Points>(null)
  const col  = useRef(new THREE.Color(MODE_PALETTE.cyan.ring))
  const opa  = useRef(opacityBase)

  // Textura circular suave — sin esto pointsMaterial renderiza
  // cuadrados (aristas visibles a tamaños > ~2px). Con esta textura
  // los puntos leen como dots suaves con glow natural.
  const dotTexture = useMemo(() => {
    const c   = document.createElement('canvas')
    c.width   = texSize
    c.height  = texSize
    const ctx    = c.getContext('2d')!
    const half   = texSize / 2
    const g      = ctx.createRadialGradient(half, half, 0, half, half, half)
    g.addColorStop(0,    'rgba(255,255,255,1)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.45)')
    g.addColorStop(1,    'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, texSize, texSize)
    const tex = new THREE.CanvasTexture(c)
    tex.needsUpdate = true
    return tex
  }, [texSize])

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const [zNear, zFar] = zRange
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * spreadXY[0]
      arr[i * 3 + 1] = (Math.random() - 0.5) * spreadXY[1]
      // Distribución con sesgo hacia cámara — más densidad cerca,
      // menos al fondo. Da sensación de profundidad atmosférica.
      const bias = Math.pow(Math.random(), 1.35)
      arr[i * 3 + 2] = zNear + (zFar - zNear) * bias
    }
    return arr
  }, [count, spreadXY, zRange])

  useFrame((state) => {
    if (!ref.current) return

    const { colorMode, tunnelIntensity } = useSceneStore.getState()
    const target = MODE_PALETTE[colorMode] ?? MODE_PALETTE.cyan

    col.current.lerp(new THREE.Color(target.ring), 0.04)

    const targetOpacity = Math.max(0.03, opacityBase * tunnelIntensity)
    opa.current = lerp(opa.current, targetOpacity, 0.03)

    const mat = ref.current.material as THREE.PointsMaterial
    mat.color.copy(col.current)
    mat.opacity = opa.current

    // Deriva vertical — fase propia de cada partícula
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    const t   = state.clock.elapsedTime * driftSpeed + phaseOffset
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t + i * 0.73) * 0.0004
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={MODE_PALETTE.cyan.ring}
        map={dotTexture}
        alphaTest={0.01}
        transparent
        opacity={opacityBase}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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
  const tier             = useUIStore((s) => s.deviceTier)
  const q                = QUALITY[tier]
  const bloomRef         = useRef<BloomEffect>(null)
  const currentIntensity = useRef(0.55)

  useFrame(() => {
    const { bloomStrength } = useSceneStore.getState()
    currentIntensity.current = lerp(currentIntensity.current, bloomStrength, 0.04)
    if (bloomRef.current) {
      bloomRef.current.intensity = currentIntensity.current
    }
  })

  return (
    <EffectComposer>
      <Bloom
        ref={bloomRef}
        intensity={0.55}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.45}
        mipmapBlur={q.mipmapBlur}
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
  const tier = useUIStore((s) => s.deviceTier)
  const q    = QUALITY[tier]

  return (
    <>
      <Environment />
      <CameraRig />
      <Tunnel />
      <Rings />

      <ParticleLayer
        count={q.particleNearCount}
        size={0.008}
        spreadXY={[3.4, 2.6]}
        zRange={[0, -14]}
        driftSpeed={0.025}
        opacityBase={0.22}
        texSize={q.texSize}
      />

      <ParticleLayer
        count={q.particleFarCount}
        size={0.0035}
        spreadXY={[3.2, 2.4]}
        zRange={[-8, -30]}
        driftSpeed={0.045}
        opacityBase={0.45}
        phaseOffset={1.3}
        texSize={q.texSize}
      />

      <Effects />
    </>
  )
}

/* ── SceneCanvas ─────────────────────────────────────────── */
// Punto de entrada — monta el Canvas de R3F como fondo fijo (z-index 0).
// dpr [1, 1.5] limita la resolución en pantallas de alta densidad
// para mantener rendimiento en dispositivos de gama media.
export default function SceneCanvas() {
  const tier = useUIStore((s) => s.deviceTier)

  const dpr      = tier === 'low'    ? [1, 1]   : tier === 'medium' ? [1, 1.2] : [1, 1.5]
  const antialias = tier !== 'low'

  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden="true"
      style={{ background: '#05070B' }}
    >
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 72, near: 0.01, far: 50 }}
        gl={{ antialias, alpha: false }}
        dpr={dpr as [number, number]}
        style={{ background: '#05070B' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
