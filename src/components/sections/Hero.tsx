/**
 * Sección Hero — primera pantalla del sitio.
 *
 * Ocupa el 100% de la altura de la ventana (min-h-screen).
 * El texto se ancla en la parte inferior para que la escena 3D
 * sea el protagonista visual durante el primer scroll.
 *
 * CTAs:
 *  - Primario → scroll a #contact
 *  - Secundario → scroll a #evidence
 */

import { siteCopy } from '@/content/siteCopy'

export default function Hero() {
  const c = siteCopy.hero

  return (
    <section id="hero" className="relative min-h-screen flex items-end pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto w-full">

        {/* Eyebrow — disponibilidad actual */}
        <p className="font-mono text-xs tracking-[0.25em] text-accent-cyan mb-6 uppercase">
          {c.eyebrow}
        </p>

        {/* Titular principal — tipografía de display a máxima escala */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-textPrimary leading-none tracking-tight max-w-4xl mb-6">
          {c.title}
        </h1>

        {/* Subtítulo — explica el valor en detalle */}
        <p className="text-textSecondary text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          {c.subtitle}
        </p>

        {/* CTAs en fila */}
        <div className="flex gap-4">
          {/* CTA primario — relleno con color de acento */}
          <a
            href="#contact"
            className="px-6 py-3 bg-accent-cyan text-background font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity"
          >
            {c.ctaPrimary}
          </a>

          {/* CTA secundario — borde sutil, estilo ghost */}
          <a
            href="#evidence"
            className="px-6 py-3 border border-white/10 text-textSecondary font-mono text-xs tracking-[0.15em] uppercase rounded-sm hover:border-white/25 hover:text-textPrimary transition-all"
          >
            {c.ctaSecondary}
          </a>
        </div>

      </div>
    </section>
  )
}
