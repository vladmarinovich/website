/**
 * Sección Hero — primera pantalla del sitio.
 *
 * Video de fondo con overlay oscuro para mantener legibilidad.
 * El texto se ancla en la parte inferior para que el video
 * y la escena 3D sean el protagonista visual.
 *
 * CTAs:
 *  - Primario → scroll a #contact
 *  - Secundario → scroll a #evidence
 *
 * Animaciones de entrada: eyebrow → título → subtítulo → CTAs
 * con stagger de 0.10s entre elementos.
 */

import { siteCopy } from '@/content/siteCopy'
import { FadeUp } from '@/components/ui/FadeUp'

export default function Hero() {
  const c = siteCopy.hero

  return (
    <section id="hero" className="relative min-h-screen flex items-end pb-24 px-6 md:px-12 overflow-hidden">

      {/* Video de fondo — autoplay silencioso en loop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
        src="/assets/video/hero.mp4"
      />

      {/* Fade inferior — disuelve el video hacia el fondo oscuro */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #05070B 25%, rgba(5,7,11,0.4) 60%, transparent 100%)' }}
      />
      {/* Fade superior — evita el corte abrupto en el loop */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #05070B 0%, transparent 100%)' }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">

        {/* Eyebrow — disponibilidad actual */}
        <FadeUp delay={0.05}>
          <p className="font-mono text-xs tracking-[0.25em] text-accent-cyan mb-6 uppercase">
            {c.eyebrow}
          </p>
        </FadeUp>

        {/* Titular principal */}
        <FadeUp delay={0.15}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-textPrimary leading-none tracking-tight max-w-4xl mb-6">
            {c.title}
          </h1>
        </FadeUp>

        {/* Subtítulo */}
        <FadeUp delay={0.25}>
          <p className="text-textSecondary text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            {c.subtitle}
          </p>
        </FadeUp>

        {/* CTAs */}
        <FadeUp delay={0.35}>
          <div className="flex gap-4">
            <a
              href="#contact"
              className="px-6 py-3 bg-accent-cyan text-background font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity"
            >
              {c.ctaPrimary}
            </a>
            <a
              href="#evidence"
              className="px-6 py-3 border border-white/10 text-textSecondary font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:border-white/25 hover:text-textPrimary transition-all"
            >
              {c.ctaSecondary}
            </a>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
