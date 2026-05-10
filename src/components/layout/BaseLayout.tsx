/**
 * Layout base que envuelve todas las páginas.
 *
 * Monta el Nav en posición fija y el contenido principal
 * en z-index 10 (por encima de la escena 3D que está en z-index 0).
 */

import type { ReactNode } from 'react'
import Nav from '@/components/nav/Nav'
import Footer from '@/components/layout/Footer'

interface BaseLayoutProps {
  children: ReactNode
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="relative min-h-screen text-textPrimary">
      <Nav />
      {/* z-10 garantiza que el contenido se muestre sobre el Canvas 3D */}
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}
