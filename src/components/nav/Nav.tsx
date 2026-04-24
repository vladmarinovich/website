/**
 * Nav — wordmark tipográfico + navegación desktop + menú mobile.
 *
 * Mobile (<768px): ícono hamburger → overlay full-screen con links + CTA.
 * Overlay cierra al hacer clic en un link o en el área exterior.
 * Lenis se pausa mientras el overlay está abierto.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteCopy } from '@/content/siteCopy'
import { useSceneStore } from '@/store/sceneStore'

const EASE: [number, number, number, number] = [0.2, 0.65, 0.25, 1]

export default function Nav() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const activeSection = useSceneStore((s) => s.activeSection)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    // Pequeño delay para que el overlay cierre antes de scrollear
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, menuOpen ? 220 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          backgroundColor:     scrolled || menuOpen ? 'rgba(5,7,11,0.92)' : 'transparent',
          backdropFilter:      scrolled || menuOpen ? 'blur(18px) saturate(1.1)' : 'none',
          WebkitBackdropFilter:scrolled || menuOpen ? 'blur(18px) saturate(1.1)' : 'none',
          borderBottom:        scrolled || menuOpen ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background-color 0.45s, backdrop-filter 0.45s, border-color 0.45s',
        }}
        className="fixed top-0 inset-x-0 z-50 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">

          {/* Wordmark */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
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

          {/* Links desktop */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Navegación principal">
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

          {/* CTA desktop */}
          <a
            href="#contact"
            onClick={(e) => handleAnchor(e, '#contact')}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-white/15 bg-white/[0.02] font-mono text-xs tracking-[0.16em] text-textSecondary hover:text-textPrimary hover:border-white/30 transition-all uppercase"
          >
            {siteCopy.nav.cta}
          </a>

          {/* Hamburger mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] cursor-pointer"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="block w-5 h-px bg-textPrimary origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="block w-5 h-px bg-textPrimary"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="block w-5 h-px bg-textPrimary origin-center"
            />
          </button>

        </div>
      </motion.header>

      {/* Overlay mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{ background: 'rgba(5,7,11,0.97)', backdropFilter: 'blur(24px)' }}
          >
            {/* Contenido centrado verticalmente */}
            <nav
              className="flex flex-col items-center justify-center flex-1 gap-10"
              aria-label="Menú mobile"
            >
              {siteCopy.nav.links.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleAnchor(e, `#${link.id}`)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: EASE, delay: i * 0.055 }}
                  className="font-mono text-sm tracking-[0.28em] uppercase text-textSecondary hover:text-textPrimary transition-colors py-2"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* CTA mobile */}
              <motion.a
                href="#contact"
                onClick={(e) => handleAnchor(e, '#contact')}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: EASE, delay: siteCopy.nav.links.length * 0.055 }}
                className="mt-4 px-8 py-3 border border-white/20 font-mono text-xs tracking-[0.22em] uppercase text-textPrimary hover:border-white/40 transition-colors"
              >
                {siteCopy.nav.cta}
              </motion.a>
            </nav>

            {/* Wordmark al fondo — identidad mientras el menú está abierto */}
            <div className="pb-10 flex justify-center">
              <span className="font-mono text-[10px] tracking-[0.32em] text-textSecondary/30 uppercase">
                {siteCopy.nav.wordmark}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
