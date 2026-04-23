/**
 * BrowserFrame — marco de navegador premium para los screenshots.
 *
 * Chrome minimalista: barra superior con tres puntos + URL bar falsa.
 * La imagen llena el área de contenido sin padding ni distorsión.
 */

interface BrowserFrameProps {
  src: string
  alt: string
}

export function BrowserFrame({ src, alt }: BrowserFrameProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-white/[0.08] bg-surface shadow-[0_8px_40px_rgba(0,0,0,0.6)]">

      {/* Chrome del navegador */}
      <div className="flex items-center gap-2 px-4 py-3 bg-surfaceSoft border-b border-white/[0.06]">
        {/* Tres puntos */}
        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
        {/* URL bar falsa */}
        <div className="ml-3 flex-1 h-5 rounded bg-white/[0.04] max-w-xs" />
      </div>

      {/* Screenshot */}
      <img
        src={src}
        alt={alt}
        className="w-full block"
        draggable={false}
        loading="lazy"
      />
    </div>
  )
}
