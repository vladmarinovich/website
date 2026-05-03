/**
 * SectionEyebrow — eyebrow numerado editorial.
 *
 * Patrón: "(01) TRABAJO" — número en muted, label en acento.
 * Coherente con el Pencil storyboard donde cada sección
 * tiene su taxonomía lettered visible.
 *
 * Props:
 *  num   → "(01)"–"(06)" (string para control total del formato)
 *  label → "TRABAJO" (uppercase por convención, pero flexible)
 *  color → clase de color Tailwind para label + tint del número
 */

interface SectionEyebrowProps {
  num: string
  label: string
  /** Clase de texto Tailwind — se aplica al label completo.
   *  El número usa la misma clase pero a /45 de opacity. */
  colorClass?: string
  className?: string
}

export function SectionEyebrow({
  num,
  label,
  colorClass = 'text-accent-cyan',
  className = '',
}: SectionEyebrowProps) {
  return (
    <p
      className={`font-mono text-xs md:text-sm tracking-[0.32em] uppercase mb-6 flex items-center gap-3 ${className}`}
    >
      <span className={`${colorClass} opacity-45`}>{num}</span>
      <span className={`${colorClass} opacity-90`}>{label}</span>
    </p>
  )
}
