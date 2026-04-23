/**
 * Nav — wordmark tipográfico + navegación.
 *
 * Decisión de diseño: el logo-firma vive en Contact, no aquí.
 * Una firma manuscrita miniaturizada en 64px de alto se lee como
 * logotipo corporativo — pierde su naturaleza. En el nav opera un
 * wordmark tipográfico (mayúsculas, mono, tracking abierto) que
 * comunica "marca", no "rúbrica".
 *
 * Indicador de sección activa:
 *  - Dot cyan bajo el link cuya sección está visible.
 *  - Suscrito a sceneStore.activeSection — ya orquestado por scroll.
 *  - Transición con layoutId para que el dot se deslice entre links.
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useSceneStore } from '@/store/sceneStore'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const activeSection = useSceneStore((s) => s.activeSection)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.65, 0.25, 1] }}
      style={{
        backgroundColor: scrolled ? 'rgba(5,7,11,0.82)' : 'transparent',
        backdropFilter:  scrolled ? 'blur(18px) saturate(1.1)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(1.1)' : 'none',
        borderBottom:    scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'background-color 0.45s, backdrop-filter 0.45s, border-color 0.45s',
      }}
      className="fixed top-0 inset-x-0 z-50 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">

        {/* Wordmark — tipográfico, no imagen */}
        <a
          href="#"
          className="group flex items-baseline gap-2 hover:opacity-85 transition-opacity"
          aria-label={siteCopy.nav.brand}
        >
          <span className="font-mono text-xs md:text-sm tracking-[0.32em] text-textPrimary uppercase">
            {siteCopy.nav.wordmark}
          </span>
          <span
            aria-hidden
            className="hidden md:inline-block w-1 h-1 rounded-full bg-accent-cyan opacity-70 group-hover:opacity-100 transition-opacity"
          />
        </a>

        {/* Links de navegación */}
        <nav className="hidden md:flex items-center gap-10">
          {siteCopy.nav.links.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleAnchor(e, `#${link.id}`)}
                className={`relative font-mono text-xs tracking-[0.22em] uppercase transition-colors py-1 ${
                  isActive ? 'text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-1 h-1 rounded-full bg-accent-cyan"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            )
          })}
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => handleAnchor(e, '#contact')}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-white/15 bg-white/[0.02] font-mono text-xs tracking-[0.16em] text-textSecondary hover:text-textPrimary hover:border-white/30 transition-all uppercase"
        >
          {siteCopy.nav.cta}
        </a>

      </div>
    </motion.header>
  )
}
