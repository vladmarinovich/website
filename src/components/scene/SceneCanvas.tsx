/**
 * Escena 3D principal — corredor arquitectónico oscuro.
 *
 * La cámara recorre una curva CatmullRom de 7 puntos de control
 * a medida que el usuario hace scroll (progress 0→1 del sceneStore).
 *
 * Componentes de la escena:
 *  - CameraRig      → posiciona la cámara a lo largo del PATH
 *  - Tunnel         → tubo interior TubeGeometry (BackSide) como paredes
 *  - Rings          → anillos torus en intervalos que reaccionan al colorMode
 *  - DustParticles  → 600 puntos flotantes para dar profundidad
 *  - Environment    → luz ambiental mínima + niebla de profundidad
 *  - Effects        → EffectComposer con Bloom + Vignette (postprocesado)
 *
 * Lectura del store:
 *  - Dentro de useFrame se usa useSceneStore.getState() (patrón Zustand
 *    fuera de React) para leer el estado sin disparar re-renders.
 *  - Los colores se interpolan con lerp() por frame para transiciones suaves.
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
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

// Interpolación lineal — usada para suavizar posición y colores por frame
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ── CameraRig ───────────────────────────────────────────── */
// Mueve la cámara a lo largo de PATH en función del progreso de scroll.
// Doble lerp: el store actualiza smooth.current, y la cámara sigue a smooth.current.
// Esto crea una sensación de inercia sin librerías extra.
function CameraRig() {
  const { camera } = useThree()
  const smooth = useRef(0)  // progreso suavizado independiente del store

  useFrame(() => {
    // Leer el progreso de scroll sin suscribirse a React
    const raw = useSceneStore.getState().progress

    // Suavizado de primer orden — factor 0.055 = transición ~18 frames
    smooth.current = lerp(smooth.current, raw, 0.055)

    // Limitar al 88% del recorrido para no salir del final de la curva
    const t      = Math.min(smooth.current * 0.88, 0.88)
    const ahead  = Math.min(t + 0.025, 0.999) // punto de mirada 2.5% adelante

    const pos  = PATH.getPoint(t)
    const look = PATH.getPoint(ahead)

    // Lerp adicional en la posición de la cámara para más suavidad
    camera.position.lerp(pos, 0.12)
    camera.lookAt(look)
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
// Cada 3er anillo tiene un segundo anillo interior más fino.
function Rings() {
  // Array de refs para actualizar el color de cada anillo en useFrame
  const ringRefs = useRef<(THREE.Mesh | null)[]>(Array(RING_COUNT).fill(null))
  const ringCol  = useRef(new THREE.Color(MODE_PALETTE.cyan.ring))

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
    // Leer el modo actual sin re-render de React
    const target = MODE_PALETTE[useSceneStore.getState().colorMode] ?? MODE_PALETTE.cyan

    // Interpolación de color por frame — factor 0.045 = transición suave ~22 frames
    ringCol.current.lerp(new THREE.Color(target.ring), 0.045)

    // Aplicar el color interpolado a todos los anillos activos
    ringRefs.current.forEach((mesh) => {
      if (!mesh) return
      ;(mesh.material as THREE.MeshBasicMaterial).color.copy(ringCol.current)
    })
  })

  return (
    <>
      {/* Anillos principales — opacidad 0.28 para sutileza */}
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
      {ringData.filter((_, i) => i % 3 === 0).map(({ pos, quat }, i) => (
        <mesh key={`interior-${i}`} position={pos} quaternion={quat}>
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
// El color sigue al colorMode con lerp igual que los anillos.
function DustParticles() {
  const ref   = useRef<THREE.Points>(null)
  const count = 600
  const col   = useRef(new THREE.Color(MODE_PALETTE.cyan.ring))

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

    // Actualizar color de las partículas con lerp
    const target = MODE_PALETTE[useSceneStore.getState().colorMode] ?? MODE_PALETTE.cyan
    col.current.lerp(new THREE.Color(target.ring), 0.04)
    ;(ref.current.material as THREE.PointsMaterial).color.copy(col.current)

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
// Luz ambiental mínima (0.06) para que el material del túnel
// no sea completamente plano. La niebla crea el fade a negro.
function Environment() {
  return (
    <>
      <ambientLight intensity={0.06} />
      {/* Niebla exponencial: starts 4u, completamente negro a 28u */}
      <fog attach="fog" args={['#05070B', 4, 28]} />
    </>
  )
}

/* ── Effects ─────────────────────────────────────────────── */
// Postprocesado con bloom contenido y viñeta profunda.
// luminanceThreshold: 0.18 — solo los anillos brillantes activan el bloom.
// El background oscuro (#05070B) queda por debajo del umbral.
function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.55}             // bloom suave — no sci-fi, premium
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
      style={{ background: '#05070B' }}  // color base visible antes de que cargue el Canvas
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
