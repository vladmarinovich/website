/**
 * Capas visuales del hero — posición fija, nunca scrollean.
 *
 * Este componente vive en el NIVEL RAÍZ de la app (junto a SceneCanvas),
 * no dentro de BaseLayout. Esto garantiza que el fondo nunca "suba"
 * al scrollear — solo se disuelve.
 *
 * Capas (fondo → frente):
 *  1. HeroBackground  → imagen responsive, zoom scroll-driven
 *  2. PortalPulse     → núcleo amorfo vivo (2.0s) — atmósfera y dive
 *  3. HeroOverlay     → velos de oscurecimiento + fades de borde
 *
 * El antiguo NucleusPulse (glow radial violeta) se eliminó —
 * competía con PortalPulse en el mismo color y zona sin aportar
 * profundidad. Menos es más: un solo elemento orgánico carga
 * la atmósfera completa.
 *
 * Timing de fade (scrollY relativo a viewport height):
 *  opacity 1 → 0  entre  0.55vh y 1.0vh
 *  Cuando Evidence entra al viewport (scrollY = 100vh), el fondo
 *  está exactamente en opacity 0 → cross-dissolve sin movimiento.
 */

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

/* ── Constantes ──────────────────────────────────────────── */
// Calculado una vez en mount — aceptable para este uso
const VH = typeof window !== 'undefined' ? window.innerHeight : 900

// Zoom no-lineal hacia el portal: lento al inicio, acelera al final
const SCALE_X = [0,        VH * 0.25, VH * 0.55, VH * 0.75]
const SCALE_Y = [1,        1.08,      1.55,       2.20]

// Fondo: empieza a disolverse a 0.55vh, completamente ido a 1.0vh
// → sincronizado con la entrada de la siguiente sección
const FADE_START = VH * 0.55
const FADE_END   = VH * 1.0

const OVERLAY_DESKTOP      = 0.30
const OVERLAY_MOBILE_EXTRA = 0.12

const FILAMENT_DELAY = 2.0   // activación del núcleo (tras el asentamiento del texto)

/* ── HeroBackground ──────────────────────────────────────── */
function HeroBackground({ scale }: { scale: MotionValue<number> }) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ scale, willChange: 'transform', transformOrigin: 'center center' }}
    >
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet="/assets/images/hero-desktop.webp"
          type="image/webp"
        />
        <img
          src="/assets/images/hero-mobile.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-full object-cover object-center select-none"
        />
      </picture>
    </motion.div>
  )
}

/* ── PortalPulse ──────────────────────────────────────────── */
// Canvas 2D — núcleo de singularidad viva.
// Sin anillos, sin ondas. Solo la masa amorfa del centro que,
// al hacer scroll, se expande y TRAGA la pantalla completa.
// Transición tipo "succión": lenta al inicio, acelera al final.
// Al llegar a opacity 0 del hero, el núcleo ya cubre toda la pantalla
// y revela el túnel 3D por debajo — cross-dissolve sin corte.

function PortalPulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const VH = window.innerHeight
    const mountTime = performance.now()

    const drawLoop = (now: number) => {
      raf = requestAnimationFrame(drawLoop)

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const cx = w * 0.5
      const cy = h * 0.5

      const elapsed = Math.max(0, now - mountTime) / 1000
      // Ramp de activación: el núcleo aparece 2s después del mount
      const ramp = Math.min(1, Math.max(0, (elapsed - FILAMENT_DELAY) / 2.0))
      if (ramp < 0.005) return

      // ── Scroll: sincronizado con el zoom del fondo ──────────
      // El zoom usa SCALE_X = [0, 0.25vh, 0.55vh, 0.75vh] con
      // SCALE_Y = [1, 1.08, 1.55, 2.20]. Derivamos la fracción del
      // núcleo del mismo rango para que ambos vayan exactamente igual.
      const scrollY = window.scrollY

      // Piecewise linear sobre los mismos breakpoints del zoom
      const ZX = [0, VH * 0.25, VH * 0.55, VH * 0.75]
      const ZY = [0, 0.068,     0.458,      1.0]  // normalizado 0→1 (SCALE_Y−1)/(2.20−1)
      let tEased = 0
      if (scrollY <= ZX[0]) {
        tEased = ZY[0]
      } else if (scrollY >= ZX[ZX.length - 1]) {
        tEased = ZY[ZY.length - 1]
      } else {
        for (let i = 0; i < ZX.length - 1; i++) {
          if (scrollY <= ZX[i + 1]) {
            const t = (scrollY - ZX[i]) / (ZX[i + 1] - ZX[i])
            tEased = ZY[i] + t * (ZY[i + 1] - ZY[i])
            break
          }
        }
      }

      // ── Tamaño del núcleo ────────────────────────────────────
      const isMobile  = w < 768
      const portalRef = Math.min(w, h) * 0.40
      const SR_BASE   = portalRef * (isMobile ? 0.095 : 0.052)
      // SR_MAX cubre la diagonal completa del viewport — sin esquinas visibles
      const SR_MAX    = Math.sqrt(w * w + h * h) * 0.58
      const SR        = SR_BASE + (SR_MAX - SR_BASE) * tEased

      // ── Forma orgánica ───────────────────────────────────────
      // La perturbación baja al crecer: la succión se siente limpia
      const perturbScale = (1 - tEased) * (1 - tEased)
      const nucleusShape = (a: number) =>
        SR * (
          1.00 +
          perturbScale * (
            0.24 * Math.sin(a * 3 + elapsed * 0.30) +
            0.17 * Math.sin(a * 5 - elapsed * 0.44 + 1.1) +
            0.11 * Math.cos(a * 7 + elapsed * 0.19 + 2.4) +
            0.07 * Math.sin(a * 11 - elapsed * 0.33 + 0.6)
          )
        )

      const buildNucleusPath = () => {
        const pts = 96
        ctx.beginPath()
        for (let j = 0; j <= pts; j++) {
          const a = (j / pts) * Math.PI * 2
          const r = nucleusShape(a)
          j === 0
            ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
            : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
        }
        ctx.closePath()
      }

      ctx.save()
      ctx.translate(cx, cy)

      // a. Aura exterior — glow que se atenúa al crecer
      const auraAlpha = ramp * (1 - tEased * 0.8)
      buildNucleusPath()
      ctx.shadowColor = `rgba(155,75,255,${auraAlpha * 0.55})`
      ctx.shadowBlur  = 28
      ctx.fillStyle   = 'rgba(0,0,0,0)'
      ctx.fill()

      const auraGrad = ctx.createRadialGradient(0, 0, SR * 0.6, 0, 0, SR * 2.2)
      auraGrad.addColorStop(0,   `rgba(150,70,245,${auraAlpha * 0.22})`)
      auraGrad.addColorStop(0.6, `rgba(110,45,200,${auraAlpha * 0.08})`)
      auraGrad.addColorStop(1,   'rgba(80,30,170,0)')
      ctx.shadowBlur = 0
      ctx.fillStyle  = auraGrad
      ctx.beginPath()
      ctx.arc(0, 0, SR * 2.2, 0, Math.PI * 2)
      ctx.fill()

      // b. Interior del núcleo (clip al contorno orgánico)
      ctx.save()
      buildNucleusPath()
      ctx.clip()

      // Materia oscura densa — casi negro con tinte violeta profundo
      ctx.fillStyle = `rgba(5,1,16,${ramp * 0.94})`
      ctx.fillRect(-SR * 2.5, -SR * 2.5, SR * 5, SR * 5)

      // Bolsas de plasma: se atenúan al expandirse (no luchan con el fondo)
      const plasmaAlpha = 1 - tEased * 0.85
      for (let i = 0; i < 4; i++) {
        const pt = elapsed * (0.25 + i * 0.08) + i * 1.6
        const px = Math.cos(pt)        * SR * 0.38
        const py = Math.sin(pt * 1.27) * SR * 0.34
        const pr = SR * (0.36 + 0.12 * Math.sin(elapsed * 0.4 + i))
        const pg = ctx.createRadialGradient(px, py, 0, px, py, pr)
        pg.addColorStop(0,   `rgba(210,140,255,${ramp * plasmaAlpha * (0.38 + 0.14 * Math.sin(elapsed * 0.6 + i))})`)
        pg.addColorStop(0.5, `rgba(155,75,240,${ramp * plasmaAlpha * 0.18})`)
        pg.addColorStop(1,   'rgba(100,40,180,0)')
        ctx.fillStyle = pg
        ctx.fillRect(-SR * 2.5, -SR * 2.5, SR * 5, SR * 5)
      }

      // Luminosidad central — corazón de la masa
      const innerCore = ctx.createRadialGradient(0, 0, 0, 0, 0, SR * 0.55)
      innerCore.addColorStop(0,   `rgba(220,160,255,${ramp * 0.45})`)
      innerCore.addColorStop(0.5, `rgba(170,90,255,${ramp * 0.22})`)
      innerCore.addColorStop(1,   'rgba(120,55,220,0)')
      ctx.fillStyle = innerCore
      ctx.fillRect(-SR * 2.5, -SR * 2.5, SR * 5, SR * 5)

      ctx.restore() // quita clip

      // c. Contorno vivo — desaparece al crecer
      const strokeAlpha = ramp * 0.65 * (1 - tEased * 0.95)
      if (strokeAlpha > 0.01) {
        buildNucleusPath()
        ctx.shadowColor = `rgba(175,95,255,${ramp * 0.80 * (1 - tEased)})`
        ctx.shadowBlur  = 12
        ctx.strokeStyle = `rgba(190,110,255,${strokeAlpha})`
        ctx.lineWidth   = 1.2
        ctx.stroke()
      }

      ctx.restore()

      // ── Máscara radial ───────────────────────────────────────
      // En reposo contiene el núcleo dentro del portal.
      // Durante la transición se disuelve para que el núcleo pueda
      // crecer sin límite y tragar la pantalla.
      const maskStrength = 1 - tEased
      if (maskStrength > 0.01) {
        const maskR  = portalRef * (1 + tEased * 0.8)
        const mask   = ctx.createRadialGradient(cx, cy, maskR * 0.70, cx, cy, maskR * 1.08)
        mask.addColorStop(0,   'rgba(0,0,0,0)')
        mask.addColorStop(0.6, 'rgba(0,0,0,0)')
        mask.addColorStop(1,   `rgba(0,0,0,${maskStrength})`)
        ctx.save()
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = mask
        ctx.fillRect(0, 0, w, h)
        ctx.restore()
      }
    }

    raf = requestAnimationFrame(drawLoop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'normal' }}
    />
  )
}

/* ── HeroOverlay ─────────────────────────────────────────── */
function HeroOverlay() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `rgba(5,7,11,${OVERLAY_DESKTOP})` }}
      />
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{ background: `rgba(5,7,11,${OVERLAY_MOBILE_EXTRA})` }}
      />
      {/* Fade inferior — sella con la siguiente sección */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #05070B 10%, rgba(5,7,11,0.5) 44%, transparent 100%)',
        }}
      />
      {/* Fade superior — sella con el nav */}
      <div
        className="absolute inset-x-0 top-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #05070B 0%, transparent 100%)' }}
      />
    </>
  )
}

/* ── HeroLayers ──────────────────────────────────────────── */
// Wrapper fixed que agrupa todas las capas visuales del hero.
// Fade basado en scrollY de la ventana: se va exactamente cuando
// la sección Evidence entra al viewport → cross-dissolve limpio.
export default function HeroLayers() {
  const { scrollY } = useScroll()

  const bgScale     = useTransform(scrollY, SCALE_X, SCALE_Y)
  const heroOpacity = useTransform(scrollY, [FADE_START, FADE_END], [1, 0])

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: heroOpacity }}
    >
      <HeroBackground scale={bgScale} />
      <PortalPulse />
      <HeroOverlay />
    </motion.div>
  )
}
