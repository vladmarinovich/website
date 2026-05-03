/**
 * Contact — sección de cierre. Refinada (post plan de dirección artística).
 *
 * Cambio mayor: ya NO hay zoom blanco dramático. La sección se mantiene
 * oscura de inicio a fin, fiel a "premium silencioso inevitable".
 *
 * Composición:
 *  - Fondo: dark base #05070B
 *  - Atmósfera: la imagen footer-desktop al fondo, opacity 18%, blur 12px,
 *    como un horizonte cálido que se intuye, no protagoniza
 *  - Eyebrow + Title + Body centrados, jerarquía editorial
 *  - CTA primario cyan filled (mismo patrón que Hero)
 *  - CTA secundario underline text-link
 *  - Firma SVG en blanco/cyan abajo, sello final
 *
 * Scroll choreography simplificada:
 *  - 0–18%: copy reveal
 *  - 22–40%: firma reveal
 *  - El resto: sticky dwell para dar peso al cierre
 */

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useUIStore } from '@/store/uiStore'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

/* ── EarthMoon ───────────────────────────────────────────────
 * Canvas 2D: Tierra con rotación + terminator día/noche + Luna orbitando.
 * Se renderiza como fondo de la sección Contact.
 * Luz fija top-left, continentes mapeados en esfera, nube y casquetes polares.
 */
function EarthMoon() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const t0 = performance.now()

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Continentes: [longitud, latitud, rx, ry] en fracciones de ER
    // Posiciones aproximadas reales en la esfera
    const CONTS = [
      { lon:  0.40, lat:  0.50, rx: 0.28, ry: 0.20 },  // Europa / N.Africa
      { lon:  0.65, lat: -0.05, rx: 0.22, ry: 0.32 },  // Africa central-sur
      { lon:  1.35, lat:  0.38, rx: 0.38, ry: 0.28 },  // Asia
      { lon:  1.92, lat: -0.38, rx: 0.18, ry: 0.14 },  // Australia
      { lon: -1.25, lat:  0.40, rx: 0.22, ry: 0.30 },  // N. América
      { lon: -1.45, lat: -0.28, rx: 0.16, ry: 0.24 },  // S. América
    ]

    // Luz top-left fija
    const LX = -0.55  // componente x de la dirección de luz (negativo = viene desde izq)
    const LY = -0.45  // componente y (negativo = viene desde arriba)

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const elapsed = (now - t0) / 1000
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Tierra anclada a la esquina inferior-derecha — parcialmente fuera de cuadro.
      // Lectura: planeta asomando al borde, no pelota centrada.
      const ER = Math.min(w, h) * (w < 768 ? 0.42 : 0.36)
      const cx = w + ER * 0.18   // centro fuera del viewport por la derecha
      const cy = h + ER * 0.10   // centro fuera por abajo
      const rotation = elapsed * 0.032  // rotación de la Tierra (~3.2% por segundo)

      // ── LUNA ─────────────────────────────────────────────────
      // Órbita alrededor de la Tierra (ahora en la esquina). Mantenemos
      // la luna cercana para que respire en el frame sin invadir el texto.
      const moonOrbitRX = ER * 1.55
      const moonOrbitRY = ER * 0.62  // órbita inclinada, más plana
      const moonT       = elapsed * 0.085
      const moonR       = ER * 0.22
      const moonX = cx + Math.cos(moonT) * moonOrbitRX
      const moonY = cy + Math.sin(moonT) * moonOrbitRY
      const moonBehind = Math.sin(moonT) < 0  // detrás de la Tierra

      const drawMoon = () => {
        ctx.save()
        // Glow tenue
        const atmo = ctx.createRadialGradient(moonX, moonY, moonR * 0.85, moonX, moonY, moonR * 1.7)
        atmo.addColorStop(0, 'rgba(205,205,215,0.07)')
        atmo.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = atmo
        ctx.beginPath(); ctx.arc(moonX, moonY, moonR * 1.7, 0, Math.PI * 2); ctx.fill()

        // Superficie
        const surf = ctx.createRadialGradient(
          moonX + moonR * LX * 0.40, moonY + moonR * LY * 0.40, moonR * 0.04,
          moonX, moonY, moonR
        )
        surf.addColorStop(0,    'rgba(212,212,218,0.93)')
        surf.addColorStop(0.52, 'rgba(152,150,160,0.88)')
        surf.addColorStop(1,    'rgba(22,20,32,0.86)')
        ctx.beginPath(); ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
        ctx.fillStyle = surf; ctx.fill()

        // Cráteres
        const craters: [number, number, number][] = [
          [-0.24,-0.17,0.09],[0.27,0.23,0.06],[-0.34,0.27,0.05],[0.08,-0.32,0.07]
        ]
        for (const [ox,oy,r] of craters) {
          ctx.beginPath()
          ctx.arc(moonX + ox*moonR, moonY + oy*moonR, r*moonR, 0, Math.PI*2)
          ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.fill()
        }
        ctx.restore()
      }

      if (moonBehind) drawMoon()

      // ── TIERRA ───────────────────────────────────────────────
      ctx.save()

      // Atmósfera exterior
      const atmoR = ctx.createRadialGradient(cx, cy, ER * 0.92, cx, cy, ER * 1.58)
      atmoR.addColorStop(0,   'rgba(60,125,215,0.30)')
      atmoR.addColorStop(0.5, 'rgba(38,95,180,0.13)')
      atmoR.addColorStop(1,   'rgba(18,55,145,0)')
      ctx.beginPath(); ctx.arc(cx, cy, ER * 1.58, 0, Math.PI * 2)
      ctx.fillStyle = atmoR; ctx.fill()

      // Océanos
      const ocean = ctx.createRadialGradient(
        cx + ER * LX * 0.52, cy + ER * LY * 0.52, ER * 0.04,
        cx, cy, ER
      )
      ocean.addColorStop(0,    'rgba(52,130,195,0.96)')
      ocean.addColorStop(0.38, 'rgba(26,84,152,0.94)')
      ocean.addColorStop(0.72, 'rgba(11,48,110,0.93)')
      ocean.addColorStop(1,    'rgba(4,12,34,0.97)')
      ctx.beginPath(); ctx.arc(cx, cy, ER, 0, Math.PI * 2)
      ctx.fillStyle = ocean; ctx.fill()

      // Continentes — clip al círculo
      ctx.beginPath(); ctx.arc(cx, cy, ER, 0, Math.PI * 2); ctx.clip()

      for (const c of CONTS) {
        const lon = c.lon + rotation
        // Proyección esférica simple
        const xS =  Math.cos(c.lat) * Math.sin(lon)
        const yS =  Math.sin(c.lat)
        const zS =  Math.cos(c.lat) * Math.cos(lon)  // >0 = cara visible
        if (zS < -0.12) continue
        const alpha   = Math.max(0, Math.min(1, (zS + 0.12) / 0.40))
        const scaleZ  = 0.45 + zS * 0.55  // compresión perspectiva
        const screenX = cx + ER * xS
        const screenY = cy - ER * yS * 0.94
        ctx.save()
        ctx.globalAlpha = alpha * 0.80
        ctx.translate(screenX, screenY)
        // Masa continental principal
        ctx.beginPath()
        ctx.ellipse(0, 0, c.rx * ER * scaleZ, c.ry * ER * 0.90, lon * 0.08, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(52,98,48,0.85)'; ctx.fill()
        // Acento árido (desierto / interior)
        ctx.beginPath()
        ctx.ellipse(c.rx*ER*0.22*scaleZ, c.ry*ER*0.10, c.rx*ER*0.40*scaleZ, c.ry*ER*0.32, 0.4, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(128,98,55,0.28)'; ctx.fill()
        ctx.restore()
      }

      // Casquetes polares
      const drawIce = (yOff: number, size: number) => {
        const g = ctx.createRadialGradient(cx, cy + yOff*ER, 0, cx, cy + yOff*ER, size*ER)
        g.addColorStop(0,    'rgba(218,232,255,0.90)')
        g.addColorStop(0.55, 'rgba(198,218,255,0.45)')
        g.addColorStop(1,    'rgba(178,208,255,0)')
        ctx.save(); ctx.globalAlpha = 1
        ctx.beginPath(); ctx.arc(cx, cy + yOff*ER, size*ER, 0, Math.PI*2)
        ctx.fillStyle = g; ctx.fill(); ctx.restore()
      }
      drawIce(-0.80, 0.30)
      drawIce( 0.80, 0.24)

      // Nubes — wispy, órbita lenta
      const cloudT = elapsed * 0.016
      ctx.globalAlpha = 1
      for (let i = 0; i < 7; i++) {
        const ca  = cloudT + (i / 7) * Math.PI * 2
        const lat = Math.sin(ca * 0.65) * 0.48
        const xS2 = Math.cos(lat) * Math.sin(ca)
        const yS2 = Math.sin(lat)
        const zS2 = Math.cos(lat) * Math.cos(ca)
        if (zS2 < 0.05) continue
        const cX  = cx + ER * xS2
        const cY  = cy - ER * yS2 * 0.94
        const cA  = zS2 * 0.17
        const cG  = ctx.createRadialGradient(cX, cY, 0, cX, cY, ER * 0.17)
        cG.addColorStop(0, `rgba(238,244,255,${cA})`); cG.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = cG
        ctx.beginPath(); ctx.arc(cX, cY, ER * 0.17, 0, Math.PI * 2); ctx.fill()
      }

      ctx.restore()  // fin clip

      // Terminator día/noche
      ctx.save()
      ctx.beginPath(); ctx.arc(cx, cy, ER, 0, Math.PI * 2); ctx.clip()
      const nightG = ctx.createRadialGradient(
        cx - ER * LX * 0.62, cy - ER * LY * 0.62, 0,
        cx, cy, ER
      )
      nightG.addColorStop(0,    'rgba(0,0,0,0)')
      nightG.addColorStop(0.42, 'rgba(0,0,0,0.09)')
      nightG.addColorStop(0.66, 'rgba(0,0,0,0.52)')
      nightG.addColorStop(1,    'rgba(0,0,0,0.90)')
      ctx.fillStyle = nightG
      ctx.beginPath(); ctx.arc(cx, cy, ER, 0, Math.PI * 2); ctx.fill()
      ctx.restore()

      // Luz especular (highlight en zona iluminada)
      ctx.save()
      ctx.beginPath(); ctx.arc(cx, cy, ER, 0, Math.PI * 2); ctx.clip()
      const specG = ctx.createRadialGradient(
        cx + ER * LX * 0.52, cy + ER * LY * 0.52, 0,
        cx + ER * LX * 0.52, cy + ER * LY * 0.52, ER * 0.55
      )
      specG.addColorStop(0, 'rgba(255,255,255,0.13)')
      specG.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = specG
      ctx.fillRect(0, 0, w, h)
      ctx.restore()

      // Rim light atmosférico (borde cyan tenue)
      ctx.save()
      const rimG = ctx.createRadialGradient(cx, cy, ER * 0.94, cx, cy, ER * 1.08)
      rimG.addColorStop(0,   'rgba(63,180,230,0.00)')
      rimG.addColorStop(0.5, 'rgba(63,180,230,0.14)')
      rimG.addColorStop(1,   'rgba(63,180,230,0.00)')
      ctx.beginPath(); ctx.arc(cx, cy, ER * 1.08, 0, Math.PI * 2)
      ctx.fillStyle = rimG; ctx.fill()
      ctx.restore()

      if (!moonBehind) drawMoon()

      // Viñeta dirigida — oscurece el lado opuesto al planeta para que
      // el texto centro-izquierdo se lea limpio sin tapar el planeta.
      const vgn = ctx.createRadialGradient(
        w * 0.30, h * 0.45, 0,
        w * 0.30, h * 0.45, Math.max(w, h) * 0.85
      )
      vgn.addColorStop(0,    'rgba(5,7,11,0.55)')
      vgn.addColorStop(0.55, 'rgba(5,7,11,0.18)')
      vgn.addColorStop(1,    'rgba(5,7,11,0)')
      ctx.fillStyle = vgn; ctx.fillRect(0, 0, w, h)
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

export default function Contact() {
  const c          = siteCopy.contact
  const sectionRef = useRef<HTMLElement>(null)
  const reduced    = useReducedMotion()
  const openCalcom = useUIStore((s) => s.setCalcomOpen)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Atmósfera de la imagen — entra suave, NUNCA toma protagonismo
  const atmoOpacity = useTransform(scrollYProgress, [0, 0.18, 0.6], [0, 0.18, 0.10])

  // Copy reveal — temprano, decidido
  const contentOpacity = useTransform(scrollYProgress, [0.04, 0.22], [0, 1])
  const contentY       = useTransform(scrollYProgress, [0.04, 0.22], [24, 0])

  // Firma reveal — un beat después
  const signatureOpacity = useTransform(scrollYProgress, [0.22, 0.42], [0, 1])
  const signatureY       = useTransform(scrollYProgress, [0.22, 0.42], [12, 0])

  const staticStyle = reduced
    ? { opacity: 1, y: 0 }
    : { opacity: contentOpacity, y: contentY }

  const staticSig = reduced
    ? { opacity: 1, y: 0 }
    : { opacity: signatureOpacity, y: signatureY }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative"
      style={{ minHeight: '180vh' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-background">

        {/* Tierra + Luna — fondo espacial de cierre */}
        <EarthMoon />

        {/* Atmósfera: imagen al fondo con blur, opacity baja — NO crece, NO domina */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: reduced ? 0.10 : atmoOpacity,
            filter: 'blur(20px)',
            transform: 'scale(1.05)',
          }}
          aria-hidden="true"
        >
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet="/assets/images/footer-desktop.webp"
              type="image/webp"
            />
            <img
              src="/assets/images/footer-mobile.webp"
              alt=""
              draggable={false}
              className="w-full h-full object-cover object-center select-none"
            />
          </picture>
        </motion.div>

        {/* Vignette radial sutil para anclar el centro */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 55%, transparent 0%, rgba(5,7,11,0.7) 100%)',
          }}
        />

        {/* Contenido editorial central */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 md:px-12"
          style={staticStyle}
        >
          <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center">

            <SectionEyebrow num="(06)" label={c.eyebrow} colorClass="text-accent-cyan" className="mb-8 justify-center" />

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-textPrimary leading-[1.04] tracking-[-0.02em] mb-8 max-w-3xl">
              {c.title}
            </h2>

            <p className="text-textSecondary text-lg md:text-xl max-w-xl leading-[1.55] mb-12">
              {c.body}
            </p>

            {/* CTA primario — cyan filled (mismo patrón que Hero) */}
            <button
              type="button"
              onClick={() => openCalcom(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent-cyan text-background font-mono text-sm tracking-[0.16em] uppercase rounded-sm hover:opacity-92 transition-opacity mb-5 cursor-pointer"
            >
              <span>{c.ctaPrimary}</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                ↗
              </span>
            </button>

            {/* Microcopy bajo el primario */}
            <p className="font-mono text-[11px] text-textSecondary/55 tracking-[0.22em] uppercase mb-10">
              {c.microcopy}
            </p>

            {/* CTA secundario — text link */}
            <a
              href="mailto:consultor@vladmarinovich.com"
              className="font-mono text-sm tracking-[0.14em] text-textSecondary/70 hover:text-textPrimary uppercase underline underline-offset-[6px] decoration-textSecondary/25 hover:decoration-textPrimary/60 transition-colors"
            >
              {c.ctaSecondary}
            </a>

          </div>
        </motion.div>

        {/* Firma sello al pie — blanco sobre dark, no negro sobre blanco */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 pb-10 md:pb-14 flex flex-col items-center pointer-events-none"
          style={staticSig}
        >
          <img
            src="/assets/images/logo-vlad.svg"
            alt="Firma Vladislav Marinovich"
            className="h-20 md:h-28 w-auto opacity-90 invert"
            draggable={false}
          />
          <span className="mt-3 font-mono text-[10px] tracking-[0.32em] text-textSecondary/50 uppercase">
            Vladislav Marinovich · 2026
          </span>
        </motion.div>

      </div>
    </section>
  )
}
