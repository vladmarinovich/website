/**
 * Barra de navegación fija con efecto frosted glass al hacer scroll.
 *
 * - Transparente en la parte superior de la página
 * - Aplica blur + fondo oscuro semitransparente cuando scrollY > 48px
 * - Los links usan scroll suave hacia las secciones (anchor)
 * - Animación de entrada con Framer Motion al montar
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'

export default function Nav() {
  // Controla si el nav muestra el fondo frosted glass
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Activa el fondo después de 48px de scroll (equivale a ~ 3rem)
    const handler = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Scroll suave a la sección correspondiente al anchor
  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        // Frosted glass: aparece progresivamente con el scroll
        backgroundColor: scrolled ? 'rgba(5,7,11,0.88)' : 'transparent',
        backdropFilter:  scrolled ? 'blur(16px)' : 'none',
        borderBottom:    scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'background-color 0.4s, backdrop-filter 0.4s, border-color 0.4s',
      }}
      className="fixed top-0 inset-x-0 z-50 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">

        {/* Logo — vuelve al top al hacer click */}
        <a href="#" className="flex items-center hover:opacity-80 transition-opacity">
          <img
            src="/assets/images/logo.svg"
            alt={siteCopy.nav.brand}
            className="h-6 w-auto"
          />
        </a>

        {/* Links de navegación — solo visibles en desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {siteCopy.nav.links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleAnchor(e, `#${link.id}`)}
              className="font-mono text-xs tracking-[0.15em] text-textSecondary hover:text-textPrimary transition-colors uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA principal — scroll a la sección de contacto */}
        <a
          href="#contact"
          onClick={(e) => handleAnchor(e, '#contact')}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 bg-white/[0.03] font-mono text-xs tracking-[0.15em] text-textSecondary hover:text-textPrimary hover:border-white/20 transition-all uppercase"
        >
          {siteCopy.nav.cta}
        </a>

      </div>
    </motion.header>
  )
}
